package handlers

import (
	"errors"
	"net/http"
	"polytrade/internal/services"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ListMarkets(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		markets, err := services.ListMarkets(db)
		if err != nil {
			respondError(c, err)
			return
		}

		c.JSON(http.StatusOK, gin.H{"markets": markets})
	}
}

func GetMarket(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		marketID, err := parseUintParam(c, "id")
		if err != nil {
			respondError(c, err)
			return
		}

		market, err := services.GetMarket(db, marketID)
		if err != nil {
			respondError(c, err)
			return
		}

		c.JSON(http.StatusOK, market)
	}
}

func GetMarketTrades(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		marketID, err := parseUintParam(c, "id")
		if err != nil {
			respondError(c, err)
			return
		}

		limit, err := parseLimitQuery(c)
		if err != nil {
			respondError(c, err)
			return
		}

		trades, err := services.GetRecentMarketTrades(db, marketID, limit)
		if err != nil {
			respondError(c, err)
			return
		}

		c.JSON(http.StatusOK, trades)
	}
}

func parseLimitQuery(c *gin.Context) (int, error) {
	raw := c.Query("limit")
	if raw == "" {
		return 0, nil
	}

	value, err := strconv.Atoi(raw)
	if err != nil || value <= 0 {
		return 0, services.NewServiceError(services.ErrBadRequest, errors.New("invalid limit"))
	}

	return value, nil
}

func parseUintParam(c *gin.Context, name string) (uint, error) {
	raw := c.Param(name)
	value, err := strconv.ParseUint(raw, 10, 64)
	if err != nil || value == 0 {
		return 0, services.NewServiceError(services.ErrBadRequest, errors.New("invalid "+name))
	}

	return uint(value), nil
}
