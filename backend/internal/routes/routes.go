package routes

import (
	"net/http"
	"polytrade/internal/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.Engine, db *gorm.DB) {
	r.GET("/health", health)

	api := r.Group("/api")

	api.GET("/health", health)
	api.GET("/markets", handlers.ListMarkets(db))
	api.GET("/markets/:id", handlers.GetMarket(db))
	api.POST("/trades", handlers.CreateTrade(db))
	api.GET("/portfolio/:userId", handlers.GetPortfolio(db))
	api.GET("/leaderboard", handlers.GetLeaderboard(db))
	api.GET("/wallet/:userId", handlers.GetWallet(db))
}

func health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "ok",
		"service": "polytrade-backend",
	})
}
