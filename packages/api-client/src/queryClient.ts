import { QueryClient } from "@tanstack/react-query";

const defaultQueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 5,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
};

export const createQueryClient = (config = defaultQueryClientConfig) => {
  return new QueryClient(config);
};

export const queryClient = createQueryClient();
