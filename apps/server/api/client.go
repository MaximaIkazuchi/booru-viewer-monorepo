package api

import (
	"net/http"
	"time"
)

type Client struct {
	baseAPI		string
	httpClient	*http.Client
}

type ClientError struct {
	StatusCode	int
	Message 	string
}

// Client HTTPClient getter
func (c *Client) HTTPClient() *http.Client {
	return c.httpClient
}

// Client BaseAPI getter
func (c *Client) BaseAPI() string {
	return c.baseAPI
}

// NewClient creates and returns a new Client instance.
//
// It initializes an HTTP client with the specified timeout and sets the base API URL.
//
// Parameters:
//   - baseAPI: the base URL of the API to which requests will be sent.
//   - timeout: the HTTP request timeout duration.
//
// Returns:
//   - *Client: a pointer to the initialized Client.
func NewClient(baseAPI string, timeout time.Duration) *Client {
	return &Client{
		baseAPI: baseAPI,
		httpClient: &http.Client{
			Timeout: timeout,
		},
	}
}
