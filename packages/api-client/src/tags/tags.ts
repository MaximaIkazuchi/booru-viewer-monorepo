import { TagsResponse } from "../typings";
import { apiClient } from "../client";

export const tagsApi = {
  getAllTags: async (opts?: {
    page: number;
    limit: number;
    search?: string;
    order?: "asc" | "desc";
    orderBy?: "date" | "count" | "name";
  }): Promise<TagsResponse> => {
    const url = opts
      ? `/tags?page=${opts.page}&limit=${opts.limit}&search=${opts.search ?? ""}&order=${opts.order ?? "desc"}&orderby=${opts.orderBy ?? "count"}`
      : `/tags`;

    return (await apiClient(url)).data;
  },
  getSingleTag: async (tagID: number): Promise<TagsResponse> => {
    return (await apiClient(`/tags/${tagID}`)).data;
  },
};
