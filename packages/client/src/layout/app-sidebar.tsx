import React from 'react';
import { navGroups } from './navigation-items';
import { NavMain } from '@/layout/nav-main';
import { NavUser } from '@/layout/nav-user';
import MCESCLogo from '@/assets/mcesc_logo.png';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar-provider';

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) =>
  <Sidebar collapsible="icon" {...props}>
    <SidebarHeader>
      <img
        src={MCESCLogo}
        alt="MCESC logo"
        className="size-full transition-all"
      />
      <span className="sr-only">RSD</span>
    </SidebarHeader>
    <SidebarContent>
      <NavMain groups={navGroups} />
    </SidebarContent>
    <SidebarFooter>
      <NavUser />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>;
