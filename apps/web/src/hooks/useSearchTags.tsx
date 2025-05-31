import { FetchSource, getData, Order, tagsApi } from "@repo/api-client";
import { Badge, ScrollArea } from "@repo/shadcn-ui";
import { useQuery } from "@tanstack/react-query";
import { TruncatingTooltip } from "../components/TruncatingTooltip";
import React from "react";
import { cn } from "@repo/shadcn-ui";

type UseSearchTagsProps = {
  queryKey: string;
  source: FetchSource;
  limit?: number;
  startPage?: number;
  search?: string;
  order?: Order;
  onAddTag?: (tag: string) => void;
};

export const useSearchTags = ({
  queryKey,
  source,
  limit = 15,
  startPage = 1,
  search = "",
  order = "count",
  onAddTag,
}: UseSearchTagsProps) => {
  const queryResult = useQuery({
    queryKey: [queryKey, search, source],
    queryFn: () =>
      getData(
        tagsApi.getAllTags(source, {
          page: startPage,
          limit: limit,
          search: search,
          order: order,
        })
      ),
  });

  const ResultComponent = ({
    ...props
  }: React.ComponentProps<typeof ScrollArea> = {}) => {
    return (
      search.length > 0 &&
      queryResult.data && (
        <ScrollArea
          {...props}
          className={cn("border rounded-md", props.className)}
        >
          {queryResult.data.tags ? (
            queryResult.data.tags.map((tag, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_auto] hover:bg-secondary hover:cursor-pointer p-2"
                onClick={() => {
                  return onAddTag && onAddTag(tag.name);
                }}
              >
                <TruncatingTooltip text={tag.name} />
                <Badge variant={"outline"}>
                  {Math.abs(tag.count) >= 1000
                    ? `${(tag.count / 1000).toFixed(1)}k`
                    : tag.count}
                </Badge>
              </div>
            ))
          ) : (
            <p className="w-full text-center">Not Found</p>
          )}
        </ScrollArea>
      )
    );
  };

  return {
    ...queryResult,
    search,
    ResultComponent,
  };
};
