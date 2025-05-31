package model

import "time"

type PostDanbooru struct {
	ID                  int       `json:"id"`
	CreatedAt           time.Time   `json:"created_at"`
	UploaderID          int       `json:"uploader_id"`
	Score               int       `json:"score"`
	Source              string      `json:"source"`
	Md5                 string      `json:"md5"`
	LastCommentBumpedAt *time.Time	`json:"last_comment_bumped_at"`
	Rating              string      `json:"rating"`
	ImageWidth          int       `json:"image_width"`
	ImageHeight         int       `json:"image_height"`
	TagString           string      `json:"tag_string"`
	FavCount            int       `json:"fav_count"`
	FileEXT             string      `json:"file_ext"`
	LastNotedAt         *time.Time  `json:"last_noted_at"`
	ParentID            *int      `json:"parent_id"`
	HasChildren         bool        `json:"has_children"`
	ApproverID          *int      `json:"approver_id"`
	TagCountGeneral     int       `json:"tag_count_general"`
	TagCountArtist      int       `json:"tag_count_artist"`
	TagCountCharacter   int       `json:"tag_count_character"`
	TagCountCopyright   int       `json:"tag_count_copyright"`
	FileSize            int       `json:"file_size"`
	UpScore             int       `json:"up_score"`
	DownScore           int       `json:"down_score"`
	IsPending           bool        `json:"is_pending"`
	IsFlagged           bool        `json:"is_flagged"`
	IsDeleted           bool        `json:"is_deleted"`
	TagCount            int       `json:"tag_count"`
	UpdatedAt           time.Time   `json:"updated_at"`
	IsBanned            bool        `json:"is_banned"`
	PixivID             *int      `json:"pixiv_id"`
	LastCommentedAt     *time.Time  `json:"last_commented_at"`
	HasActiveChildren   bool        `json:"has_active_children"`
	BitFlags            int       `json:"bit_flags"`
	TagCountMeta        int       `json:"tag_count_meta"`
	HasLarge            bool        `json:"has_large"`
	HasVisibleChildren  bool        `json:"has_visible_children"`
	MediaAsset          MediaAsset  `json:"media_asset"`
	TagStringGeneral    string      `json:"tag_string_general"`
	TagStringCharacter  string      `json:"tag_string_character"`
	TagStringCopyright  string      `json:"tag_string_copyright"`
	TagStringArtist     string      `json:"tag_string_artist"`
	TagStringMeta       string      `json:"tag_string_meta"`
	FileURL             string      `json:"file_url"`
	LargeFileURL        string      `json:"large_file_url"`
	PreviewFileURL      string      `json:"preview_file_url"`
}

type MediaAsset struct {
	ID          int       `json:"id"`
	CreatedAt   time.Time   `json:"created_at"`
	UpdatedAt   time.Time   `json:"updated_at"`
	Md5         string      `json:"md5"`
	FileEXT     string      `json:"file_ext"`
	FileSize    int       `json:"file_size"`
	ImageWidth  int       `json:"image_width"`
	ImageHeight int       `json:"image_height"`
	Duration    *time.Time	`json:"duration"`
	Status      string      `json:"status"`
	FileKey     string      `json:"file_key"`
	IsPublic    bool        `json:"is_public"`
	PixelHash   string      `json:"pixel_hash"`
	Variants    []Variant   `json:"variants"`
}

type Variant struct {
	Type    string `json:"type"`
	URL     string `json:"url"`
	Width   int  `json:"width"`
	Height  int  `json:"height"`
	FileEXT string `json:"file_ext"`
}

type TagDanbooru struct {
	ID           int     `json:"id"`
	Name         string    `json:"name"`
	PostCount    int     `json:"post_count"`
	Category     int     `json:"category"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	IsDeprecated bool      `json:"is_deprecated"`
	Words        []string  `json:"words"`
}
