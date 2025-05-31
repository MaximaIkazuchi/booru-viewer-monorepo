package api

import "booru-viewer/server/client"

type Handler struct {
	APIClient	*client.Client
}

func NewHandler(client *client.Client) *Handler {
	return &Handler{APIClient: client}
}