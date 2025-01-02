'use client';
import { useDataStore } from '@/app/store';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import AddClass from './AddClass';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';
import ClassOptions from './ClassOptions';

export function AppSidebar() {
  const classIds = useDataStore(
    useShallow((state) => Object.keys(state.classes))
  );

  const classes = useDataStore.getState().classes;

  const router = useRouter();

  return (
    <Sidebar>
      {/* <SidebarHeader /> */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Classes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {classIds.length != 0 &&
                Object.entries(classes).map(([_id, x]) => (
                  <SidebarMenuItem key={x.id}>
                    <SidebarMenuButton
                      onClick={() => router.push(`/class/${x.id}`)}
                    >
                      <div>
                        {x.name} ({x.number})
                      </div>
                    </SidebarMenuButton>
                    <ClassOptions existingClassId={x.id} />
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
