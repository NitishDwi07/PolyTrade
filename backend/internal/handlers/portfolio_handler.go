package handlers

import (
	"net/http"
	"polytrade/internal/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetPortfolio(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, err := parseUintParam(c, "userId")
		if err != nil {
			respondError(c, err)
			return
		}

		portfolio, err := services.GetPortfolio(db, userID)
		if err != nil {
			respondError(c, err)
			return
		}

		c.JSON(http.StatusOK, portfolio)
	}
}
