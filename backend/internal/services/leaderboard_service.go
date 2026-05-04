package services

import (
	"polytrade/internal/models"

	"gorm.io/gorm"
)

type LeaderboardEntry struct {
	Rank           int     `json:"rank"`
	UserID         uint    `json:"userId"`
	Name           string  `json:"name"`
	Username       string  `json:"username"`
	Balance        float64 `json:"balance"`
	TradeCount     int64   `json:"tradeCount"`
	TotalVolume    float64 `json:"totalVolume"`
	FollowerCount  int64   `json:"followerCount"`
	FollowingCount int64   `json:"followingCount"`
}

func GetLeaderboard(db *gorm.DB) ([]LeaderboardEntry, error) {
	var users []models.User
	if err := db.Order("balance desc").Find(&users).Error; err != nil {
		return nil, err
	}

	entries := make([]LeaderboardEntry, 0, len(users))
	for index, user := range users {
		var tradeCount int64
		if err := db.Model(&models.Trade{}).Where("user_id = ?", user.ID).Count(&tradeCount).Error; err != nil {
			return nil, err
		}

		var totalVolume float64
		if err := db.Model(&models.Trade{}).
			Where("user_id = ?", user.ID).
			Select("COALESCE(SUM(amount), 0)").
			Scan(&totalVolume).Error; err != nil {
			return nil, err
		}

		var followerCount int64
		if err := db.Model(&models.CopyRelationship{}).Where("trader_id = ?", user.ID).Count(&followerCount).Error; err != nil {
			return nil, err
		}

		var followingCount int64
		if err := db.Model(&models.CopyRelationship{}).Where("follower_id = ?", user.ID).Count(&followingCount).Error; err != nil {
			return nil, err
		}

		entries = append(entries, LeaderboardEntry{
			Rank:           index + 1,
			UserID:         user.ID,
			Name:           user.Name,
			Username:       user.Username,
			Balance:        user.Balance,
			TradeCount:     tradeCount,
			TotalVolume:    totalVolume,
			FollowerCount:  followerCount,
			FollowingCount: followingCount,
		})
	}

	return entries, nil
}
