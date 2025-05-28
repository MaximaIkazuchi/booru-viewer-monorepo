import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "../utils/useDebounce";
import { isEqual } from "lodash-es";

export type PaginationState = {
  currentPage: number;
  sizePage: number;
};

export type UsePaginatedQueryOpts<TQueryObject, TData> = {
  queryKey: string | string[];
  queryObject: TQueryObject;
  queryFn: (
    queryObject: TQueryObject,
    pagination: PaginationState
  ) => Promise<TData>;
  initialPagination?: PaginationState;
  enabled?: boolean;
};

export const usePaginatedQuery = <TQueryObject, TData>({
  queryKey,
  queryObject,
  queryFn,
  initialPagination = { currentPage: 0, sizePage: 50 },
  enabled = true,
}: UsePaginatedQueryOpts<TQueryObject, TData>) => {
  // State for pagination
  const [pagination, setPagination] =
    useState<PaginationState>(initialPagination);

  // Apply debounce to queryObject
  const debouncedQueryObject = useDebounce(queryObject, 300);
  const prevQueryObjectRef = useRef<TQueryObject | undefined>(undefined);

  // Reset pagination when queryObject changes
  useEffect(() => {
    // Use deep comparison from lodash-es
    if (!isEqual(prevQueryObjectRef.current, debouncedQueryObject)) {
      setPagination((prev) => ({
        currentPage: initialPagination.currentPage,
        sizePage: prev.sizePage,
      }));
      prevQueryObjectRef.current = debouncedQueryObject;
    }
  }, [debouncedQueryObject, initialPagination.currentPage]);

  // Execute the query
  const queryResult = useQuery({
    queryKey: [
      ...(Array.isArray(queryKey) ? queryKey : [queryKey]),
      `page-${pagination.currentPage}`,
      `size-${pagination.sizePage}`,
      JSON.stringify(debouncedQueryObject),
    ],
    queryFn: () => queryFn(debouncedQueryObject, pagination),
    enabled,
  });

  const isLoading = queryResult.isLoading || queryResult.isFetching;

  return {
    ...queryResult,
    pagination,
    setPagination,
    isLoading,
  };
};
