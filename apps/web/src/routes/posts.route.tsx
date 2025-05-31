import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SidebarProvider,
  Switch,
} from "@repo/shadcn-ui";
import {
  createFileRoute,
  Outlet,
  useMatches,
  useNavigate,
} from "@tanstack/react-router";
import { AppSidebar } from "../components/sidebar/Sidebar";
import { Topbar } from "../components/Topbar";
import { AppBreadcrumb } from "../components/Breadcrumb";
import { useTagsControl } from "../hooks/useTagsControl";
import { Settings } from "lucide-react";
import { TruncatingTooltip } from "../components/TruncatingTooltip";
import { Spinner } from "../components/Spinner";
import { useSettingsStore } from "../stores/settings.store";
import { useSearchTags } from "../hooks/useSearchTags";
import { useState } from "react";
import { useDebounce } from "@repo/hooks";
import { SearchWithClear } from "../components/SearchWithClear";

export const Route = createFileRoute("/posts")({
  component: PostsLayout,
  loader: () => ({
    crumb: "Posts",
  }),
});

function PostsLayout() {
  const navigate = useNavigate({ from: Route.fullPath });
  const matches = useMatches();

  // Activated tags
  const { TagsControlComponent, add: addActivatedTags } = useTagsControl();

  // Sidebar search tags
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // Settings
  const {
    r18,
    source,
    toggle: toggleSettings,
    set: setSettings,
  } = useSettingsStore();

  const {
    data: tagsResponse,
    isFetching,
    error,
  } = useSearchTags({
    source,
    queryKey: "tags-post-page",
    limit: 25,
    search: debouncedSearch,
  });

  return (
    <SidebarProvider>
      <AppSidebar
        sidebarData={{
          header: (
            <>
              <img
                onClick={() => navigate({ to: "/" })}
                className="mx-auto p-2 cursor-pointer"
                src="/yabv.png"
              />
              <SearchWithClear
                placeholder="Search with tags..."
                search={search}
                setSearch={setSearch}
              />
              <TagsControlComponent className="flex lg:hidden gap-2" />
            </>
          ),
          groups: [
            {
              title:
                debouncedSearch.length > 0 ? "Search Result" : "Popular Tags",
              items: isFetching ? (
                <div className="w-full flex p-4">
                  <Spinner className="mx-auto" />
                </div>
              ) : error ? (
                <div className="p-4 bg-red-100 text-red-700 rounded mx-auto">
                  Error loading tags: {error.message}
                </div>
              ) : tagsResponse && tagsResponse.tags ? (
                tagsResponse.tags.map(
                  (t, i) =>
                    t.name && (
                      <div
                        key={i}
                        className="grid grid-cols-[1fr_auto] cursor-pointer"
                        onClick={() => addActivatedTags(t.name)}
                      >
                        <TruncatingTooltip text={t.name} />
                        <Badge variant={"outline"}>
                          {Math.abs(t.count) >= 1000
                            ? `${(t.count / 1000).toFixed(1)}k`
                            : t.count}
                        </Badge>
                      </div>
                    )
                )
              ) : (
                <p className="w-full text-center">Not Found</p>
              ),
              isActive: false,
            },
          ],
          footer: (
            <div className="flex items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={"ghost"}>
                    <Settings />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                      Make changes to your settings here.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="w-full flex flex-col gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="r18-toggle"
                        checked={r18}
                        onCheckedChange={() => toggleSettings("r18")}
                      />
                      <Label htmlFor="r18-toggle">Show R-18</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="source-toggle">Source Switch</Label>
                      <Select
                        value={source}
                        onValueChange={(value) => setSettings("source", value)}
                      >
                        <SelectTrigger id="source-toggle" className="w-fit">
                          <SelectValue placeholder="Source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="danbooru">Danbooru</SelectItem>
                          <SelectItem value="gelbooru">Gelbooru</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ),
        }}
      />
      <div className="flex flex-col w-full min-h-screen max-h-screen overflow-hidden">
        <Topbar>
          <div className="flex items-center gap-4">
            <TagsControlComponent className="hidden lg:flex gap-2 p-2" />
            <AppBreadcrumb />
          </div>
        </Topbar>
        <div className="flex-1 overflow-auto p-6 mx-auto w-full min-w-0">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
