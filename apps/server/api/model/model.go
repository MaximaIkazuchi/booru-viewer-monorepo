package model

type Posts struct {
	Attributes PostsAttributes    `json:"@attributes"`
	Post       []PostElement `json:"post"`
}

type PostsAttributes struct {
	Limit  int64 `json:"limit"`
	Offset int64 `json:"offset"`
	Count  int64 `json:"count"`
}

type PostElement struct {
	ID            int64  `json:"id"`
	CreatedAt     string `json:"created_at"`
	Score         int64  `json:"score"`
	Width         int64  `json:"width"`
	Height        int64  `json:"height"`
	Md5           string `json:"md5"`
	Directory     string `json:"directory"`
	Image         string `json:"image"`
	Rating        string `json:"rating"`
	Source        string `json:"source"`
	Change        int64  `json:"change"`
	Owner         string `json:"owner"`
	CreatorID     int64  `json:"creator_id"`
	ParentID      int64  `json:"parent_id"`
	Sample        int64  `json:"sample"`
	PreviewHeight int64  `json:"preview_height"`
	PreviewWidth  int64  `json:"preview_width"`
	Tags          string `json:"tags"`
	Title         string `json:"title"`
	HasNotes      string `json:"has_notes"`
	HasComments   string `json:"has_comments"`
	FileURL       string `json:"file_url"`
	PreviewURL    string `json:"preview_url"`
	SampleURL     string `json:"sample_url"`
	SampleHeight  int64  `json:"sample_height"`
	SampleWidth   int64  `json:"sample_width"`
	Status        string `json:"status"`
	PostLocked    int64  `json:"post_locked"`
	HasChildren   string `json:"has_children"`
}

type Tags struct {
	Attributes TagsAttributes `json:"@attributes"`
	Tag        []Tag      `json:"tag"`
}

type TagsAttributes struct {
	Limit  int64 `json:"limit"`
	Offset int64 `json:"offset"`
	Count  int64 `json:"count"`
}

type Tag struct {
	ID        int64  `json:"id"`
	Name      string `json:"name"`
	Count     int64  `json:"count"`
	Type      int64  `json:"type"`
	Ambiguous int64  `json:"ambiguous"`
}
