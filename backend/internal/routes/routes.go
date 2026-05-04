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
	api.POST("/trades", handlers.CreateTrade(db))
}

func health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "ok",
		"service": "polytrade-backend",
	})
}
