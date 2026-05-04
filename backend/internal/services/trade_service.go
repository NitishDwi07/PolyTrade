package services

import (
	"errors"
	"polytrade/internal/models"

	"gorm.io/gorm"
)

func ExecuteTrade(db *gorm.DB, userID, marketID uint, side string, amount float64) error {
	var user models.User
	var market models.Market

	if err := db.First(&user, userID).Error; err != nil {
		return err
	}

	if err := db.First(&market, marketID).Error; err != nil {
		return err
	}

	if market.Status != "OPEN" {
		return errors.New("market not open")
	}

	if user.Balance < amount {
		return errors.New("insufficient balance")
	}

	total := market.YesVolume + market.NoVolume
	if total == 0 {
		total = 2
		market.YesVolume = 1
		market.NoVolume = 1
	}

	priceYes := market.YesVolume / total
	var price float64

	if side == "YES" {
		price = priceYes
		market.YesVolume += amount
	} else {
		price = 1 - priceYes
		market.NoVolume += amount
	}

	user.Balance -= amount

	trade := models.Trade{
		UserID:   userID,
		MarketID: marketID,
		Side:     side,
		Amount:   amount,
		Price:    price,
	}

	return db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Save(&user).Error; err != nil {
			return err
		}
		if err := tx.Save(&market).Error; err != nil {
			return err
		}
		if err := tx.Create(&trade).Error; err != nil {
			return err
		}
		return nil
	})
}