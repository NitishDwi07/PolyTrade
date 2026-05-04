package handlers

import (
	"net/http"
	"polytrade/internal/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TradeRequest struct {
	UserID   uint    `json:"userId"`
	MarketID uint    `json:"marketId"`
	Side     string  `json:"side"`
	Amount   float64 `json:"amount"`
}

func CreateTrade(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req TradeRequest

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		result, err := services.ExecuteTrade(db, req.UserID, req.MarketID, req.Side, req.Amount)
		if err != nil {
			respondError(c, err)
			return
		}

		c.JSON(http.StatusOK, result)
	}
}

func GetUserTrades(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, err := parseUintParam(c, "userId")
		if err != nil {
			respondError(c, err)
			return
		}

		limit, err := parseLimitQuery(c)
		if err != nil {
			respondError(c, err)
			return
		}

		trades, err := services.GetUserTrades(db, userID, limit)
		if err != nil {
			respondError(c, err)
			return
		}

		c.JSON(http.StatusOK, trades)
	}
}
