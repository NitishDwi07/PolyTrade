package services

import "errors"

var (
	ErrBadRequest          = errors.New("bad request")
	ErrNotFound            = errors.New("not found")
	ErrInsufficientBalance = errors.New("insufficient balance")
	ErrMarketClosed        = errors.New("market not open")
)

type ServiceError struct {
	Kind error
	Err  error
}

func (e ServiceError) Error() string {
	if e.Err == nil {
		return e.Kind.Error()
	}

	return e.Err.Error()
}

func (e ServiceError) Unwrap() error {
	return e.Kind
}

func NewServiceError(kind error, err error) error {
	return ServiceError{Kind: kind, Err: err}
}
