"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { FormSheetProvider } from "@/context/FormSheetContext";
import ThemeSwitch from "./ThemeSwitch";
import UserMenu from "./UserMenu";

export default function Header() {
  return (
    <div className='sticky top-0 z-50 border-b border-border bg-background text-foreground'>
      <header className='flex h-16 items-center justify-between px-6 shadow-sm'>
        <SidebarTrigger />
        <div className='flex items-center gap-2 md:gap-4'>
          <ThemeSwitch />
          <FormSheetProvider>
            <UserMenu />
          </FormSheetProvider>
        </div>
      </header>
    </div>
  );
}
