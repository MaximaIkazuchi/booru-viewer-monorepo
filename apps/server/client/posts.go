package client

import (
	"booru-viewer/server/client/model"
	"fmt"
	"math"
	"strconv"
	"strings"
	"time"
)

func (c *Client) FetchPosts(limit int, page int, tags []string, id *int) (*model.Posts, *ClientError) {
	var result *model.Posts
	var clientErr *ClientError

	if c.source == SOURCE_GELBOORU {
		var params map[string]string

		if id == nil {
			params = map[string]string{
				"s": "post",
				"q": "index",
				"json": "1",
				"pid": strconv.Itoa(page - 1),
				"limit": strconv.Itoa(limit),
				"tags": strings.Join(tags, "+"),
			}
		} else {
			params = map[string]string{
				"s": "post",
				"q": "index",
				"json": "1",
				"id": strconv.Itoa(*id),
				"pid": strconv.Itoa(0),
				"limit": strconv.Itoa(1),
				"tags": "",
			}
		}

		res, err := c.httpClient.R().SetResult(&model.PostsGelbooru{}).SetQueryParams(params).Get(string(c.source))
		if err != nil {
			return nil, &ClientError{
				StatusCode: res.StatusCode(),
				Message: err.Error(),
			}
		}

		resPosts := res.Result().(*model.PostsGelbooru)

		posts := make([]model.Post, len(resPosts.Post))
		for i, p := range resPosts.Post {
			createdAt, _ := time.Parse("Wed May 28 03:45:38 -0500 2025", p.CreatedAt)
			hasChildren, _ := strconv.ParseBool(p.HasChildren)
			tags := strings.Split(p.Tags, " ")

			posts[i] = model.Post{
				ID: p.ID,
				Source: p.Source,
				Md5: p.Md5,
				Rating: p.Rating,
				ParentID: &p.ParentID,
				Artist: nil,
				FileURL: p.FileURL,
				PreviewURL: p.PreviewURL,
				SampleURL: p.SampleURL,
				Width: p.Width,
				Height: p.Height,
				PreviewWidth: p.PreviewWidth,
				PreviewHeight: p.PreviewHeight,
				SampleWidth: p.SampleWidth,
				SampleHeight: p.SampleHeight,
				CreatedAt: createdAt,
				HasChildren: hasChildren,
				Tags: tags,
			}
		}

		currentPage := (resPosts.Attributes.Offset / resPosts.Attributes.Limit) + 1
		maxPage := int(math.Ceil(float64(resPosts.Attributes.Count) / float64(resPosts.Attributes.Limit)))
		result = &model.Posts{
			Meta: model.Meta{
				CurrentPage: currentPage,
				MaxPage: &maxPage,
				Count: &resPosts.Attributes.Count,
				Source: string(c.Source()),
			},
			Posts: posts,
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
				"tags": strings.Join(tags, "+"),
			}
			setResult = &[]model.PostDanbooru{}
		} else {
			path = strconv.Itoa(*id)
			params = map[string]string{
				"page": strconv.Itoa(1),
				"limit": strconv.Itoa(1),
				"tags": "",
			}
			setResult = &model.PostDanbooru{}
		}

		res, err := c.httpClient.R().SetResult(setResult).SetPathParam("id", path).SetQueryParams(params).SetHeader("Accept", "application/json").Get(fmt.Sprintf("%s/posts/{id}", c.source))
		if err != nil {
			return nil, &ClientError{
				StatusCode: res.StatusCode(),
				Message: err.Error(),
			}
		}
		
		var resPosts *[]model.PostDanbooru
		switch t := res.Result().(type) {
		case *[]model.PostDanbooru:
			resPosts = t
		case *model.PostDanbooru:
			resPosts = &[]model.PostDanbooru{*t}
		}

		posts := make([]model.Post, len(*resPosts))
		for i, p := range *resPosts {
			tags := strings.Split(p.TagString, " ")
			artistTags := strings.Split(p.TagStringArtist, " ")
			createdAt, _ := time.Parse("2025-05-31T09:36:11.411-04:00", p.CreatedAt)

			var previewUrl string
			var sampleUrl string
			var originalUrl string
			var width int
			var height int
			var previewWidth int
			var previewHeight int
			var sampleWidth int
			var sampleHeight int

			for _, variant := range p.MediaAsset.Variants {
				if variant.Type == "360x360" {
					previewUrl = variant.URL
					previewWidth = variant.Width
					previewHeight = variant.Height
				} else if variant.Type == "sample" {
					sampleUrl = variant.URL
					sampleWidth = variant.Width
					sampleHeight = variant.Height
				} else if variant.Type == "original" {
					originalUrl = variant.URL
					width = variant.Width
					height = variant.Height
				}
			}

			posts[i] = model.Post{
				ID: p.ID,
				Title: nil,
				Source: p.Source,
				Md5: p.Md5,
				Rating: p.Rating,
				ParentID: &p.ParentID,
				FileURL: originalUrl,
				PreviewURL: previewUrl,
				SampleURL: sampleUrl,
				Width: width,
				Height: height,
				PreviewWidth: previewWidth,
				PreviewHeight: previewHeight,
				SampleWidth: sampleWidth,
				SampleHeight: sampleHeight,
				Artist: artistTags,
				CreatedAt: createdAt,
				HasChildren: p.HasChildren,
				Tags: tags,
			}
		}

		result = &model.Posts{
			Meta: model.Meta{
				CurrentPage: page,
				MaxPage: nil,
				Count: nil,
				Source: string(c.Source()),
			},
			Posts: posts,
		}
		clientErr = nil
	}

	return result, clientErr
}

func (c *Client) FetchImageToLocal(path string, url string) int {
	res, err := c.httpClient.R().SetOutput(path).Get(url)

	if err != nil {
		fmt.Println("Download error", err)
		return res.StatusCode()
	}

	fmt.Printf("File saved in %s\n", path)
	return res.StatusCode()
}