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

func parseUintParam(c *gin.Context, name string) (uint, error) {
	raw := c.Param(name)
	value, err := strconv.ParseUint(raw, 10, 64)
	if err != nil || value == 0 {
		return 0, services.NewServiceError(services.ErrBadRequest, errors.New("invalid "+name))
	}

	return uint(value), nil
}
