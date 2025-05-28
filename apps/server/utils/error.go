package utils

import (
	"encoding/json"
	"net/http"
)

type APIError struct {
    Code    string `json:"code"`
    Message string `json:"message"`
}

// WriteError writes a standardized API error response in JSON format to the provided ResponseWriter.
//
// It sets the HTTP status code, sets the "Content-Type" header to "application/json",
// and encodes an APIError containing the given code and message.
//
// Parameters:
//   - w: the http.ResponseWriter to write the response to.
//   - status: the HTTP status code to return (e.g., 400, 401, 500).
//   - code: a custom string code representing the type of error (e.g., "BAD_REQUEST", "UNAUTHORIZED").
//   - message: a human-readable message describing the error.
func WriteError(w http.ResponseWriter, status int, code, message string) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(APIError{
        Code:    code,
        Message: message,
    })
}