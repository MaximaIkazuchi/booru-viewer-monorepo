package posts

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strconv"

	"booru-viewer/server/api"
	"booru-viewer/server/api/posts"
	"booru-viewer/server/utils"

	"github.com/gorilla/mux"
)

type Posts struct {
	Client *api.Client
}

func (p *Posts) GetPosts(w http.ResponseWriter, r *http.Request) {
	paramNumbers, nerr := utils.CollectIntQuery(r, map[string]int {
		"limit": 50,
		"page": 1,
	})
	if nerr != nil {
		utils.WriteError(w, http.StatusBadRequest, "INVALID_REQUEST_PARAM", nerr.Error())
		return
	}

	paramStrings := utils.CollectStringQuery(r, map[string]string{
		"tags": "",
	})

	postsResponse, cerr := posts.FetchPosts(p.Client, paramNumbers["limit"], paramNumbers["page"], paramStrings["tags"], nil)
	if cerr != nil {
		utils.WriteError(w, cerr.StatusCode, "INTERNAL_ERROR", cerr.Message)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(postsResponse)
}

func (p *Posts) GetSinglePost(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	
	var postID int
	if id, err := strconv.Atoi(id); err == nil {
		postID = id
	} else {
		utils.WriteError(w, http.StatusBadRequest, "INVALID_ID", "Post id must be a number")
		return
	}

	postResponse, cerr := posts.FetchPosts(p.Client, 1, 0, "", &postID)
	if cerr != nil {
		utils.WriteError(w, cerr.StatusCode, "INTERNAL_ERROR", cerr.Message)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(postResponse)
}

func (p *Posts) GetImagePost(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	
	var postID int
	if id, err := strconv.Atoi(id); err == nil {
		postID = id
	} else {
		utils.WriteError(w, http.StatusBadRequest, "INVALID_ID", "Post id must be a number")
		return
	}

	postResponse, cerr := posts.FetchPosts(p.Client, 1, 0, "", &postID)
	if cerr != nil {
		utils.WriteError(w, cerr.StatusCode, "INTERNAL_ERROR", cerr.Message)
		return
	}

	url := postResponse.Post[0].SampleURL
	if url == "" {
		url = postResponse.Post[0].FileURL
	}
	imageResponse, ierr := http.Get(url)
	if ierr != nil {
		http.Error(w, "Failed to fetch image", http.StatusBadGateway)
		return
	}
	defer imageResponse.Body.Close()

	w.Header().Set("Content-Type", imageResponse.Header.Get("Content-Type"))
	w.WriteHeader(http.StatusOK)

	_, err := io.Copy(w, imageResponse.Body)
	if err != nil {
		log.Println("Error copying response body:", err)
	}
}