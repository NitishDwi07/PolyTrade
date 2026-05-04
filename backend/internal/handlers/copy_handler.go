package handlers

import (
	"errors"
	"net/http"
	"polytrade/internal/services"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type FollowTraderRequest struct {
	FollowerID uint    `json:"followerId"`
	CopyRatio  float64 `json:"copyRatio"`
}

type UpdateCopySettingsRequest struct {
	FollowerID uint    `json:"followerId"`
	CopyRatio  float64 `json:"copyRatio"`
	IsEnabled  bool    `json:"isEnabled"`
}

type UnfollowTraderRequest struct {
	FollowerID uint `json:"followerId"`
}

func FollowTrader(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		traderID, err := parseUintParam(c, "traderId")
		if err != nil {
			respondError(c, err)
			return
		}

		var req FollowTraderRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		relationship, err := services.FollowTrader(db, req.FollowerID, traderID, req.CopyRatio)
		if err != nil {
			respondError(c, err)
			return
		}

		c.JSON(http.StatusOK, relationship)
	}
}

func UnfollowTrader(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		traderID, err := parseUintParam(c, "traderId")
		if err != nil {
			respondError(c, err)
			return
		}

		followerID, err := followerIDFromRequest(c)
		if err != nil {
			respondError(c, err)
			return
		}

		if err := services.UnfollowTrader(db, followerID, traderID); err != nil {
			respondError(c, err)
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "copy relationship removed"})
	}
}

func UpdateCopySettings(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		traderID, err := parseUintParam(c, "traderId")
		if err != nil {
			respondError(c, err)
			return
		}

		var req UpdateCopySettingsRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		relationship, err := services.UpdateCopySettings(db, req.FollowerID, traderID, req.CopyRatio, req.IsEnabled)
		if err != nil {
			respondError(c, err)
			return
		}

		c.JSON(http.StatusOK, relationship)
	}
}

func GetFollowing(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, err := parseUintParam(c, "userId")
		if err != nil {
			respondError(c, err)
			return
		}

		following, err := services.GetFollowing(db, userID)
		if err != nil {
			respondError(c, err)
			return
		}

		c.JSON(http.StatusOK, gin.H{"following": following})
	}
}

func GetFollowers(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		traderID, err := parseUintParam(c, "traderId")
		if err != nil {
			respondError(c, err)
			return
		}

		followers, err := services.GetFollowers(db, traderID)
		if err != nil {
			respondError(c, err)
			return
		}

		c.JSON(http.StatusOK, gin.H{"followers": followers})
	}
}

func GetCopyActivity(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, err := parseUintParam(c, "userId")
		if err != nil {
			respondError(c, err)
			return
		}

		activity, err := services.GetCopyActivity(db, userID)
		if err != nil {
			respondError(c, err)
			return
		}

		c.JSON(http.StatusOK, activity)
	}
}

func followerIDFromRequest(c *gin.Context) (uint, error) {
	if raw := c.Query("followerId"); raw != "" {
		value, err := strconv.ParseUint(raw, 10, 64)
		if err != nil || value == 0 {
			return 0, services.NewServiceError(services.ErrBadRequest, errors.New("invalid followerId"))
		}
		return uint(value), nil
	}

	var req UnfollowTraderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		return 0, services.NewServiceError(services.ErrBadRequest, err)
	}
	if req.FollowerID == 0 {
		return 0, services.NewServiceError(services.ErrBadRequest, errors.New("followerId is required"))
	}

	return req.FollowerID, nil
}
