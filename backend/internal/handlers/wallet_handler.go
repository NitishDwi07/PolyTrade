package handlers

import (
	"net/http"
	"polytrade/internal/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetWallet(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, err := parseUintParam(c, "userId")
		if err != nil {
			respondError(c, err)
			return
		}

		wallet, err := services.GetWallet(db, userID)
		if err != nil {
			respondError(c, err)
			return
		}

		c.JSON(http.StatusOK, wallet)
	}
}
