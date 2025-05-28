package tags

import (
	"booru-viewer/server/api"
	"booru-viewer/server/api/model"
	"encoding/json"
	"fmt"
	"net/http"
)

type Order string

const (
	Asc		Order = "asc"
	Desc	Order = "desc"
)

type OrderBy string

const (
	Date	OrderBy = "date"
	Count	OrderBy = "count"
	Name	OrderBy = "name"
)

func FetchTags(c *api.Client, limit int, page int, search string, order Order, orderby OrderBy, tagID *int) (model.Tags, *api.ClientError) {
	var url string
	if tagID != nil {
		url = fmt.Sprintf("%s&s=tag&q=index&json=1&id=%d", c.BaseAPI(), *tagID);
	} else {
		url = fmt.Sprintf("%s&s=tag&q=index&json=1&limit=%d&pid=%d&name_pattern=%s%%&order=%s&orderby=%s", c.BaseAPI(), limit, page - 1, search, order, orderby);
	}

	resp, err := c.HTTPClient().Get(url);
	if err != nil {
		return model.Tags{}, &api.ClientError{
			StatusCode: http.StatusServiceUnavailable,
			Message: fmt.Sprintf("request error: %s", err),
		}
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return model.Tags{}, &api.ClientError{
			StatusCode: resp.StatusCode,
			Message: fmt.Sprintf("unexpected status code: %d", resp.StatusCode),
		}
	}

	var tags model.Tags
	if err := json.NewDecoder(resp.Body).Decode(&tags); err != nil {
		return model.Tags{}, &api.ClientError{
			StatusCode: resp.StatusCode,
			Message: fmt.Sprintf("decoding error: %s", err),
		}
	}

	return tags, nil
}