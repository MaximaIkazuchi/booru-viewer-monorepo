package main

import (
	"booru-viewer/server/api"
	"booru-viewer/server/client"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	feOrigin := os.Getenv("FE_ORIGIN")

	gelbooruClient := client.InitClient(client.SOURCE_GELBOORU, 10*time.Second)
	gelbooruHandler := api.NewHandler(gelbooruClient)

	danbooruClient := client.InitClient(client.SOURCE_DANBOORU, 10*time.Second)
	danbooruHandler := api.NewHandler(danbooruClient)

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", feOrigin}, // frontend URL
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	api := r.Group("/api/v1")
	{
		api.GET("/ping", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "HIDUP JOKOWI!"})
		})

		gelbooru := api.Group("/gelbooru")
		{
			gelbooru.GET("/posts", gelbooruHandler.GetPosts)
			gelbooru.GET("/posts/:id", gelbooruHandler.GetSinglePost)
			gelbooru.GET("/tags", gelbooruHandler.GetTags)
			gelbooru.GET("/tags/:id", gelbooruHandler.GetSingleTag)
			gelbooru.GET("/img/:id", gelbooruHandler.GetPostImage)
		}

		danbooru := api.Group("/danbooru")
		{
			danbooru.GET("/posts", danbooruHandler.GetPosts)
			danbooru.GET("/posts/:id", danbooruHandler.GetSinglePost)
			danbooru.GET("/tags", danbooruHandler.GetTags)
			danbooru.GET("/tags/:id", danbooruHandler.GetSingleTag)
			danbooru.GET("/img/:id", danbooruHandler.GetPostImage)
		}
	}

	// Serve static files
	r.Static("/assets", "./dist/assets")
	r.StaticFile("/favicon.ico", "./dist/favicon.ico")
	r.StaticFile("/yabv.png", "./dist/yabv.png")

	r.NoRoute(func(c *gin.Context) {
		c.File("./dist/index.html")
	})

	r.Run(":8080")
}
