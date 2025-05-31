import { FetchSource, PostsResponse } from "../typings";
import { apiClient } from "../client";
import { AxiosResponse } from "axios";

export const postsApi = {
  getAllPosts: async (
    source: FetchSource,
    opts?: {
      page: number;
      limit: number;
      tags?: string[];
    }
  ): Promise<AxiosResponse<PostsResponse>> => {
    const params = opts
      ? {
          limit: opts.limit,
          page: opts.page,
          tags: opts.tags ? opts.tags.join(" ") : "",
        }
      : {};

    return apiClient.get(`/${source}/posts`, {
      params,
    });
  },

  getSinglePost: async (
    source: FetchSource,
    postID: number
  ): Promise<AxiosResponse<PostsResponse>> => {
    return apiClient.get(`/${source}/posts/${postID}`);
  },

  getImagePost: async (
    source: FetchSource,
    postID?: number
  ): Promise<AxiosResponse<Blob>> => {
    const id = postID || 404;
    return apiClient.get(`${source}/img/${id}`, {
      responseType: "blob",
    });
  },
};
