import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@repo/shadcn-ui";
import React from "react";

export type SidebarDataProps = {
  header?: React.ReactNode;
  groups: {
    title: string;
    items?: React.ReactNode | React.ReactNode[];
    isActive?: boolean;
  }[];
  footer?: React.ReactNode;
};

type SidebarProps = {
  sidebarData: SidebarDataProps;
} & React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ sidebarData, ...props }: SidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>{sidebarData.header}</SidebarHeader>
      <SidebarSeparator className="mx-auto" />
      <SidebarContent>
        {sidebarData.groups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items && Array.isArray(group.items) ? (
                  group.items.map((render, i) => (
                    <SidebarMenuItem key={i}>
                      <SidebarMenuButton asChild isActive={group.isActive}>
                        {render}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                ) : (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={group.isActive}>
                      {group.items}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
      <SidebarSeparator className="mx-auto" />
      <SidebarFooter>{sidebarData.footer}</SidebarFooter>
    </Sidebar>
  );
}
