import { queryClient } from "@repo/api-client";
import { ThemeProvider } from "@repo/shadcn-ui";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Outlet />
      </ThemeProvider>
      <TanStackRouterDevtools position="bottom-right" />
    </QueryClientProvider>
  ),
  loader: () => ({
    crumb: "Home",
  }),
});
