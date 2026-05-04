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
	api.GET("/markets/:id/resolution", handlers.GetMarketResolution(db))
	api.GET("/markets/:id", handlers.GetMarket(db))
	api.POST("/trades", handlers.CreateTrade(db))
	api.GET("/portfolio/:userId", handlers.GetPortfolio(db))
	api.GET("/leaderboard", handlers.GetLeaderboard(db))
	api.GET("/wallet/:userId", handlers.GetWallet(db))
	api.POST("/copy/follow/:traderId", handlers.FollowTrader(db))
	api.DELETE("/copy/follow/:traderId", handlers.UnfollowTrader(db))
	api.PATCH("/copy/settings/:traderId", handlers.UpdateCopySettings(db))
	api.GET("/copy/following/:userId", handlers.GetFollowing(db))
	api.GET("/copy/followers/:traderId", handlers.GetFollowers(db))
	api.POST("/admin/markets/:id/close", handlers.CloseMarket(db))
	api.POST("/admin/markets/:id/resolve", handlers.ResolveMarket(db))
}

func health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "ok",
		"service": "polytrade-backend",
	})
}
