package api

import (
	"booru-viewer/server/api/model"
	"fmt"
	"io"
	"net/http"
	"os"
	"path"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetPosts(c *gin.Context) {
	var query model.QueryParams

	if err := c.ShouldBindQuery(&query); err != nil {
		c.JSON(http.StatusBadRequest, &model.ApiResponse{
			Message: "Invalid query params specified",
			Data: nil,
		})
		return
	}

	query.Tags = strings.Split(query.TagsRaw, "+")

	posts, err := h.APIClient.FetchPosts(query.Limit, query.Page, query.Tags, nil)
	if err != nil {
		c.JSON(err.StatusCode, &model.ApiResponse{
			Message: err.Message,
			Data: nil,
		})
	}

	c.JSON(http.StatusOK, posts)
}

func (h *Handler) GetSinglePost(c *gin.Context) {
	id, idErr := strconv.Atoi(c.Param("id"))
	if idErr != nil {
		c.JSON(http.StatusBadRequest, &model.ApiResponse{
			Message: "Invalid path params '/posts/:id' specified",
			Data: nil,
		})
		return
	}

	posts, err := h.APIClient.FetchPosts(1, 1, []string{}, &id)
	if err != nil {
		c.JSON(err.StatusCode, &model.ApiResponse{
			Message: err.Message,
			Data: nil,
		})
	}

	c.JSON(http.StatusOK, posts)
}

func (h *Handler) GetPostImage(c *gin.Context) {
	var query model.QueryParams
	id, idErr := strconv.Atoi(c.Param("id"))

	if err := c.ShouldBindQuery(&query); err != nil {
		c.JSON(http.StatusBadRequest, &model.ApiResponse{
			Message: "Invalid query params specified",
			Data: nil,
		})
		return
	}
	if idErr != nil {
		c.JSON(http.StatusBadRequest, &model.ApiResponse{
			Message: "Invalid path params '/img/:id' specified",
			Data: nil,
		})
		return
	}

	posts, err := h.APIClient.FetchPosts(query.Limit, query.Page, query.Tags, &id)
	if err != nil {
		c.JSON(err.StatusCode, &model.ApiResponse{
			Message: err.Message,
			Data: nil,
		})
	}

	fileName := path.Base(posts.Posts[0].FileURL)
	filePath := fmt.Sprintf("./images/%s", fileName)

	file, fileErr := os.Open(filePath)

	buff := make([]byte, 512)
	if fileErr != nil {
		// Attempt to get the image
		res := h.APIClient.FetchImageToLocal(filePath, posts.Posts[0].FileURL)
		if res != http.StatusOK {
			c.JSON(res, &model.ApiResponse{
				Message: "Failed to fetch image",
				Data: nil,
			})
			return
		}

		// Open the file reader again
		file, fileErr = os.Open(filePath)
		if fileErr != nil {
			c.JSON(res, &model.ApiResponse{
				Message: "Failed to open image after fetching",
				Data: nil,
			})
			return
		}
	}
	defer file.Close()
	
	_, readErr := file.Read(buff)
	if readErr != nil {
		c.JSON(http.StatusInternalServerError, &model.ApiResponse{
			Message: "Failed to read image",
			Data: nil,
		})
		return
	}
	file.Seek(0, 0)
	contentType := http.DetectContentType(buff)

	c.Writer.Header().Set("Content-Type", contentType)
	c.Writer.WriteHeader(http.StatusOK)

	io.Copy(c.Writer, file)
}