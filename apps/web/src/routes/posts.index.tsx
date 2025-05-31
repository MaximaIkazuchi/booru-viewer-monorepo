import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getData, postsApi } from "@repo/api-client";
import { useTagsStore } from "../stores/tags.store";
import { useDebounce } from "@repo/hooks";
import { Spinner } from "../components/Spinner";
import { useSettingsStore } from "../stores/settings.store";
import { Button } from "@repo/shadcn-ui";
import Masonry from "react-masonry-css";

export const Route = createFileRoute("/posts/")({
  component: Posts,
});

function Posts() {
  const navigate = useNavigate({ from: Route.fullPath });

  // Use Activated Tags
  const { tags: activatedTags } = useTagsStore();

  // Use Activated Settings
  const { r18, source } = useSettingsStore();
  const tagsSettings = { r18: r18 ? "" : "rating:general" };

  // Combine Tags and Settings
  const debouncedAllTags = useDebounce(
    [...activatedTags, ...Object.values(tagsSettings)],
    300
  );

  // Infinite scroll related
  const sizeFetch = 50;
  const fetchPosts = async ({ pageParam }: { pageParam: number }) =>
    getData(
      postsApi.getAllPosts(source, {
        limit: sizeFetch,
        page: pageParam,
        tags: debouncedAllTags,
      })
    );

  const {
    data: postsResponse,
    hasNextPage,
    isFetching,
    status,
    error,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", debouncedAllTags, source],
    queryFn: fetchPosts,
    initialPageParam: 1,
    getNextPageParam: (lastFetch, allPages) => {
      if (lastFetch) {
        // If response has meta
        if (lastFetch.max_page) {
          const { current_page, max_page } = lastFetch;
          return current_page < max_page ? current_page + 1 : undefined;
        } else {
          if (!lastFetch.posts || lastFetch.posts.length === 0)
            return undefined;

          return allPages.length + 1;
        }
      } else {
        return undefined;
      }
    },
  });

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
            {postsResponse.pages.map(
              (resp) =>
                resp &&
                resp.posts &&
                resp.posts.map((p, i) => (
                  <div key={i}>
                    <img
                      {...(p.preview_url && { src: p.preview_url })}
                      className="border rounded hover:cursor-pointer w-full h-auto"
                      key={p.id}
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
