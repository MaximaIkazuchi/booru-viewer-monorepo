package api

import (
	"booru-viewer/server/api/model"
	"booru-viewer/server/client"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetTags(c *gin.Context) {
	var query model.QueryParams

	if err := c.ShouldBindQuery(&query); err != nil {
		c.JSON(http.StatusBadRequest, &model.ApiResponse{
			Message: "Invalid query params specified",
			Data: nil,
		})
		return
	}

	tags, err := h.APIClient.FetchTags(query.Limit, query.Page, client.Order(query.Order), query.Search, nil)
	if err != nil {
		c.JSON(err.StatusCode, &model.ApiResponse{
			Message: err.Message,
			Data: nil,
		})
	}

	c.JSON(http.StatusOK, tags)
}

func (h *Handler) GetSingleTag(c *gin.Context) {
	id, idErr := strconv.Atoi(c.Param("id"))
	if idErr != nil {
		c.JSON(http.StatusBadRequest, &model.ApiResponse{
			Message: "Invalid path params '/tags/:id' specified",
			Data: nil,
		})
		return
	}

	tags, err := h.APIClient.FetchTags(1, 1, client.OrderCount, "", &id)
	if err != nil {
		c.JSON(err.StatusCode, &model.ApiResponse{
			Message: err.Message,
			Data: nil,
		})
	}

	c.JSON(http.StatusOK, tags)
}