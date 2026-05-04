package handlers

import (
	"net/http"
	"polytrade/internal/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetLeaderboard(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		leaderboard, err := services.GetLeaderboard(db)
		if err != nil {
			respondError(c, err)
			return
		}

		c.JSON(http.StatusOK, gin.H{"leaderboard": leaderboard})
	}
}
