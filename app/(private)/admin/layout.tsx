import AppSidebar from "@/components/shared/AppSidebar";
import Header from "@/components/shared/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { ReactNode } from "react";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className='h-screen overflow-auto'>
        <Header />
        <main className='flex-1 p-4'>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
