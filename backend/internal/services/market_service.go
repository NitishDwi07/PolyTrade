package services

import (
	"errors"
	"polytrade/internal/models"
	"time"

	"gorm.io/gorm"
)

type MarketResponse struct {
	ID          uint       `json:"id"`
	Question    string     `json:"question"`
	Description string     `json:"description"`
	Category    string     `json:"category"`
	Status      string     `json:"status"`
	YesVolume   float64    `json:"yesVolume"`
	NoVolume    float64    `json:"noVolume"`
	TotalVolume float64    `json:"totalVolume"`
	YesPrice    float64    `json:"yesPrice"`
	NoPrice     float64    `json:"noPrice"`
	ClosesAt    *time.Time `json:"closesAt"`
}

func CalculateMarketPrices(market models.Market) (float64, float64) {
	totalVolume := market.YesVolume + market.NoVolume
	if totalVolume <= 0 {
		return 0.5, 0.5
	}

	yesPrice := market.YesVolume / totalVolume
	noPrice := market.NoVolume / totalVolume

	if yesPrice <= 0 {
		yesPrice = 0.5
	}
	if noPrice <= 0 {
		noPrice = 0.5
	}

	return yesPrice, noPrice
}

func ToMarketResponse(market models.Market) MarketResponse {
	yesPrice, noPrice := CalculateMarketPrices(market)

	return MarketResponse{
		ID:          market.ID,
		Question:    market.Question,
		Description: market.Description,
		Category:    market.Category,
		Status:      market.Status,
		YesVolume:   market.YesVolume,
		NoVolume:    market.NoVolume,
		TotalVolume: market.YesVolume + market.NoVolume,
		YesPrice:    yesPrice,
		NoPrice:     noPrice,
		ClosesAt:    market.ClosesAt,
	}
}

func ListMarkets(db *gorm.DB) ([]MarketResponse, error) {
	var markets []models.Market
	if err := db.Order("created_at desc").Find(&markets).Error; err != nil {
		return nil, err
	}

	response := make([]MarketResponse, 0, len(markets))
	for _, market := range markets {
		response = append(response, ToMarketResponse(market))
	}

	return response, nil
}

func GetMarket(db *gorm.DB, marketID uint) (MarketResponse, error) {
	var market models.Market
	if err := db.First(&market, marketID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return MarketResponse{}, NewServiceError(ErrNotFound, errors.New("market not found"))
		}
		return MarketResponse{}, err
	}

	return ToMarketResponse(market), nil
}
