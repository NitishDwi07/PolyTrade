package config

import (
	"errors"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	DatabaseURL string
	FrontendURL string
	JWTSecret   string
}

func Load() (Config, error) {
	_ = godotenv.Load(".env")

	cfg := Config{
		Port:        getEnv("PORT", "4000"),
		DatabaseURL: os.Getenv("DATABASE_URL"),
		FrontendURL: getEnv("FRONTEND_URL", "http://localhost:3000"),
		JWTSecret:   os.Getenv("JWT_SECRET"),
	}

	if cfg.DatabaseURL == "" {
		return Config{}, errors.New("DATABASE_URL is required")
	}

	if cfg.JWTSecret == "" {
		return Config{}, errors.New("JWT_SECRET is required")
	}

	return cfg, nil
}

func getEnv(key, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	return value
}
