"use client";
import { getSelectedClass, schoolClass, useDataStore } from "@/app/store";
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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import AddClass from "./AddClass";

export function AppSidebar() {
  const classes = useDataStore((state) => state.classes);
  let selectedClass: schoolClass | null = null;

  const selectedClassID = useDataStore((state) => state.selectedClassId);
  if (selectedClassID != null) {
    selectedClass = getSelectedClass().class;
  }

  return (
    <Sidebar>
      {/* <SidebarHeader /> */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Classes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {classes.map((x) => (
                <SidebarMenuItem key={x.id}>
                  <SidebarMenuButton asChild>
                    <a href={`/class/${x.id}`}>
                      {x.name} ({x.number})
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <AddClass />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
