package services

import (
	"errors"
	"fmt"
	"polytrade/internal/models"
	"strings"
	"time"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type TradeResult struct {
	Message    string              `json:"message"`
	Trade      TradeResponse       `json:"trade"`
	NewBalance float64             `json:"newBalance"`
	Position   PositionResponse    `json:"position"`
	Market     TradeMarketSnapshot `json:"market"`
}

type TradeResponse struct {
	ID                uint      `json:"id"`
	UserID            uint      `json:"userId"`
	MarketID          uint      `json:"marketId"`
	Side              string    `json:"side"`
	Amount            float64   `json:"amount"`
	Price             float64   `json:"price"`
	Shares            float64   `json:"shares"`
	CopiedFromTradeID *uint     `json:"copiedFromTradeId"`
	CreatedAt         time.Time `json:"createdAt"`
}

type PositionResponse struct {
	ID             uint    `json:"id"`
	UserID         uint    `json:"userId"`
	MarketID       uint    `json:"marketId"`
	Side           string  `json:"side"`
	Shares         float64 `json:"shares"`
	AveragePrice   float64 `json:"averagePrice"`
	InvestedAmount float64 `json:"investedAmount"`
	Settled        bool    `json:"settled"`
}

type TradeMarketSnapshot struct {
	ID        uint    `json:"id"`
	YesPrice  float64 `json:"yesPrice"`
	NoPrice   float64 `json:"noPrice"`
	YesVolume float64 `json:"yesVolume"`
	NoVolume  float64 `json:"noVolume"`
}

func ExecuteTrade(db *gorm.DB, userID, marketID uint, side string, amount float64) (TradeResult, error) {
	side = strings.ToUpper(strings.TrimSpace(side))
	if userID == 0 {
		return TradeResult{}, NewServiceError(ErrBadRequest, errors.New("userId is required"))
	}
	if marketID == 0 {
		return TradeResult{}, NewServiceError(ErrBadRequest, errors.New("marketId is required"))
	}
	if side != models.TradeSideYes && side != models.TradeSideNo {
		return TradeResult{}, NewServiceError(ErrBadRequest, errors.New("side must be YES or NO"))
	}
	if amount <= 0 {
		return TradeResult{}, NewServiceError(ErrBadRequest, errors.New("amount must be greater than zero"))
	}

	var result TradeResult

	err := db.Transaction(func(tx *gorm.DB) error {
		var user models.User
		var market models.Market

		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).First(&user, userID).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return NewServiceError(ErrNotFound, errors.New("user not found"))
			}
			return err
		}

		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).First(&market, marketID).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return NewServiceError(ErrNotFound, errors.New("market not found"))
			}
			return err
		}

		if market.Status != models.MarketStatusOpen {
			return NewServiceError(ErrMarketClosed, errors.New("market not open"))
		}

		if user.Balance < amount {
			return NewServiceError(ErrInsufficientBalance, errors.New("insufficient balance"))
		}

		price := tradePrice(market, side)
		shares := amount / price

		user.Balance -= amount
		if side == models.TradeSideYes {
			market.YesVolume += amount
		} else {
			market.NoVolume += amount
		}

		trade := models.Trade{
			UserID:   userID,
			MarketID: marketID,
			Side:     side,
			Amount:   amount,
			Price:    price,
			Shares:   shares,
		}

		if err := tx.Save(&user).Error; err != nil {
			return err
		}
		if err := tx.Save(&market).Error; err != nil {
			return err
		}
		if err := tx.Create(&trade).Error; err != nil {
			return err
		}

		walletTransaction := models.WalletTransaction{
			UserID:      userID,
			Amount:      -amount,
			Type:        models.WalletTransactionTradeDebit,
			Description: fmt.Sprintf("%s trade on market #%d", side, marketID),
			ReferenceID: &trade.ID,
		}
		if err := tx.Create(&walletTransaction).Error; err != nil {
			return err
		}

		position, err := upsertPosition(tx, userID, marketID, side, shares, amount)
		if err != nil {
			return err
		}

		yesPrice, noPrice := CalculateMarketPrices(market)
		result = TradeResult{
			Message:    "trade executed",
			Trade:      ToTradeResponse(trade),
			NewBalance: user.Balance,
			Position:   ToPositionResponse(position),
			Market: TradeMarketSnapshot{
				ID:        market.ID,
				YesPrice:  yesPrice,
				NoPrice:   noPrice,
				YesVolume: market.YesVolume,
				NoVolume:  market.NoVolume,
			},
		}

		return nil
	})

	if err != nil {
		return TradeResult{}, err
	}

	return result, nil
}

func ToTradeResponse(trade models.Trade) TradeResponse {
	return TradeResponse{
		ID:                trade.ID,
		UserID:            trade.UserID,
		MarketID:          trade.MarketID,
		Side:              trade.Side,
		Amount:            trade.Amount,
		Price:             trade.Price,
		Shares:            trade.Shares,
		CopiedFromTradeID: trade.CopiedFromTradeID,
		CreatedAt:         trade.CreatedAt,
	}
}

func ToPositionResponse(position models.Position) PositionResponse {
	return PositionResponse{
		ID:             position.ID,
		UserID:         position.UserID,
		MarketID:       position.MarketID,
		Side:           position.Side,
		Shares:         position.Shares,
		AveragePrice:   position.AveragePrice,
		InvestedAmount: position.InvestedAmount,
		Settled:        position.Settled,
	}
}

func tradePrice(market models.Market, side string) float64 {
	yesPrice, noPrice := CalculateMarketPrices(market)
	if side == models.TradeSideYes {
		return yesPrice
	}

	return noPrice
}

func upsertPosition(tx *gorm.DB, userID, marketID uint, side string, shares, amount float64) (models.Position, error) {
	var position models.Position
	err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
		Where("user_id = ? AND market_id = ? AND side = ?", userID, marketID, side).
		First(&position).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		position = models.Position{
			UserID:         userID,
			MarketID:       marketID,
			Side:           side,
			Shares:         shares,
			AveragePrice:   amount / shares,
			InvestedAmount: amount,
			Settled:        false,
		}
		return position, tx.Create(&position).Error
	}
	if err != nil {
		return models.Position{}, err
	}

	position.Shares += shares
	position.InvestedAmount += amount
	position.AveragePrice = position.InvestedAmount / position.Shares

	return position, tx.Save(&position).Error
}
