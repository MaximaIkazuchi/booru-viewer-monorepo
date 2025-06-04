import axios from "axios";

export type ApiClientConfig = {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
};

export const getApiUrl = (): string => {
  return import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";
};

export const defaultApiConfig: ApiClientConfig = {
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const createApiClient = (config: ApiClientConfig = defaultApiConfig) => {
  const client = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout || defaultApiConfig.timeout,
    headers: {
      ...defaultApiConfig.headers,
      ...config.headers,
    },
  });
  return client;
};

export const apiClient = createApiClient();
