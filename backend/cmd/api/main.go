package main

import (
	"log"

	"polytrade/internal/config"
	"polytrade/internal/database"
	"polytrade/internal/models"
	"polytrade/internal/routes"
	"polytrade/internal/seed"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Config error:", err)
	}

	db, err := database.InitDB(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Database error:", err)
	}
	log.Println("Database connected")

	err = db.AutoMigrate(
		&models.User{},
		&models.Market{},
		&models.Trade{},
		&models.WalletTransaction{},
		&models.Position{},
		&models.CopyRelationship{},
		&models.MarketResolution{},
	)
	if err != nil {
		log.Fatal("Migration failed:", err)
	}

	if err := seed.Run(db); err != nil {
		log.Fatal("Seed failed:", err)
	}

	r := gin.Default()
	r.Use(corsMiddleware(cfg.FrontendURL))

	routes.RegisterRoutes(r, db)

	log.Println("Server running on :" + cfg.Port)
	log.Println("Health endpoint: http://localhost:" + cfg.Port + "/health")

	err = r.Run(":" + cfg.Port)
	if err != nil {
		log.Fatal("Server failed to start:", err)
	}
}

func corsMiddleware(frontendURL string) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", frontendURL)
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
