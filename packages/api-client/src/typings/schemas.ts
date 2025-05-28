export type Attributes = {
  limit: number;
  offset: number;
  count: number;
};

export type PostsResponse = {
  "@attributes": Attributes;
  post: Post[];
};

export type Post = {
  id: number;
  created_at: string;
  score: number;
  width: number;
  height: number;
  md5: string;
  directory: string;
  image: string;
  rating: string;
  source: string;
  change: number;
  owner: string;
  creator_id: number;
  parent_id: number;
  sample: number;
  preview_height: number;
  preview_width: number;
  tags: string;
  title: string;
  has_notes: string;
  has_comments: string;
  file_url: string;
  preview_url: string;
  sample_url: string;
  sample_height: number;
  sample_width: number;
  status: string;
  post_locked: number;
  has_children: string;
};

export type TagsResponse = {
  "@attributes": Attributes;
  tag: Tag[];
};

export type Tag = {
  id: number;
  name: string;
  count: number;
  type: number;
  ambiguous: number;
};
