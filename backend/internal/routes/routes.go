package routes

import (
	"polytrade/internal/handlers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.Engine, db *gorm.DB) {
	api := r.Group("/api")

	api.POST("/trades", handlers.CreateTrade(db))
}