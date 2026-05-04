package main

import (
	"log"
	"os"

	"polytrade/internal/database"
	"polytrade/internal/models"
	"polytrade/internal/routes"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	
	err := godotenv.Load(".env")
	if err != nil {
		log.Println("No .env file found, falling back to system env")
	}


	db := database.InitDB()

	err = db.AutoMigrate(
		&models.User{},
		&models.Market{},
		&models.Trade{},
	)
	if err != nil {
		log.Fatal("Migration failed:", err)
	}

	
	r := gin.Default()

	//debug
	log.Println("ROUTES LOADED")
	routes.RegisterRoutes(r, db)

	
	port := os.Getenv("PORT")
	if port == "" {
		port = "4000"
	}

	log.Println("Server running on :" + port)

	err = r.Run(":" + port)
	if err != nil {
		log.Fatal("Server failed to start:", err)
	}
}