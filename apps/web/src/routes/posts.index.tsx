import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getData, postsApi } from "@repo/api-client";
import { useTagsStore } from "../stores/tags.store";
import { useDebounce } from "@repo/hooks";
import { Spinner } from "../components/Spinner";
import { useSettingsStore } from "../stores/settings.store";
import { Button } from "@repo/shadcn-ui";
import Masonry from "react-masonry-css";
import { useCallback, useRef } from "react";

export const Route = createFileRoute("/posts/")({
  component: Posts,
});

function Posts() {
  const navigate = useNavigate({ from: Route.fullPath });

  // Use Activated Tags
  const { tags: activatedTags } = useTagsStore();

  // Use Activated Settings
  const { r18 } = useSettingsStore();
  const activatedSettings = { r18: r18 ? "" : "rating:general" };

  // Combine Tags and Settings
  const debouncedAllTags = useDebounce(
    [...activatedTags, ...Object.values(activatedSettings)],
    300
  );

  // Infinite scroll related
  const sizeFetch = 35;
  const fetchPosts = async ({ pageParam }: { pageParam: number }) =>
    getData(
      postsApi.getAllPosts({
        limit: sizeFetch,
        page: pageParam,
        tags: debouncedAllTags,
      })
    );

  const {
    data: posts,
    hasNextPage,
    isFetching,
    isLoading,
    status,
    error,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", debouncedAllTags],
    queryFn: fetchPosts,
    initialPageParam: 1,
    getNextPageParam: (lastFetch) => {
      if (lastFetch && lastFetch["@attributes"]) {
        const { offset, limit, count } = lastFetch["@attributes"];
        const totalPages = Math.ceil(count / limit);
        const currentPage = offset / limit + 1;

        return currentPage < totalPages ? currentPage + 1 : undefined;
      } else {
        return undefined;
      }
    },
  });

  // Scroll observer
  const observer = useRef<IntersectionObserver>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetching, isLoading]
  );

  return (
    <div className="w-full flex flex-col items-center">
      {status === "pending" ? (
        <div className="w-full flex justify-center">
          <Spinner />
        </div>
      ) : status === "error" ? (
        <div className="p-4 bg-red-100 text-red-700 rounded mx-auto">
          Error loading posts: {error.message}
        </div>
      ) : (
        <>
          <Masonry
            breakpointCols={{
              default: 5,
              1024: 4,
              768: 3,
              640: 2,
            }}
            className="my-masonry-grid mb-4"
            columnClassName="my-masonry-grid_column"
          >
            {posts.pages.map(
              (resp) =>
                resp &&
                resp.post &&
                resp.post.map((p, i) => (
                  <div ref={lastElementRef} key={i}>
                    <img
                      className="border rounded hover:cursor-pointer w-full h-auto"
                      key={p.id}
                      src={p.preview_url}
                      onClick={() =>
                        navigate({
                          to: "/posts/$postId",
                          params: { postId: p.id.toString() },
                        })
                      }
                    />
                  </div>
                ))
            )}
          </Masonry>
          <div className="w-full flex justify-center p-2">
            {isFetching ? (
              <Spinner />
            ) : hasNextPage ? (
              <Button variant={"outline"} onClick={() => fetchNextPage()}>
                Load More
              </Button>
            ) : (
              <p>You've been reached the void</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
