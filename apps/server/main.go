package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"booru-viewer/server/api"
	"booru-viewer/server/handler/posts"
	"booru-viewer/server/handler/tags"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env files")
	}
	baseAPI := os.Getenv("CLIENT_API_URL")
	apiKey := os.Getenv("API_KEY_SEARCH")
	client := api.NewClient(fmt.Sprintf("%s%s", baseAPI, apiKey), 5*time.Second)

	router := mux.NewRouter()
	subrouter := router.PathPrefix("/api/v1").Subrouter()

	// Posts related endpoint
	posts.Register(subrouter, &posts.Posts{ Client: client })

	// Tags related endpoint
	tags.Register(subrouter, &tags.Tags{ Client: client })

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:8080", "http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

    staticDir := "./fe"
    router.PathPrefix("/").Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        path := filepath.Join(staticDir, r.URL.Path)
        _, err := os.Stat(path)

        if os.IsNotExist(err) || isDir(path) {
            http.ServeFile(w, r, filepath.Join(staticDir, "index.html"))
        } else {
            http.ServeFile(w, r, path)
        }
    }))

	fmt.Println("Server running at http://localhost:8080")
	log.Fatal(http.ListenAndServe("0.0.0.0:8080", c.Handler(router)))
}

func isDir(path string) bool {
    info, err := os.Stat(path)
    return err == nil && info.IsDir()
}