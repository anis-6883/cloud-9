"use client";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import routes from "@/config/routes";
import { Utensils } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AppSidebarHeader({ teams }: any) {
  const [activeTeam] = useState(teams[0]);

  return (
    <SidebarMenu>
      <Link href={routes.privateRoutes.admin.dashboard}>
        <SidebarMenuItem>
          <SidebarMenuButton size='lg' className='cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'>
            <div className='bg-primary text-white flex aspect-square size-10 items-center justify-center rounded-full'>
              <Utensils size={20} />
            </div>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate text-[24px] font-bold'>{activeTeam.name}</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </Link>
    </SidebarMenu>
  );
}
