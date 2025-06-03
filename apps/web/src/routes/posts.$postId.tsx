import {
  getData,
  postsApi,
  PostsResponse,
  queryClient,
} from "@repo/api-client";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { Spinner } from "../components/Spinner";
import { useEffect, useMemo } from "react";
import { useSettingsStore } from "../stores/settings.store";
import { useTagsControl } from "../hooks/useTagsControl";
import { Badge } from "@repo/shadcn-ui";

export const Route = createFileRoute("/posts/$postId")({
  component: Post,
  loader: async ({ params }) => {
    const source = useSettingsStore.getState().source;
    const post = postsApi.getSinglePost(source, parseInt(params.postId));
    const postData = await getData(post);

    queryClient.setQueryData(["post", params.postId, source], postData);

    if (!postData || isAxiosError(postData)) return {};

    return {
      crumb: postData.posts[0].id,
    };
  },
  errorComponent: () => <p className="text-center mx-auto">Not Found</p>,
});

function Post() {
  const { postId } = Route.useParams();
  const id = parseInt(postId);

  // Settings
  const { source } = useSettingsStore();

  const { data: postResponse } = useQuery({
    queryKey: ["post", postId, source],
    queryFn: () => getData(postsApi.getSinglePost(source, id)),
    initialData: () => queryClient.getQueryData<PostsResponse>(["posts"]),
  });

  const imageID = postResponse?.posts.find((p) => p.id === id)?.id;
  const { data: postImage, isFetching } = useQuery({
    queryKey: ["post-image", imageID, source],
    queryFn: () => getData(postsApi.getImagePost(source, imageID)),
    initialData: () => queryClient.getQueryData<Blob>(["post-image"]),
    enabled: !!imageID,
  });

  const imageURL = useMemo(() => {
    return postImage ? URL.createObjectURL(postImage) : undefined;
  }, [postImage]);

  useEffect(() => {
    return () => {
      if (imageURL) URL.revokeObjectURL(imageURL);
    };
  }, [imageURL]);

  const { add } = useTagsControl();

  return (
    <div className="flex justify-center overflow-hidden min-h-0 max-h-full">
      {isFetching ? (
        <Spinner />
      ) : postResponse ? (
        <div className="flex-1 overflow-auto gap-6">
          {(() => {
            const p = postResponse.posts[0];
            return imageURL ? (
              <div className="flex flex-col gap-4">
                <img
                  className="mx-auto text-center cursor-pointer"
                  src={imageURL}
                  onClick={() => window.open(imageURL)}
                />
                <div className="grid gap-4">
                  {p.rating && (
                    <div className="flex flex-col items-start gap-1">
                      <h1 className="font-bold text-xl">Rating</h1>
                      <p className="capitalize">
                        {(() => {
                          switch (p.rating) {
                            case "g":
                              return "general";
                            case "s":
                              return "sensitive";
                            case "e":
                              return "explicit";
                            case "q":
                              return "questionable";
                            default:
                              return p.rating;
                          }
                        })()}
                      </p>
                    </div>
                  )}
                  {p.source && (
                    <div className="flex flex-col items-start gap-1">
                      <h1 className="font-bold text-xl">Source</h1>
                      <p
                        className="underline hover:cursor-pointer hover:text-blue-500 transition-colors"
                        onClick={() => window.open(p.source)}
                      >
                        {p.source}
                      </p>
                    </div>
                  )}
                  {p.md5 && (
                    <div className="flex flex-col items-start gap-1">
                      <h1 className="font-bold text-xl">MD5</h1>
                      <p>{p.md5}</p>
                    </div>
                  )}
                  {p.artist && (
                    <div className="flex flex-col items-start gap-1">
                      <h1 className="font-bold text-xl">Artist(s)</h1>
                      <div className="flex flex-wrap gap-1 md:w-4/6 w-1/2">
                        {p.artist.map((t) => (
                          <Badge
                            className="flex gap-2 hover:cursor-pointer hover:bg-gray-600 hover:dark:bg-gray-400 transition-colors"
                            onClick={() => add(t)}
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {p.tags && (
                    <div className="flex flex-col items-start gap-1">
                      <h1 className="font-bold text-xl">Tags</h1>
                      <div className="flex flex-wrap gap-1 w-5/6 lg:w-1/2">
                        {p.tags.map((t) => (
                          <Badge
                            className="flex gap-2 hover:cursor-pointer hover:bg-gray-600 hover:dark:bg-gray-400 transition-colors"
                            onClick={() => add(t)}
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center mx-auto">Image failed to load</p>
            );
          })()}
        </div>
      ) : (
        <p className="text-center mx-auto">Not Found</p>
      )}
    </div>
  );
}
