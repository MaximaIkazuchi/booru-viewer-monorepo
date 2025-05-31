package model

type QueryParams struct {
	Page	int			`form:"page"`
	Limit	int 		`form:"limit"`
	Search	string		`form:"search"`
	Order	string		`form:"order"`
	TagsRaw	string		`form:"tags"`
	Tags	[]string	`form:"-"`
}