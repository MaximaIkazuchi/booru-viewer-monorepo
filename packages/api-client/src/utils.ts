import { AxiosResponse } from "axios";

export const getData = async <T>(
  promise: Promise<AxiosResponse<T>>
): Promise<T | null> => {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    return null;
  }
};
