'use client';

import * as React from 'react';
import Link from 'next/link';
import { IconInnerShadowTop } from '@tabler/icons-react';
import { Archive, Code2, FileText, Folder, HelpCircle, Home, Search, Settings } from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const data = {
  user: {
    name: 'Kwaneung Kim',
    email: 'kwaneung.kim@outlook.com',
    avatar: '/avatars/user.jpg',
  },
  navMain: [
    {
      title: 'Home',
      url: '/',
      icon: Home as any,
    },
    {
      title: 'Posts',
      url: '/posts',
      icon: FileText as any,
    },
    {
      title: 'Snippets',
      url: '/snippets',
      icon: Code2 as any,
    },
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: Folder as any,
    },
  ],
  navProjects: [
    {
      title: 'DevNest Blog',
      url: '/projects/devnest-blog',
      icon: Folder,
      items: [
        {
          title: 'Overview',
          url: '/projects/devnest-blog/overview',
        },
        {
          title: 'Features',
          url: '/projects/devnest-blog/features',
        },
        {
          title: 'Demo',
          url: '/projects/devnest-blog/demo',
        },
      ],
    },
    {
      title: 'E-Commerce Platform',
      url: '/projects/ecommerce',
      icon: Folder,
      items: [
        {
          title: 'Overview',
          url: '/projects/ecommerce/overview',
        },
        {
          title: 'Tech Stack',
          url: '/projects/ecommerce/tech-stack',
        },
        {
          title: 'Demo',
          url: '/projects/ecommerce/demo',
        },
      ],
    },
    {
      title: 'Task Manager',
      url: '/projects/task-manager',
      icon: Folder,
      items: [
        {
          title: 'Overview',
          url: '/projects/task-manager/overview',
        },
        {
          title: 'Architecture',
          url: '/projects/task-manager/architecture',
        },
        {
          title: 'Demo',
          url: '/projects/task-manager/demo',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Search',
      url: '/search',
      icon: Search as any,
    },
    {
      title: 'Archive',
      url: '/archive',
      icon: Archive as any,
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings as any,
    },
    {
      title: 'Help',
      url: '/help',
      icon: HelpCircle as any,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">DevNest</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects items={data.navProjects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
