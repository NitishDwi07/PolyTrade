package services

import (
	"errors"
	"polytrade/internal/models"
	"time"

	"gorm.io/gorm"
)

const (
	defaultTradeLimit = 25
	maxTradeLimit     = 100
)

type MarketTradesResponse struct {
	MarketID uint                 `json:"marketId"`
	Trades   []MarketTradeSummary `json:"trades"`
}

type MarketTradeSummary struct {
	ID                uint      `json:"id"`
	UserID            uint      `json:"userId"`
	Username          string    `json:"username"`
	Name              string    `json:"name"`
	Side              string    `json:"side"`
	Amount            float64   `json:"amount"`
	Price             float64   `json:"price"`
	Shares            float64   `json:"shares"`
	CopiedFromTradeID *uint     `json:"copiedFromTradeId"`
	IsCopied          bool      `json:"isCopied"`
	CreatedAt         time.Time `json:"createdAt"`
}

type UserTradesResponse struct {
	UserID uint               `json:"userId"`
	Trades []UserTradeSummary `json:"trades"`
}

type UserTradeSummary struct {
	ID                uint      `json:"id"`
	MarketID          uint      `json:"marketId"`
	MarketQuestion    string    `json:"marketQuestion"`
	Side              string    `json:"side"`
	Amount            float64   `json:"amount"`
	Price             float64   `json:"price"`
	Shares            float64   `json:"shares"`
	CopiedFromTradeID *uint     `json:"copiedFromTradeId"`
	IsCopied          bool      `json:"isCopied"`
	CreatedAt         time.Time `json:"createdAt"`
}

type CopyActivityResponse struct {
	UserID       uint                  `json:"userId"`
	CopiedTrades []CopiedTradeActivity `json:"copiedTrades"`
}

type CopiedTradeActivity struct {
	ID                     uint      `json:"id"`
	MarketID               uint      `json:"marketId"`
	MarketQuestion         string    `json:"marketQuestion"`
	Side                   string    `json:"side"`
	Amount                 float64   `json:"amount"`
	Price                  float64   `json:"price"`
	Shares                 float64   `json:"shares"`
	CopiedFromTradeID      uint      `json:"copiedFromTradeId"`
	OriginalTraderID       uint      `json:"originalTraderId"`
	OriginalTraderUsername string    `json:"originalTraderUsername"`
	CreatedAt              time.Time `json:"createdAt"`
}

func NormalizeLimit(limit int) int {
	if limit <= 0 {
		return defaultTradeLimit
	}
	if limit > maxTradeLimit {
		return maxTradeLimit
	}

	return limit
}

func GetRecentMarketTrades(db *gorm.DB, marketID uint, limit int) (MarketTradesResponse, error) {
	if marketID == 0 {
		return MarketTradesResponse{}, NewServiceError(ErrBadRequest, errors.New("marketId is required"))
	}
	if err := ensureMarketExists(db, marketID); err != nil {
		return MarketTradesResponse{}, err
	}

	var trades []models.Trade
	if err := db.Preload("User").
		Where("market_id = ?", marketID).
		Order("created_at desc").
		Limit(NormalizeLimit(limit)).
		Find(&trades).Error; err != nil {
		return MarketTradesResponse{}, err
	}

	response := MarketTradesResponse{
		MarketID: marketID,
		Trades:   make([]MarketTradeSummary, 0, len(trades)),
	}
	for _, trade := range trades {
		response.Trades = append(response.Trades, MarketTradeSummary{
			ID:                trade.ID,
			UserID:            trade.UserID,
			Username:          trade.User.Username,
			Name:              trade.User.Name,
			Side:              trade.Side,
			Amount:            trade.Amount,
			Price:             trade.Price,
			Shares:            trade.Shares,
			CopiedFromTradeID: trade.CopiedFromTradeID,
			IsCopied:          trade.CopiedFromTradeID != nil,
			CreatedAt:         trade.CreatedAt,
		})
	}

	return response, nil
}

func GetUserTrades(db *gorm.DB, userID uint, limit int) (UserTradesResponse, error) {
	if userID == 0 {
		return UserTradesResponse{}, NewServiceError(ErrBadRequest, errors.New("userId is required"))
	}
	if err := ensureUserExists(db, userID, "user not found"); err != nil {
		return UserTradesResponse{}, err
	}

	var trades []models.Trade
	if err := db.Preload("Market").
		Where("user_id = ?", userID).
		Order("created_at desc").
		Limit(NormalizeLimit(limit)).
		Find(&trades).Error; err != nil {
		return UserTradesResponse{}, err
	}

	response := UserTradesResponse{
		UserID: userID,
		Trades: make([]UserTradeSummary, 0, len(trades)),
	}
	for _, trade := range trades {
		response.Trades = append(response.Trades, UserTradeSummary{
			ID:                trade.ID,
			MarketID:          trade.MarketID,
			MarketQuestion:    trade.Market.Question,
			Side:              trade.Side,
			Amount:            trade.Amount,
			Price:             trade.Price,
			Shares:            trade.Shares,
			CopiedFromTradeID: trade.CopiedFromTradeID,
			IsCopied:          trade.CopiedFromTradeID != nil,
			CreatedAt:         trade.CreatedAt,
		})
	}

	return response, nil
}

func GetCopyActivity(db *gorm.DB, userID uint) (CopyActivityResponse, error) {
	if userID == 0 {
		return CopyActivityResponse{}, NewServiceError(ErrBadRequest, errors.New("userId is required"))
	}
	if err := ensureUserExists(db, userID, "user not found"); err != nil {
		return CopyActivityResponse{}, err
	}

	var trades []models.Trade
	if err := db.Preload("Market").
		Preload("CopiedFromTrade").
		Preload("CopiedFromTrade.User").
		Where("user_id = ? AND copied_from_trade_id IS NOT NULL", userID).
		Order("created_at desc").
		Limit(maxTradeLimit).
		Find(&trades).Error; err != nil {
		return CopyActivityResponse{}, err
	}

	response := CopyActivityResponse{
		UserID:       userID,
		CopiedTrades: make([]CopiedTradeActivity, 0, len(trades)),
	}
	for _, trade := range trades {
		if trade.CopiedFromTradeID == nil || trade.CopiedFromTrade == nil {
			continue
		}

		response.CopiedTrades = append(response.CopiedTrades, CopiedTradeActivity{
			ID:                     trade.ID,
			MarketID:               trade.MarketID,
			MarketQuestion:         trade.Market.Question,
			Side:                   trade.Side,
			Amount:                 trade.Amount,
			Price:                  trade.Price,
			Shares:                 trade.Shares,
			CopiedFromTradeID:      *trade.CopiedFromTradeID,
			OriginalTraderID:       trade.CopiedFromTrade.UserID,
			OriginalTraderUsername: trade.CopiedFromTrade.User.Username,
			CreatedAt:              trade.CreatedAt,
		})
	}

	return response, nil
}

func ensureMarketExists(db *gorm.DB, marketID uint) error {
	var market models.Market
	if err := db.First(&market, marketID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return NewServiceError(ErrNotFound, errors.New("market not found"))
		}
		return err
	}

	return nil
}
