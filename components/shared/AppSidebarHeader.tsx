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
          <SidebarMenuButton
            size='lg'
            className='cursor-pointer hover:bg-transparent hover:text-black hover:shadow-none active:bg-transparent active:text-black dark:hover:text-white'
          >
            <div className='bg-primary text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-full'>
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
