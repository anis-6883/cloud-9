"use client";

import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { adminDashboardMenu } from "@/config/nav-config";
import React from "react";
// import useUserProfile from "@/store/useUserProfile";
import { FileText, LayoutDashboard, Package, Settings, Users, Utensils } from "lucide-react";
import AppSidebarHeader from "./AppSidebarHeader";
import NavMenuItems from "./NavMenuItems";

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  //   const { userData } = useUserProfile();
  //   const permissions: string[] = (userData?.role as any)?.permissions ?? [];
  const navItems = [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard
    },

    {
      title: "Food Management",
      icon: Utensils,
      items: [
        {
          title: "Categories",
          url: "/admin/foods/categories"
        }
        // {
        //   title: "All Dishes",
        //   url: "/admin/foods/dishes"
        // },
        // {
        //   title: "Add New Dish",
        //   url: "/admin/foods/add"
        // }
      ]
    },

    {
      title: "Product",
      url: "/admin/product-management/brand",
      icon: Package
    },

    {
      title: "Customer",
      url: "/admin/user-management/customer",
      icon: Users
    },
    // },
    // {
    //   title: "Orders & Sales",
    //   icon: ShoppingBag,
    //   items: [
    //     {
    //       title: "Live Orders",
    //       url: "/admin/orders/live"
    //     },
    //     {
    //       title: "Order History",
    //       url: "/admin/orders/history",
    //       items: [
    //         {
    //           title: "Completed",
    //           url: "/admin/orders/history/completed"
    //         },
    //         {
    //           title: "Cancelled",
    //           url: "/admin/orders/history/cancelled"
    //         }
    //       ]
    //     }
    //   ]
    // },
    // {
    //   title: "User Management",
    //   icon: Users,
    //   items: [
    //     {
    //       title: "Customers",
    //       url: "/admin/users/customers"
    //     },
    //     {
    //       title: "Delivery Riders",
    //       url: "/admin/users/riders"
    //     }
    //   ]
    // },
    {
      title: "Reports",
      icon: FileText,
      url: "/admin/reports"
    },
    {
      title: "Settings",
      icon: Settings,
      url: "/admin/settings"
    }
  ];

  return (
    <Sidebar className='bg-sidebar text-sidebar-foreground border-sidebar-border' collapsible='icon' {...props}>
      <SidebarHeader>
        <AppSidebarHeader teams={adminDashboardMenu.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMenuItems items={navItems} />
      </SidebarContent>
    </Sidebar>
  );
}
