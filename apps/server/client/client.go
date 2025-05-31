package client

import (
	"context"
	"net"
	"net/http"
	"time"

	"github.com/go-resty/resty/v2"
)

type Source string

const (
	SOURCE_GELBOORU	Source = "https://gelbooru.com/index.php?page=dapi"
	SOURCE_DANBOORU	Source = "https://danbooru.donmai.us"
)

type Client struct {
	source		Source
	httpClient	*resty.Client
}

type ClientError struct {
	StatusCode	int
	Message 	string
}

// Client HTTPClient getter
func (c *Client) HTTPClient() *resty.Client {
	return c.httpClient
}

// Client BaseAPI getter
func (c *Client) Source() Source {
	return c.source
}

// Init Client with source identifier
func InitClient(source Source, timeout time.Duration) *Client {
	// Custom DNS resolver
	resolver := &net.Resolver{
		PreferGo: true,
		Dial: func(ctx context.Context, network, address string) (net.Conn, error) {
			d := net.Dialer{
				Timeout: time.Second * 5,
			}
			return d.DialContext(ctx, "udp", "1.1.1.1"+":53")
		},
	}

	// Custom transport with resolver
	transport := &http.Transport{
		DialContext: (&net.Dialer{
			Timeout:   5 * time.Second,
			Resolver:  resolver,
			KeepAlive: 30 * time.Second,
		}).DialContext,
		ForceAttemptHTTP2:     true,
		TLSHandshakeTimeout:   10 * time.Second,
		ResponseHeaderTimeout: 10 * time.Second,
	}

	c := resty.New()

	c.SetTransport(transport)
	c.SetTimeout(3 * time.Minute)

	return &Client{
		source: source,
		httpClient: c,
	}
}
