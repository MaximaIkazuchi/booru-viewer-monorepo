import { PostsResponse } from "../typings";
import { apiClient } from "../client";
import { AxiosResponse } from "axios";

export const postsApi = {
  getAllPosts: async (opts?: {
    page: number;
    limit: number;
    tags?: string[];
  }): Promise<AxiosResponse<PostsResponse>> => {
    const url = opts
      ? `/posts?limit=${opts.limit}&page=${opts.page}&tags=${opts.tags ? opts.tags.join("+") : ""}`
      : `/posts`;
    return apiClient.get(url);
  },

  getSinglePost: async (
    postID: number
  ): Promise<AxiosResponse<PostsResponse>> => {
    return apiClient.get(`/posts/${postID}`);
  },

  getImagePost: async (postID?: number): Promise<AxiosResponse<Blob>> => {
    const url = postID
      ? `/post/image/${postID}`
      : "https://placehold.co/600x400@3x.png";
    return apiClient.get(url, {
      responseType: "blob",
    });
  },
};
