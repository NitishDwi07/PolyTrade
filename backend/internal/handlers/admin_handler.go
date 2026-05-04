package handlers

import (
	"net/http"
	"polytrade/internal/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ResolveMarketRequest struct {
	WinningSide string `json:"winningSide"`
	ResolvedBy  string `json:"resolvedBy"`
}

func CloseMarket(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		marketID, err := parseUintParam(c, "id")
		if err != nil {
			respondError(c, err)
			return
		}

		market, err := services.CloseMarket(db, marketID)
		if err != nil {
			respondError(c, err)
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "market closed",
			"market":  market,
		})
	}
}

func ResolveMarket(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		marketID, err := parseUintParam(c, "id")
		if err != nil {
			respondError(c, err)
			return
		}

		var req ResolveMarketRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		resolution, err := services.ResolveMarket(db, marketID, req.WinningSide, req.ResolvedBy)
		if err != nil {
			respondError(c, err)
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message":    "market resolved",
			"resolution": resolution,
		})
	}
}

func GetMarketResolution(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		marketID, err := parseUintParam(c, "id")
		if err != nil {
			respondError(c, err)
			return
		}

		resolution, err := services.GetMarketResolution(db, marketID)
		if err != nil {
			respondError(c, err)
			return
		}

		c.JSON(http.StatusOK, resolution)
	}
}

func GetAdminStats(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		stats, err := services.GetAdminStats(db)
		if err != nil {
			respondError(c, err)
			return
		}

		c.JSON(http.StatusOK, stats)
	}
}
