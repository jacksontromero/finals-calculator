"use client";
import { schoolClass, useDataStore } from "@/app/store";
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
import { useRouter } from "next/navigation";
import { StoreApi, UseBoundStore } from "zustand";

export function AppSidebar() {
  const classes = useDataStore((state) => state.classes);

  return (
    <Sidebar>
      {/* <SidebarHeader /> */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Classes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {[...classes.entries()].map(([id, store]) => (
                <ClassMenuItem key={id} id={id} store={store} />
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

function ClassMenuItem({
  id,
  store,
}: {
  id: string;
  store: UseBoundStore<StoreApi<schoolClass>>;
}) {
  const x = store();
  const router = useRouter();

  return (
    <SidebarMenuItem key={x.id}>
      <SidebarMenuButton onClick={() => router.push(`/class/${x.id}`)}>
        <div>
          {x.name} ({x.number})
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
