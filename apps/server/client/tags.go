package client

import (
	"booru-viewer/server/client/model"
	"fmt"
	"math"
	"strconv"
	"time"
)

type Order string
const (
	OrderDate Order = "date";
	OrderCount Order = "count";
	OrderName Order = "name";
)

func (c *Client) FetchTags(limit int, page int, order Order, search string, id *int) (*model.Tags, *ClientError) {
	var result *model.Tags
	var clientErr *ClientError

	if c.source == SOURCE_GELBOORU {
		var params map[string]string

		if id == nil {
			params = map[string]string{
				"s": "tag",
				"q": "index",
				"json": "1",
				"pid": strconv.Itoa(page - 1),
				"limit": strconv.Itoa(limit),
				"name_pattern": fmt.Sprintf("%s%%", search),
				"orderby": fmt.Sprintf("%s", order),
			}
		} else {
			params = map[string]string{
				"s": "tag",
				"q": "index",
				"json": "1",
				"id": strconv.Itoa(*id),
				"pid": strconv.Itoa(0),
				"limit": strconv.Itoa(1),
				"name_pattern": "",
				"orderby": "",
			}
		}

		res, err := c.httpClient.R().SetResult(&model.TagsGelbooru{}).SetQueryParams(params).Get(string(c.source))
		if err != nil {
			return nil, &ClientError{
				StatusCode: res.StatusCode(),
				Message: err.Error(),
			}
		}

		resTags := res.Result().(*model.TagsGelbooru)

		tags := make([]model.Tag, len(resTags.Tag))
		for i, t := range resTags.Tag {
			tags[i] = model.Tag{
				ID: t.ID,
				Name: t.Name,
				Count: t.Count,
				Category: model.Category(t.Type),
				CreatedAt: nil,
				UpdatedAt: nil,
			}
		}

		currentPage := (resTags.Attributes.Offset / resTags.Attributes.Limit) + 1
		maxPage := int(math.Ceil(float64(resTags.Attributes.Count) / float64(resTags.Attributes.Limit)))
		result = &model.Tags{
			Meta: model.Meta{
				CurrentPage: currentPage,
				MaxPage: &maxPage,
				Count: &resTags.Attributes.Count,
				Source: string(c.Source()),
			},
			Tags: tags,
		}
		clientErr = nil
	} else if c.source == SOURCE_DANBOORU {
		var path string
		var params map[string]string
		var setResult any

		if id == nil {
			path = ""
			params = map[string]string{
				"page": strconv.Itoa(page),
				"limit": strconv.Itoa(limit),
				"search[name_matches]": fmt.Sprintf("%s*", search),
				"search[order]": fmt.Sprintf("%s", order),
			}
			setResult = &[]model.TagDanbooru{}
		} else {
			path = strconv.Itoa(*id)
			params = map[string]string{
				"page": strconv.Itoa(1),
				"limit": strconv.Itoa(1),
				"search[name_matches]": "",
				"search[order]": "",
			}
			setResult = &model.TagDanbooru{}
		}

		res, err := c.httpClient.R().SetResult(setResult).SetPathParam("id", path).SetQueryParams(params).SetHeader("Accept", "application/json").Get(fmt.Sprintf("%s/tags/{id}", string(c.source)))
		if err != nil {
			return nil, &ClientError{
				StatusCode: res.StatusCode(),
				Message: err.Error(),
			}
		}

		var resTags *[]model.TagDanbooru
		switch t := res.Result().(type) {
		case *[]model.TagDanbooru:
			resTags = t
		case *model.TagDanbooru:
			resTags = &[]model.TagDanbooru{*t}
		}

		tags := make([]model.Tag, len(*resTags))
		for i, t := range *resTags {
			createdAt, _ := time.Parse("2025-05-31T09:36:11.411-04:00", t.CreatedAt)
			updatedAt, _ := time.Parse("2025-05-31T09:36:11.411-04:00", t.UpdatedAt)

			tags[i] = model.Tag{
				ID: t.ID,
				Name: t.Name,
				Count: t.PostCount,
				Category: model.Category(t.Category),
				CreatedAt: &createdAt,
				UpdatedAt: &updatedAt,
			}
		}

		result = &model.Tags{
			Meta: model.Meta{
				CurrentPage: page,
				MaxPage: nil,
				Count: nil,
				Source: string(c.Source()),
			},
			Tags: tags,
		}
		clientErr = nil
	}

	return result, clientErr
}
