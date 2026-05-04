package seed

import (
	"log"
	"polytrade/internal/models"
	"time"

	"gorm.io/gorm"
)

const starterCredits = 1000

func Run(db *gorm.DB) error {
	if err := seedUsers(db); err != nil {
		return err
	}

	if err := seedMarkets(db); err != nil {
		return err
	}

	return nil
}

func seedUsers(db *gorm.DB) error {
	var count int64
	if err := db.Model(&models.User{}).Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		return nil
	}

	users := []models.User{
		{Name: "Vansh", Username: "vansh", Balance: starterCredits},
		{Name: "Nitish", Username: "nitish", Balance: starterCredits},
		{Name: "Alice", Username: "alice", Balance: starterCredits},
	}

	return db.Transaction(func(tx *gorm.DB) error {
		for index := range users {
			if err := tx.Create(&users[index]).Error; err != nil {
				return err
			}

			transaction := models.WalletTransaction{
				UserID:      users[index].ID,
				Amount:      starterCredits,
				Type:        models.WalletTransactionStarterCredit,
				Description: "Starter credits",
			}
			if err := tx.Create(&transaction).Error; err != nil {
				return err
			}
		}

		log.Println("Seeded demo users")
		return nil
	})
}

func seedMarkets(db *gorm.DB) error {
	var count int64
	if err := db.Model(&models.Market{}).Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		return nil
	}

	closesAt := time.Now().AddDate(0, 1, 0)
	markets := []models.Market{
		{
			Question:    "Will India win the next T20 series?",
			Description: "Resolves YES if India wins its next scheduled T20 series.",
			Category:    "Cricket",
			YesVolume:   500,
			NoVolume:    500,
			Status:      models.MarketStatusOpen,
			ClosesAt:    &closesAt,
		},
		{
			Question:    "Will Bitcoin cross $100K this year?",
			Description: "Resolves YES if Bitcoin trades above $100,000 on a major exchange before year end.",
			Category:    "Crypto",
			YesVolume:   500,
			NoVolume:    500,
			Status:      models.MarketStatusOpen,
			ClosesAt:    &closesAt,
		},
		{
			Question:    "Will OpenAI release a new flagship model this year?",
			Description: "Resolves YES if OpenAI publicly releases a new flagship model before year end.",
			Category:    "AI / Tech",
			YesVolume:   500,
			NoVolume:    500,
			Status:      models.MarketStatusOpen,
			ClosesAt:    &closesAt,
		},
		{
			Question:    "Will a major Indian startup IPO this year?",
			Description: "Resolves YES if a major India-based startup lists publicly before year end.",
			Category:    "Startups",
			YesVolume:   500,
			NoVolume:    500,
			Status:      models.MarketStatusOpen,
			ClosesAt:    &closesAt,
		},
		{
			Question:    "Will global average temperatures hit a new record this year?",
			Description: "Resolves YES if official global average temperature data sets a new annual record.",
			Category:    "Climate",
			YesVolume:   500,
			NoVolume:    500,
			Status:      models.MarketStatusOpen,
			ClosesAt:    &closesAt,
		},
	}

	if err := db.Create(&markets).Error; err != nil {
		return err
	}

	log.Println("Seeded demo markets")
	return nil
}
