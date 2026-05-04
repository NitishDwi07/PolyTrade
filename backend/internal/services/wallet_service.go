package services

import (
	"errors"
	"polytrade/internal/models"
	"time"

	"gorm.io/gorm"
)

type WalletResponse struct {
	UserID       uint                        `json:"userId"`
	Balance      float64                     `json:"balance"`
	Transactions []WalletTransactionResponse `json:"transactions"`
}

type WalletTransactionResponse struct {
	ID          uint      `json:"id"`
	Amount      float64   `json:"amount"`
	Type        string    `json:"type"`
	Description string    `json:"description"`
	ReferenceID *uint     `json:"referenceId"`
	CreatedAt   time.Time `json:"createdAt"`
}

func GetWallet(db *gorm.DB, userID uint) (WalletResponse, error) {
	var user models.User
	if err := db.First(&user, userID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return WalletResponse{}, NewServiceError(ErrNotFound, errors.New("user not found"))
		}
		return WalletResponse{}, err
	}

	var transactions []models.WalletTransaction
	if err := db.Where("user_id = ?", userID).
		Order("created_at desc").
		Limit(20).
		Find(&transactions).Error; err != nil {
		return WalletResponse{}, err
	}

	return WalletResponse{
		UserID:       user.ID,
		Balance:      user.Balance,
		Transactions: toWalletTransactionResponses(transactions),
	}, nil
}

func toWalletTransactionResponses(transactions []models.WalletTransaction) []WalletTransactionResponse {
	response := make([]WalletTransactionResponse, 0, len(transactions))
	for _, transaction := range transactions {
		response = append(response, WalletTransactionResponse{
			ID:          transaction.ID,
			Amount:      transaction.Amount,
			Type:        transaction.Type,
			Description: transaction.Description,
			ReferenceID: transaction.ReferenceID,
			CreatedAt:   transaction.CreatedAt,
		})
	}

	return response
}
