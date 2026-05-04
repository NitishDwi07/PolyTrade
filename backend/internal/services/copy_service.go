package services

import (
	"errors"
	"polytrade/internal/models"
	"time"

	"gorm.io/gorm"
)

type CopyRelationshipResponse struct {
	ID               uint      `json:"id,omitempty"`
	FollowerID       uint      `json:"followerId,omitempty"`
	FollowerName     string    `json:"followerName,omitempty"`
	FollowerUsername string    `json:"followerUsername,omitempty"`
	TraderID         uint      `json:"traderId,omitempty"`
	TraderName       string    `json:"traderName,omitempty"`
	TraderUsername   string    `json:"traderUsername,omitempty"`
	CopyRatio        float64   `json:"copyRatio"`
	IsEnabled        bool      `json:"isEnabled"`
	CreatedAt        time.Time `json:"createdAt"`
}

type CopyTradeResult struct {
	FollowerID uint    `json:"followerId"`
	Amount     float64 `json:"amount"`
	Status     string  `json:"status"`
	Reason     string  `json:"reason,omitempty"`
	TradeID    *uint   `json:"tradeId,omitempty"`
}

type CopySummary struct {
	Attempted int               `json:"attempted"`
	Executed  int               `json:"executed"`
	Skipped   int               `json:"skipped"`
	Results   []CopyTradeResult `json:"results"`
}

func FollowTrader(db *gorm.DB, followerID, traderID uint, copyRatio float64) (CopyRelationshipResponse, error) {
	if copyRatio == 0 {
		copyRatio = 0.5
	}
	if err := validateCopyRelationshipInput(db, followerID, traderID, copyRatio); err != nil {
		return CopyRelationshipResponse{}, err
	}

	var relationship models.CopyRelationship
	err := db.Where("follower_id = ? AND trader_id = ?", followerID, traderID).First(&relationship).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		relationship = models.CopyRelationship{
			FollowerID: followerID,
			TraderID:   traderID,
			CopyRatio:  copyRatio,
			IsEnabled:  true,
		}
		if err := db.Create(&relationship).Error; err != nil {
			return CopyRelationshipResponse{}, err
		}
		return getCopyRelationshipResponse(db, relationship.ID)
	}
	if err != nil {
		return CopyRelationshipResponse{}, err
	}

	relationship.CopyRatio = copyRatio
	relationship.IsEnabled = true
	if err := db.Save(&relationship).Error; err != nil {
		return CopyRelationshipResponse{}, err
	}

	return getCopyRelationshipResponse(db, relationship.ID)
}

func UnfollowTrader(db *gorm.DB, followerID, traderID uint) error {
	if followerID == 0 {
		return NewServiceError(ErrBadRequest, errors.New("followerId is required"))
	}
	if traderID == 0 {
		return NewServiceError(ErrBadRequest, errors.New("traderId is required"))
	}

	result := db.Where("follower_id = ? AND trader_id = ?", followerID, traderID).Delete(&models.CopyRelationship{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return NewServiceError(ErrNotFound, errors.New("copy relationship not found"))
	}

	return nil
}

func UpdateCopySettings(db *gorm.DB, followerID, traderID uint, copyRatio float64, isEnabled bool) (CopyRelationshipResponse, error) {
	if err := validateCopyRelationshipInput(db, followerID, traderID, copyRatio); err != nil {
		return CopyRelationshipResponse{}, err
	}

	var relationship models.CopyRelationship
	if err := db.Where("follower_id = ? AND trader_id = ?", followerID, traderID).First(&relationship).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return CopyRelationshipResponse{}, NewServiceError(ErrNotFound, errors.New("copy relationship not found"))
		}
		return CopyRelationshipResponse{}, err
	}

	relationship.CopyRatio = copyRatio
	relationship.IsEnabled = isEnabled
	if err := db.Save(&relationship).Error; err != nil {
		return CopyRelationshipResponse{}, err
	}

	return getCopyRelationshipResponse(db, relationship.ID)
}

func GetFollowing(db *gorm.DB, followerID uint) ([]CopyRelationshipResponse, error) {
	if followerID == 0 {
		return nil, NewServiceError(ErrBadRequest, errors.New("userId is required"))
	}

	var relationships []models.CopyRelationship
	if err := db.Preload("Trader").
		Where("follower_id = ?", followerID).
		Order("created_at desc").
		Find(&relationships).Error; err != nil {
		return nil, err
	}

	response := make([]CopyRelationshipResponse, 0, len(relationships))
	for _, relationship := range relationships {
		response = append(response, CopyRelationshipResponse{
			TraderID:       relationship.TraderID,
			TraderName:     relationship.Trader.Name,
			TraderUsername: relationship.Trader.Username,
			CopyRatio:      relationship.CopyRatio,
			IsEnabled:      relationship.IsEnabled,
			CreatedAt:      relationship.CreatedAt,
		})
	}

	return response, nil
}

func GetFollowers(db *gorm.DB, traderID uint) ([]CopyRelationshipResponse, error) {
	if traderID == 0 {
		return nil, NewServiceError(ErrBadRequest, errors.New("traderId is required"))
	}

	var relationships []models.CopyRelationship
	if err := db.Preload("Follower").
		Where("trader_id = ?", traderID).
		Order("created_at desc").
		Find(&relationships).Error; err != nil {
		return nil, err
	}

	response := make([]CopyRelationshipResponse, 0, len(relationships))
	for _, relationship := range relationships {
		response = append(response, CopyRelationshipResponse{
			FollowerID:       relationship.FollowerID,
			FollowerName:     relationship.Follower.Name,
			FollowerUsername: relationship.Follower.Username,
			CopyRatio:        relationship.CopyRatio,
			IsEnabled:        relationship.IsEnabled,
			CreatedAt:        relationship.CreatedAt,
		})
	}

	return response, nil
}

func ProcessCopyTrades(db *gorm.DB, originalTrade TradeResponse) CopySummary {
	summary := CopySummary{
		Results: []CopyTradeResult{},
	}

	if originalTrade.CopiedFromTradeID != nil {
		return summary
	}

	var relationships []models.CopyRelationship
	if err := db.Where("trader_id = ? AND is_enabled = ?", originalTrade.UserID, true).Find(&relationships).Error; err != nil {
		summary.Results = append(summary.Results, CopyTradeResult{
			Status: "skipped",
			Reason: "could not load followers",
		})
		summary.Skipped++
		return summary
	}

	for _, relationship := range relationships {
		summary.Attempted++
		amount := originalTrade.Amount * relationship.CopyRatio
		result := CopyTradeResult{
			FollowerID: relationship.FollowerID,
			Amount:     amount,
			Status:     "skipped",
		}

		if amount <= 0 {
			result.Reason = "copy amount must be greater than zero"
			summary.Skipped++
			summary.Results = append(summary.Results, result)
			continue
		}

		tradeID := originalTrade.ID
		copiedTrade, err := ExecuteTradeWithOptions(db, relationship.FollowerID, originalTrade.MarketID, originalTrade.Side, amount, &tradeID, false)
		if err != nil {
			result.Reason = err.Error()
			summary.Skipped++
			summary.Results = append(summary.Results, result)
			continue
		}

		result.Status = "executed"
		result.TradeID = &copiedTrade.Trade.ID
		summary.Executed++
		summary.Results = append(summary.Results, result)
	}

	return summary
}

func validateCopyRelationshipInput(db *gorm.DB, followerID, traderID uint, copyRatio float64) error {
	if followerID == 0 {
		return NewServiceError(ErrBadRequest, errors.New("followerId is required"))
	}
	if traderID == 0 {
		return NewServiceError(ErrBadRequest, errors.New("traderId is required"))
	}
	if followerID == traderID {
		return NewServiceError(ErrBadRequest, errors.New("follower cannot follow self"))
	}
	if copyRatio <= 0 || copyRatio > 1 {
		return NewServiceError(ErrBadRequest, errors.New("copyRatio must be greater than 0 and less than or equal to 1"))
	}

	if err := ensureUserExists(db, followerID, "follower not found"); err != nil {
		return err
	}
	if err := ensureUserExists(db, traderID, "trader not found"); err != nil {
		return err
	}

	return nil
}

func ensureUserExists(db *gorm.DB, userID uint, message string) error {
	var user models.User
	if err := db.First(&user, userID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return NewServiceError(ErrNotFound, errors.New(message))
		}
		return err
	}

	return nil
}

func getCopyRelationshipResponse(db *gorm.DB, relationshipID uint) (CopyRelationshipResponse, error) {
	var relationship models.CopyRelationship
	if err := db.Preload("Follower").Preload("Trader").First(&relationship, relationshipID).Error; err != nil {
		return CopyRelationshipResponse{}, err
	}

	return CopyRelationshipResponse{
		ID:               relationship.ID,
		FollowerID:       relationship.FollowerID,
		FollowerName:     relationship.Follower.Name,
		FollowerUsername: relationship.Follower.Username,
		TraderID:         relationship.TraderID,
		TraderName:       relationship.Trader.Name,
		TraderUsername:   relationship.Trader.Username,
		CopyRatio:        relationship.CopyRatio,
		IsEnabled:        relationship.IsEnabled,
		CreatedAt:        relationship.CreatedAt,
	}, nil
}
