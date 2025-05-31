export type FetchSource = "danbooru" | "gelbooru";

export type PostsResponse = {
  current_page: number;
  max_page: number | null;
  count: number | null;
  source: string;
  posts: Post[];
};

export type Post = {
  id: number;
  title: string | null;
  created_at: Date;
  source: string;
  md5: string;
  rating: string;
  parent_id: number | null;
  has_children: boolean;
  artist: string[] | null;
  tags: string[];
  file_url: string;
  preview_url: string;
  sample_url: string;
  width: number;
  height: number;
  preview_width: number;
  preview_height: number;
  sample_width: number;
  sample_height: number;
};

export type TagsResponse = {
  current_page: number;
  max_page: number | null;
  count: number | null;
  source: string;
  tags: Tag[];
};

export type Tag = {
  id: number;
  name: string;
  count: number;
  category: number;
  created_at: Date | null;
  updated_at: Date | null;
};
