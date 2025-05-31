package main

import (
	"booru-viewer/server/api"
	"booru-viewer/server/client"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	gelbooruClient := client.InitClient(client.SOURCE_GELBOORU, 10*time.Second)
	gelbooruHandler := api.NewHandler(gelbooruClient)

	danbooruClient := client.InitClient(client.SOURCE_DANBOORU, 10*time.Second)
	danbooruHandler := api.NewHandler(danbooruClient)

	r := gin.Default()
	api := r.Group("/api/v1")
	{
		gelbooru := api.Group("/gelbooru")
		{
			gelbooru.GET("/posts", gelbooruHandler.GetPosts)
			gelbooru.GET("/posts/:id", gelbooruHandler.GetSinglePost)
			gelbooru.GET("/tags", gelbooruHandler.GetTags)
			gelbooru.GET("/tags/:id", gelbooruHandler.GetSingleTag)
		}

		danbooru := api.Group("/danbooru")
		{
			danbooru.GET("/posts", danbooruHandler.GetPosts)
			danbooru.GET("/posts/:id", danbooruHandler.GetSinglePost)
			danbooru.GET("/tags", danbooruHandler.GetTags)
			danbooru.GET("/tags/:id", danbooruHandler.GetSingleTag)
		}

		api.GET("/img/:id", danbooruHandler.GetPostImage)
	}

	r.Run("localhost:8080")
}