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

		err := services.ExecuteTrade(db, req.UserID, req.MarketID, req.Side, req.Amount)

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "trade executed"})
	}
}
