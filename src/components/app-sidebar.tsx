
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, User } from 'lucide-react';
import Image from 'next/image';

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
        <div className="flex items-center gap-3 p-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border shadow-sm">
            <Image
              src="/brandings/cleanfreaksco.png"
              alt="CleanFreaksCo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="text-lg font-semibold font-headline">Clean Freaks Co</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navLinks.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(link.href) && (link.href !== '/' || pathname === '/')}
                tooltip={link.label}
                className={cn(pathname.startsWith(link.href) && (link.href !== '/' || pathname === '/') && "bg-sidebar-accent text-sidebar-accent-foreground")}
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
         <AvatarFallback className="bg-purple-100 text-purple-800 font-semibold">
         D
         </AvatarFallback>
         </Avatar>
         <div className="flex flex-col overflow-hidden text-sm">
             <span className="font-semibold truncate">Dijana</span>
         <span className="text-muted-foreground truncate">dijana@cleanfreaks.co</span>
         </div>
         </div>
      </SidebarFooter>
    </Sidebar>
  );
}
