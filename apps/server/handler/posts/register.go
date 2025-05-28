package posts

import "github.com/gorilla/mux"

func Register(r *mux.Router, p *Posts) {
	r.HandleFunc("/posts", p.GetPosts) // Get all posts
	r.HandleFunc("/posts/{id}", p.GetSinglePost) // Get single post with by id
	r.HandleFunc("/post/image/{id}", p.GetImagePost) // Get image post by post id
}