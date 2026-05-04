package handlers

import (
	"errors"
	"net/http"
	"polytrade/internal/services"

	"github.com/gin-gonic/gin"
)

func respondError(c *gin.Context, err error) {
	status := http.StatusInternalServerError

	switch {
	case errors.Is(err, services.ErrBadRequest):
		status = http.StatusBadRequest
	case errors.Is(err, services.ErrNotFound):
		status = http.StatusNotFound
	case errors.Is(err, services.ErrInsufficientBalance), errors.Is(err, services.ErrMarketClosed):
		status = http.StatusConflict
	}

	c.JSON(status, gin.H{"error": err.Error()})
}
