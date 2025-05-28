import { tagsApi } from "@repo/api-client";
import { Badge, ScrollArea } from "@repo/shadcn-ui";
import { useQuery } from "@tanstack/react-query";
import { TruncatingTooltip } from "../components/TruncatingTooltip";
import React from "react";
import { cn } from "@repo/shadcn-ui";

type UseSearchTagsProps = {
  queryKey: string;
  limit?: number;
  startPage?: number;
  search?: string;
  onAddTag?: (tag: string) => void;
};

export const useSearchTags = ({
  queryKey,
  limit = 15,
  startPage = 1,
  search = "",
  onAddTag,
}: UseSearchTagsProps) => {
  const queryResult = useQuery({
    queryKey: [queryKey, search],
    queryFn: () =>
      tagsApi.getAllTags({
        limit: limit,
        page: startPage,
        search: search,
      }),
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
          {queryResult.data.tag ? (
            queryResult.data.tag.map((tag, i) => (
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
