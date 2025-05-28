package posts

import (
	"booru-viewer/server/api"
	"booru-viewer/server/api/model"
	"encoding/json"
	"fmt"
	"net/http"
)

// FetchPosts fetches posts from the API.
//
// Parameters:
//   - limit: the maximum number of posts to fetch
//   - page: the starting post ID page/offset
//	 - tags: posts search according tags specified
//   - postID: show single post with its ID
//
// Returns:
//   - Posts: the fetched posts result
//   - *ClientError: detailed error with status code and message if failed
func FetchPosts(c *api.Client, limit int, page int, tags string, postID *int) (*model.Posts, *api.ClientError) {
	var url string
	if postID != nil {
		url = fmt.Sprintf("%s&s=post&q=index&json=1&id=%d", c.BaseAPI(), *postID);
	} else {
		url = fmt.Sprintf("%s&s=post&q=index&json=1&limit=%d&pid=%d&tags=%s", c.BaseAPI(), limit, page - 1, tags);
	}

	resp, err := c.HTTPClient().Get(url);
	if err != nil {
		return &model.Posts{}, &api.ClientError{
			StatusCode: http.StatusServiceUnavailable,
			Message: fmt.Sprintf("request error: %s", err),
		}
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return &model.Posts{}, &api.ClientError{
			StatusCode: resp.StatusCode,
			Message: fmt.Sprintf("unexpected status code: %d", resp.StatusCode),
		}
	}

	var posts *model.Posts
	if err := json.NewDecoder(resp.Body).Decode(&posts); err != nil {
		return &model.Posts{}, &api.ClientError{
			StatusCode: resp.StatusCode,
			Message: fmt.Sprintf("decoding error: %s", err),
		}
	}

	return posts, nil
}