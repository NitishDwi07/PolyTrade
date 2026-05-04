package models

import (
	"time"

	"gorm.io/gorm"
)

const (
	MarketStatusOpen     = "OPEN"
	MarketStatusClosed   = "CLOSED"
	MarketStatusResolved = "RESOLVED"

	TradeSideYes = "YES"
	TradeSideNo  = "NO"

	WalletTransactionCredit        = "CREDIT"
	WalletTransactionDebit         = "DEBIT"
	WalletTransactionTradeDebit    = "TRADE_DEBIT"
	WalletTransactionPayout        = "PAYOUT"
	WalletTransactionRefund        = "REFUND"
	WalletTransactionStarterCredit = "STARTER_CREDIT"
)

type User struct {
	gorm.Model
	Name     string  `gorm:"not null"`
	Username string  `gorm:"uniqueIndex;not null"`
	Balance  float64 `gorm:"not null;default:0"`
}

type Market struct {
	gorm.Model
	Question    string     `gorm:"not null"`
	Description string     `gorm:"type:text"`
	Category    string     `gorm:"index"`
	YesVolume   float64    `gorm:"not null;default:0"`
	NoVolume    float64    `gorm:"not null;default:0"`
	Status      string     `gorm:"index;not null;default:OPEN"`
	ClosesAt    *time.Time `gorm:"index"`
}

type Trade struct {
	gorm.Model
	UserID            uint    `gorm:"index;not null"`
	MarketID          uint    `gorm:"index;not null"`
	Side              string  `gorm:"index;not null"`
	Amount            float64 `gorm:"not null"`
	Price             float64 `gorm:"not null"`
	Shares            float64 `gorm:"not null"`
	CopiedFromTradeID *uint   `gorm:"index"`
	User              User    `gorm:"foreignKey:UserID"`
	Market            Market  `gorm:"foreignKey:MarketID"`
	CopiedFromTrade   *Trade  `gorm:"foreignKey:CopiedFromTradeID"`
}

type WalletTransaction struct {
	gorm.Model
	UserID      uint    `gorm:"index;not null"`
	Amount      float64 `gorm:"not null"`
	Type        string  `gorm:"index;not null"`
	Description string  `gorm:"type:text"`
	ReferenceID *uint   `gorm:"index"`
	User        User    `gorm:"foreignKey:UserID"`
}

type Position struct {
	gorm.Model
	UserID         uint    `gorm:"uniqueIndex:idx_user_market_side;not null"`
	MarketID       uint    `gorm:"uniqueIndex:idx_user_market_side;not null"`
	Side           string  `gorm:"uniqueIndex:idx_user_market_side;not null"`
	Shares         float64 `gorm:"not null;default:0"`
	AveragePrice   float64 `gorm:"not null;default:0"`
	InvestedAmount float64 `gorm:"not null;default:0"`
	Settled        bool    `gorm:"index;not null;default:false"`
	User           User    `gorm:"foreignKey:UserID"`
	Market         Market  `gorm:"foreignKey:MarketID"`
}
