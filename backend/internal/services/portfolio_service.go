package services

import (
	"errors"
	"polytrade/internal/models"

	"gorm.io/gorm"
)

type PortfolioResponse struct {
	UserID    uint                `json:"userId"`
	Balance   float64             `json:"balance"`
	Positions []PortfolioPosition `json:"positions"`
}

type PortfolioPosition struct {
	MarketID       uint     `json:"marketId"`
	MarketQuestion string   `json:"marketQuestion"`
	Side           string   `json:"side"`
	Shares         float64  `json:"shares"`
	AveragePrice   float64  `json:"averagePrice"`
	InvestedAmount float64  `json:"investedAmount"`
	CurrentPrice   float64  `json:"currentPrice"`
	EstimatedValue float64  `json:"estimatedValue"`
	OpenPnL        float64  `json:"openPnl"`
	Settled        bool     `json:"settled"`
	Payout         *float64 `json:"payout"`
}

func GetPortfolio(db *gorm.DB, userID uint) (PortfolioResponse, error) {
	var user models.User
	if err := db.First(&user, userID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return PortfolioResponse{}, NewServiceError(ErrNotFound, errors.New("user not found"))
		}
		return PortfolioResponse{}, err
	}

	var positions []models.Position
	if err := db.Preload("Market").
		Order("updated_at desc").
		Where("user_id = ?", userID).
		Find(&positions).Error; err != nil {
		return PortfolioResponse{}, err
	}

	response := PortfolioResponse{
		UserID:    user.ID,
		Balance:   user.Balance,
		Positions: make([]PortfolioPosition, 0, len(positions)),
	}

	for _, position := range positions {
		yesPrice, noPrice := CalculateMarketPrices(position.Market)
		currentPrice := yesPrice
		if position.Side == models.TradeSideNo {
			currentPrice = noPrice
		}

		estimatedValue := position.Shares * currentPrice
		openPnL := estimatedValue - position.InvestedAmount
		payout, err := positionPayout(db, position)
		if err != nil {
			return PortfolioResponse{}, err
		}
		if position.Settled {
			openPnL = 0
		}

		response.Positions = append(response.Positions, PortfolioPosition{
			MarketID:       position.MarketID,
			MarketQuestion: position.Market.Question,
			Side:           position.Side,
			Shares:         position.Shares,
			AveragePrice:   position.AveragePrice,
			InvestedAmount: position.InvestedAmount,
			CurrentPrice:   currentPrice,
			EstimatedValue: estimatedValue,
			OpenPnL:        openPnL,
			Settled:        position.Settled,
			Payout:         payout,
		})
	}

	return response, nil
}

func positionPayout(db *gorm.DB, position models.Position) (*float64, error) {
	if !position.Settled {
		return nil, nil
	}

	var resolution models.MarketResolution
	if err := db.Where("market_id = ?", position.MarketID).First(&resolution).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	payout := 0.0
	if resolution.WinningSide == position.Side {
		payout = position.Shares * resolution.PayoutPerShare
	}

	return &payout, nil
}
