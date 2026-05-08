package handlers

import (
	"net/http"
	"time"

	"polytrade/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthHandler struct {
	DB        *gorm.DB
	JWTSecret string
}

type RegisterRequest struct {
	Name     string `json:"name"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func NewAuthHandler(db *gorm.DB, jwtSecret string) *AuthHandler {
	return &AuthHandler{
		DB:        db,
		JWTSecret: jwtSecret,
	}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req RegisterRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request body",
		})
		return
	}

	if req.Email == "" || req.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "email and password required",
		})
		return
	}

	var existingUser models.User

	err := h.DB.
		Where("email = ?", req.Email).
		First(&existingUser).Error

	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "email already exists",
		})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(req.Password),
		bcrypt.DefaultCost,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to hash password",
		})
		return
	}

	user := models.User{
		Name:         req.Name,
		Username:     req.Username,
		Email:        req.Email,
		PasswordHash: string(hashedPassword),
		Balance:      10000,
	}

	if err := h.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "user registered successfully",
	})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request body",
		})
		return
	}

	var user models.User

	err := h.DB.
		Where("email = ?", req.Email).
		First(&user).Error

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "email does not exist",
		})
		return
	}

	err = bcrypt.CompareHashAndPassword(
		[]byte(user.PasswordHash),
		[]byte(req.Password),
	)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "wrong password",
		})
		return
	}

	token := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		jwt.MapClaims{
			"user_id": user.ID,
			"email":   user.Email,
			"exp":     time.Now().Add(24 * time.Hour).Unix(),
		},
	)

	tokenString, err := token.SignedString(
		[]byte(h.JWTSecret),
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to create token",
		})
		return
	}

	c.SetCookie(
		"token",
		tokenString,
		3600*24,
		"/",
		"",
		false,
		true,
	)

	c.JSON(http.StatusOK, gin.H{
		"message": "login successful",
		"user": gin.H{
			"id":       user.ID,
			"name":     user.Name,
			"username": user.Username,
			"email":    user.Email,
			"balance":  user.Balance,
		},
	})
}