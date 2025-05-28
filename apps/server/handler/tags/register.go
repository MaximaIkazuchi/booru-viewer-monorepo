package tags

import "github.com/gorilla/mux"

func Register(r *mux.Router, t *Tags) {
	r.HandleFunc("/tags", t.GetTags) // Get all tags
	r.HandleFunc("/tags/{id}", t.GetSingleTags) // Get single tag by id
}