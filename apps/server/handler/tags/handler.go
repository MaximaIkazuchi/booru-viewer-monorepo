package tags

import (
	"booru-viewer/server/api"
	"booru-viewer/server/api/tags"
	"booru-viewer/server/utils"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type Tags struct {
	Client *api.Client
}

func (t *Tags) GetTags(w http.ResponseWriter, r *http.Request) {
	paramNumbers, nerr := utils.CollectIntQuery(r, map[string]int {
		"limit": 15,
		"page": 1,
	})
	if nerr != nil {
		utils.WriteError(w, http.StatusBadRequest, "INVALID_REQUEST_PARAM", nerr.Error())
		return
	}

	paramStrings := utils.CollectStringQuery(r, map[string]string{
		"search": "",
		"order": "desc",
		"orderby": "count",
	})

	posts, cerr := tags.FetchTags(t.Client, paramNumbers["limit"], paramNumbers["page"], paramStrings["search"], tags.Order(paramStrings["order"]), tags.OrderBy(paramStrings["orderby"]), nil)
	if cerr != nil {
		utils.WriteError(w, cerr.StatusCode, "INTERNAL_ERROR", cerr.Message)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(posts)
}

func (t *Tags) GetSingleTags(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	
	var tagID int
	if id, err := strconv.Atoi(id); err == nil {
		tagID = id
	} else {
		utils.WriteError(w, http.StatusBadRequest, "INVALID_ID", "Tag id must be a number")
		return
	}

	tagResponse, cerr := tags.FetchTags(t.Client, 1, 0, "", tags.Order("desc"), tags.OrderBy("count"), &tagID)
	if cerr != nil {
		utils.WriteError(w, cerr.StatusCode, "INTERNAL_ERROR", cerr.Message)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tagResponse)
}