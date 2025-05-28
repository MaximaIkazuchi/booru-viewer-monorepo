import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/shadcn-ui";
import {
  isMatch,
  Link,
  useMatches,
  useRouterState,
} from "@tanstack/react-router";
import React from "react";

export const AppBreadcrumb = ({
  ...props
}: React.ComponentProps<typeof Breadcrumb>) => {
  const matches = useMatches();
  const currentPathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  if (matches.some((match) => match.status === "pending")) return null;

  const matchesWithCrumbs = matches.filter((match) =>
    isMatch(match, "loaderData.crumb")
  );

  return (
    <Breadcrumb {...props}>
      <BreadcrumbList>
        {matchesWithCrumbs.map((match, i) => (
          <React.Fragment key={i}>
            <BreadcrumbItem>
              {match.pathname === currentPathname ? (
                <BreadcrumbPage>{match.loaderData?.crumb}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={match.fullPath}>{match.loaderData?.crumb}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {i + 1 < matchesWithCrumbs.length ? <BreadcrumbSeparator /> : null}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
