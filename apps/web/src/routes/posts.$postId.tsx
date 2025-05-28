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

export const Route = createFileRoute("/posts/$postId")({
  component: Post,
  loader: async ({ params }) => {
    const post = postsApi.getSinglePost(parseInt(params.postId));
    const postData = await getData(post);
    queryClient.setQueryData(["post", params.postId], postData);

    if (!postData || isAxiosError(postData)) return {};

    return {
      crumb: postData.post[0].title || postData.post[0].id,
    };
  },
  errorComponent: () => <p className="text-center mx-auto">Not Found</p>,
});

function Post() {
  const { postId } = Route.useParams();
  const id = parseInt(postId);

  const { data: post } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getData(postsApi.getSinglePost(id)),
    initialData: () => queryClient.getQueryData<PostsResponse>(["posts"]),
  });

  const imageID = post?.post.find((p) => p.id === id)?.id;
  const { data: postImage, isFetching } = useQuery({
    queryKey: ["post-image", imageID],
    queryFn: () => getData(postsApi.getImagePost(imageID)),
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

  return (
    <div className="flex justify-center overflow-hidden min-h-0 max-h-full">
      {isFetching ? (
        <Spinner />
      ) : post ? (
        <div className="flex-1 overflow-auto gap-6">
          {imageURL ? (
            <img
              className="mx-auto text-center cursor-pointer"
              src={imageURL}
              onClick={() => window.open(post.post[0].file_url)}
            />
          ) : (
            <p className="text-center mx-auto">Image failed to load</p>
          )}
        </div>
      ) : (
        <p className="text-center mx-auto">Not Found</p>
      )}
    </div>
  );
}
