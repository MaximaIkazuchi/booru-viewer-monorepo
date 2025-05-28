import { Separator, SidebarTrigger, ThemeToggle } from "@repo/shadcn-ui";
import React from "react";

export function Topbar({ children }: { children: React.ReactNode }) {
  return (
    <header className="flex h-16 shrink-0 justify-between items-center gap-2 border-b px-4">
      <div className="flex items-center">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {children}
      </div>
      <ThemeToggle />
    </header>
  );
}
