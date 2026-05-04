package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Balance float64
}

type Market struct {
	gorm.Model
	Question  string
	YesVolume float64
	NoVolume  float64
	Status    string // OPEN, CLOSED, RESOLVED
}

type Trade struct {
	gorm.Model
	UserID   uint
	MarketID uint
	Side     string
	Amount   float64
	Price    float64
}