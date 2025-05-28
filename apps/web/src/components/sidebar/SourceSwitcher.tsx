import { useState } from "react";
import { Check, ChevronsUpDown, Server } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/shadcn-ui";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/shadcn-ui";

type Source = {
  name: string;
  url: string;
};

type SourceSwitcherProps = {
  sources: Source[];
};

export function SourceSwitcher({ sources }: SourceSwitcherProps) {
  const [selectedSource, setSelectedSource] = useState(0);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Server className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none max-w-full overflow-hidden">
                <span className="font-semibold">
                  {sources[selectedSource].name}
                </span>
                <span className="truncate">{sources[selectedSource].url}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {sources.map((source, i) => (
              <DropdownMenuItem key={i} onSelect={() => setSelectedSource(i)}>
                <div className="flex flex-col gap-2">{source.name}</div>
                {i === selectedSource && <Check className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
