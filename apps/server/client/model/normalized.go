package model

import "time"

type Meta struct {
	CurrentPage		int			`json:"current_page"`
	MaxPage			*int		`json:"max_page"`
	Count			*int		`json:"count"`
	Source			string		`json:"source"`
}

type Posts struct {
	Meta
	Posts 			[]Post		`json:"posts"`
}

type Post struct {
	// Common Fields
	ID           	int 		`json:"id"` 
	Title         	*string		`json:"title"`
	CreatedAt    	time.Time	`json:"created_at"`
	Source       	string		`json:"source"`
	Md5          	string		`json:"md5"`
	Rating       	string		`json:"rating"`
	ParentID     	*int		`json:"parent_id"`
	HasChildren  	bool		`json:"has_children"`
	Artist	 		[]string	`json:"artist"`
	Tags         	[]string	`json:"tags"`

	// Asset Fields
	FileURL      	string		`json:"file_url"`
	PreviewURL   	string		`json:"preview_url"`
	SampleURL		string		`json:"sample_url"`
	Width        	int			`json:"width"`
	Height       	int			`json:"height"`
	PreviewWidth  	int			`json:"preview_width"`
	PreviewHeight 	int			`json:"preview_height"`
	SampleWidth		int			`json:"sample_width"`
	SampleHeight	int			`json:"sample_height"`
}

type Tags struct {
	Meta
	Tags			[]Tag		`json:"tags"`
}

type Tag struct {
	ID				int			`json:"id"`
	Name			string		`json:"name"`
	Count			int			`json:"count"`
	Category		Category	`json:"category"`
	CreatedAt		*time.Time	`json:"created_at"`
	UpdatedAt		*time.Time	`json:"updated_at"`
}

type Category int
const (
	CategoryGeneral Category = 1;
	CategoryArtist Category = 2;
	CategoryCopyright Category = 3;
	CategoryCharacter Category = 4;
	CategoryMeta Category = 5;
)