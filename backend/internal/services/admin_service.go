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

type ResolutionResponse struct {
	ID              uint             `json:"id"`
	MarketID        uint             `json:"marketId"`
	WinningSide     string           `json:"winningSide"`
	TotalPool       float64          `json:"totalPool"`
	WinningShares   float64          `json:"winningShares"`
	PayoutPerShare  float64          `json:"payoutPerShare"`
	ResolvedBy      string           `json:"resolvedBy"`
	AlreadyResolved bool             `json:"alreadyResolved"`
	CreatedAt       time.Time        `json:"createdAt"`
	Payouts         []PayoutResponse `json:"payouts"`
}

type PayoutResponse struct {
	UserID uint    `json:"userId"`
	Side   string  `json:"side"`
	Shares float64 `json:"shares"`
	Payout float64 `json:"payout"`
}

type AdminStatsResponse struct {
	Users             int64   `json:"users"`
	Markets           int64   `json:"markets"`
	OpenMarkets       int64   `json:"openMarkets"`
	ResolvedMarkets   int64   `json:"resolvedMarkets"`
	Trades            int64   `json:"trades"`
	TotalVolume       float64 `json:"totalVolume"`
	CopyRelationships int64   `json:"copyRelationships"`
}

func CloseMarket(db *gorm.DB, marketID uint) (MarketResponse, error) {
	if marketID == 0 {
		return MarketResponse{}, NewServiceError(ErrBadRequest, errors.New("marketId is required"))
	}

	var market models.Market
	err := db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).First(&market, marketID).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return NewServiceError(ErrNotFound, errors.New("market not found"))
			}
			return err
		}

		if market.Status == models.MarketStatusResolved {
			return NewServiceError(ErrMarketClosed, errors.New("market already resolved"))
		}

		if market.Status == models.MarketStatusClosed {
			return nil
		}

		market.Status = models.MarketStatusClosed
		return tx.Save(&market).Error
	})
	if err != nil {
		return MarketResponse{}, err
	}

	return ToMarketResponse(market), nil
}

func ResolveMarket(db *gorm.DB, marketID uint, winningSide string, resolvedBy string) (ResolutionResponse, error) {
	winningSide = strings.ToUpper(strings.TrimSpace(winningSide))
	if marketID == 0 {
		return ResolutionResponse{}, NewServiceError(ErrBadRequest, errors.New("marketId is required"))
	}
	if winningSide != models.TradeSideYes && winningSide != models.TradeSideNo {
		return ResolutionResponse{}, NewServiceError(ErrBadRequest, errors.New("winningSide must be YES or NO"))
	}

	var response ResolutionResponse
	err := db.Transaction(func(tx *gorm.DB) error {
		var existing models.MarketResolution
		if err := tx.Where("market_id = ?", marketID).First(&existing).Error; err == nil {
			response = toResolutionResponse(existing, nil, true)
			return nil
		} else if !errors.Is(err, gorm.ErrRecordNotFound) {
			return err
		}

		var market models.Market
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).First(&market, marketID).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return NewServiceError(ErrNotFound, errors.New("market not found"))
			}
			return err
		}

		if market.Status == models.MarketStatusResolved {
			var existingResolution models.MarketResolution
			if err := tx.Where("market_id = ?", marketID).First(&existingResolution).Error; err != nil {
				return err
			}
			response = toResolutionResponse(existingResolution, nil, true)
			return nil
		}

		var positions []models.Position
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
			Where("market_id = ? AND settled = ?", marketID, false).
			Find(&positions).Error; err != nil {
			return err
		}

		totalPool := market.YesVolume + market.NoVolume
		winningShares := 0.0
		for _, position := range positions {
			if position.Side == winningSide {
				winningShares += position.Shares
			}
		}

		payoutPerShare := 0.0
		if winningShares > 0 {
			payoutPerShare = totalPool / winningShares
		}

		resolution := models.MarketResolution{
			MarketID:       market.ID,
			WinningSide:    winningSide,
			TotalPool:      totalPool,
			WinningShares:  winningShares,
			PayoutPerShare: payoutPerShare,
			ResolvedBy:     resolvedBy,
		}
		if err := tx.Create(&resolution).Error; err != nil {
			return err
		}

		payouts := make([]PayoutResponse, 0)
		for index := range positions {
			position := positions[index]
			payout := 0.0

			if position.Side == winningSide && payoutPerShare > 0 {
				payout = position.Shares * payoutPerShare
				if err := creditPayout(tx, position.UserID, resolution.ID, market.ID, payout); err != nil {
					return err
				}
			}

			position.Settled = true
			if err := tx.Save(&position).Error; err != nil {
				return err
			}

			if position.Side == winningSide {
				payouts = append(payouts, PayoutResponse{
					UserID: position.UserID,
					Side:   position.Side,
					Shares: position.Shares,
					Payout: payout,
				})
			}
		}

		market.Status = models.MarketStatusResolved
		if err := tx.Save(&market).Error; err != nil {
			return err
		}

		response = toResolutionResponse(resolution, payouts, false)
		return nil
	})
	if err != nil {
		return ResolutionResponse{}, err
	}

	return response, nil
}

func GetMarketResolution(db *gorm.DB, marketID uint) (ResolutionResponse, error) {
	if marketID == 0 {
		return ResolutionResponse{}, NewServiceError(ErrBadRequest, errors.New("marketId is required"))
	}

	var resolution models.MarketResolution
	if err := db.Where("market_id = ?", marketID).First(&resolution).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ResolutionResponse{}, NewServiceError(ErrNotFound, errors.New("market resolution not found"))
		}
		return ResolutionResponse{}, err
	}

	return toResolutionResponse(resolution, nil, true), nil
}

func GetAdminStats(db *gorm.DB) (AdminStatsResponse, error) {
	var response AdminStatsResponse

	if err := db.Model(&models.User{}).Count(&response.Users).Error; err != nil {
		return AdminStatsResponse{}, err
	}
	if err := db.Model(&models.Market{}).Count(&response.Markets).Error; err != nil {
		return AdminStatsResponse{}, err
	}
	if err := db.Model(&models.Market{}).Where("status = ?", models.MarketStatusOpen).Count(&response.OpenMarkets).Error; err != nil {
		return AdminStatsResponse{}, err
	}
	if err := db.Model(&models.Market{}).Where("status = ?", models.MarketStatusResolved).Count(&response.ResolvedMarkets).Error; err != nil {
		return AdminStatsResponse{}, err
	}
	if err := db.Model(&models.Trade{}).Count(&response.Trades).Error; err != nil {
		return AdminStatsResponse{}, err
	}
	if err := db.Model(&models.Trade{}).Select("COALESCE(SUM(amount), 0)").Scan(&response.TotalVolume).Error; err != nil {
		return AdminStatsResponse{}, err
	}
	if err := db.Model(&models.CopyRelationship{}).Count(&response.CopyRelationships).Error; err != nil {
		return AdminStatsResponse{}, err
	}

	return response, nil
}

func creditPayout(tx *gorm.DB, userID uint, resolutionID uint, marketID uint, payout float64) error {
	if payout <= 0 {
		return nil
	}

	var user models.User
	if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).First(&user, userID).Error; err != nil {
		return err
	}

	user.Balance += payout
	if err := tx.Save(&user).Error; err != nil {
		return err
	}

	transaction := models.WalletTransaction{
		UserID:      userID,
		Amount:      payout,
		Type:        models.WalletTransactionPayout,
		Description: fmt.Sprintf("Payout for market #%d", marketID),
		ReferenceID: &resolutionID,
	}

	return tx.Create(&transaction).Error
}

func toResolutionResponse(resolution models.MarketResolution, payouts []PayoutResponse, alreadyResolved bool) ResolutionResponse {
	if payouts == nil {
		payouts = []PayoutResponse{}
	}

	return ResolutionResponse{
		ID:              resolution.ID,
		MarketID:        resolution.MarketID,
		WinningSide:     resolution.WinningSide,
		TotalPool:       resolution.TotalPool,
		WinningShares:   resolution.WinningShares,
		PayoutPerShare:  resolution.PayoutPerShare,
		ResolvedBy:      resolution.ResolvedBy,
		AlreadyResolved: alreadyResolved,
		CreatedAt:       resolution.CreatedAt,
		Payouts:         payouts,
	}
}
