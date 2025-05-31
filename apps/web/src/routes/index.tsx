import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSearchTags } from "../hooks/useSearchTags";
import { useState } from "react";
import { useDebounce } from "@repo/hooks";
import { SearchWithClear } from "../components/SearchWithClear";
import { useTagsControl } from "../hooks/useTagsControl";
import { Button } from "@repo/shadcn-ui";
import { useSettingsStore } from "../stores/settings.store";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate({ from: Route.fullPath });

  const { TagsControlComponent, add } = useTagsControl();

  // Settings
  const { source } = useSettingsStore();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { ResultComponent } = useSearchTags({
    source,
    queryKey: "tags-home-page",
    limit: 10,
    search: debouncedSearch,
    onAddTag: add,
  });

  return (
    <div className="flex flex-col gap-4 items-center w-full min-h-screen overflow-hidden p-6">
      <div className="flex flex-col justify-center items-center">
        <img className="size-4/6" src="/yabv.png" />
        <p className="font-bold">Yet Another Booru Viewer</p>
        <p className="text-sm italic underline">WIP</p>
      </div>
      <div className="w-full lg:w-2/5 flex justify-center items-center">
        <div className="flex flex-col gap-2">
          <TagsControlComponent className="flex gap-2" />
          <Button
            onClick={() => navigate({ to: "/posts" })}
            className="hover:cursor-pointer"
            variant={"outline"}
          >
            Go to posts
          </Button>
        </div>
      </div>
      <div className="relative w-full lg:w-2/5">
        <SearchWithClear
          placeholder="Search with tags..."
          search={search}
          setSearch={setSearch}
        />
        <ResultComponent className="mt-2 h-52" />
      </div>
    </div>
  );
}
