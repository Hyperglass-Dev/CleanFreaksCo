'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, User } from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { navLinks } from '@/lib/data';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-lg font-semibold font-headline">CleanIQ</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navLinks.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                tooltip={link.label}
                className={cn(pathname === link.href && "bg-sidebar-accent text-sidebar-accent-foreground")}
              >
                <Link href={link.href}>
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
         <div className="flex items-center gap-3 p-3 transition-colors rounded-md hover:bg-sidebar-accent">
            <Avatar className="w-9 h-9">
              <AvatarImage src="https://i.pravatar.cc/150?u=admin" alt="Admin" />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden text-sm">
                <span className="font-semibold truncate">Admin User</span>
                <span className="text-muted-foreground truncate">admin@cleaniq.co</span>
            </div>
         </div>
      </SidebarFooter>
    </Sidebar>
  );
}
