import { FetchSource, TagsResponse } from "../typings";
import { apiClient } from "../client";
import { AxiosResponse } from "axios";

export type Order = "date" | "count" | "name";

export const tagsApi = {
  getAllTags: async (
    source: FetchSource,
    opts?: {
      page: number;
      limit: number;
      search?: string;
      order?: Order;
    }
  ): Promise<AxiosResponse<TagsResponse>> => {
    const params = opts
      ? {
          page: opts.page,
          limit: opts.limit,
          search: opts.search || "",
          order: opts.order || "count",
        }
      : {};

    return apiClient.get(`/${source}/tags`, {
      params,
    });
  },

  getSingleTag: async (
    source: FetchSource,
    tagID: number
  ): Promise<AxiosResponse<TagsResponse>> => {
    return apiClient.get(`/${source}/posts/${tagID}`);
  },
};
