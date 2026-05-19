"use client";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar";
import { isRouteActive } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface NavItem {
  title: string;
  url?: string;
  icon?: React.ElementType;
  items?: NavItem[];
}

export default function NavMenuItems({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const isNestedActive = (items?: NavItem[]): boolean => {
    if (!items) return false;
    return items.some(child => (child.url && isRouteActive(pathname, child.url)) || isNestedActive(child.items));
  };
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items?.map(item => {
          const hasChildren = item.items && item.items.length > 0;

          const isActive = item.url && isRouteActive(pathname, item.url);

          const isChildActive = hasChildren && item.items!.some(child => child.url && isRouteActive(pathname, child.url));
          const isParentActive = isActive || isChildActive;
          return (
            <SidebarMenuItem key={item.title}>
              {hasChildren ? (
                <Collapsible defaultOpen={isChildActive} className='group/collapsible'>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={`flex h-9 items-center gap-2 rounded-sm font-medium ${
                        isParentActive ? "text-primary hover:bg-primary! hover:text-white!" : "hover:bg-primary! hover:text-white!"
                      }`}
                    >
                      {item.icon && <item.icon className='size-5!' />}
                      <span className={`font-medium`}>{item.title}</span>
                      <ChevronRight className='ml-auto cursor-pointer transition-transform duration-200 group-hover/collapsible:text-white group-data-[state=open]/collapsible:rotate-90' />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map(sub => {
                        const hasSubChildren = sub?.items && sub?.items?.length > 0;
                        const subActive = sub.url && isRouteActive(pathname, sub.url);
                        const isSubChildActive = hasSubChildren && isNestedActive(sub.items);

                        if (hasSubChildren) {
                          return (
                            <SidebarMenuSubItem key={sub.title}>
                              <Collapsible defaultOpen={isSubChildActive} className='group/subcollapsible'>
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuSubButton className='hover:bg-primary! flex h-9 items-center justify-between hover:text-white!'>
                                    <span className='font-medium'>{sub.title}</span>
                                    <ChevronRight className='transition-transform duration-200 group-hover/subcollapsible:text-white group-data-[state=open]/subcollapsible:rotate-90' />
                                  </SidebarMenuSubButton>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                  <SidebarMenuSub className='ml-3'>
                                    {sub.items?.map(subChild => {
                                      const subChildActive = subChild.url && isRouteActive(pathname, subChild.url);

                                      if (subChild.items?.length) {
                                        return (
                                          <SidebarMenuSubItem key={subChild.title}>
                                            <Collapsible defaultOpen={isNestedActive(subChild.items)} className='group/deepcollapsible'>
                                              <CollapsibleTrigger asChild>
                                                <SidebarMenuSubButton className='hover:bg-primary! flex items-center justify-between p-3 hover:text-white!'>
                                                  <span className='font-medium'>{subChild.title}</span>
                                                  <ChevronRight className='transition-transform duration-200 group-hover/deepcollapsible:text-white group-data-[state=open]/deepcollapsible:rotate-90' />
                                                </SidebarMenuSubButton>
                                              </CollapsibleTrigger>
                                              <CollapsibleContent>
                                                <SidebarMenuSub className='ml-3'>
                                                  {subChild.items.map(deepChild => (
                                                    <SidebarMenuSubItem key={deepChild.title}>
                                                      <SidebarMenuSubButton asChild>
                                                        <Link
                                                          href={deepChild.url!}
                                                          className={`h-9 rounded-sm font-medium ${
                                                            deepChild.url && isRouteActive(pathname, deepChild.url)
                                                              ? "bg-primary p-3 text-white"
                                                              : "hover:bg-primary! hover:text-white!"
                                                          }`}
                                                        >
                                                          <span className='font-medium'> {deepChild.title}</span>
                                                        </Link>
                                                      </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                  ))}
                                                </SidebarMenuSub>
                                              </CollapsibleContent>
                                            </Collapsible>
                                          </SidebarMenuSubItem>
                                        );
                                      }

                                      return (
                                        <SidebarMenuSubItem key={subChild.title}>
                                          <SidebarMenuSubButton asChild>
                                            <Link
                                              href={subChild.url!}
                                              className={`h-9 rounded-sm font-medium ${
                                                subChildActive ? "bg-primary p-3 text-white" : "hover:bg-primary! p-3 hover:text-white!"
                                              }`}
                                            >
                                              {subChild.title}
                                            </Link>
                                          </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                      );
                                    })}
                                  </SidebarMenuSub>
                                </CollapsibleContent>
                              </Collapsible>
                            </SidebarMenuSubItem>
                          );
                        }

                        return (
                          <SidebarMenuSubItem key={sub.title}>
                            <SidebarMenuSubButton asChild>
                              <Link
                                href={sub.url!}
                                className={`h-9 rounded-sm font-medium ${
                                  subActive ? "bg-primary px-2 text-white" : "hover:bg-primary! hover:text-white!"
                                }`}
                              >
                                {sub.title}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <SidebarMenuButton asChild tooltip={item.title} className='active:text-white'>
                  <Link
                    href={item.url!}
                    className={`font-jost flex h-9 items-center gap-2 rounded-sm font-medium ${
                      isActive ? "bg-primary hover:bg-primary! text-white hover:text-white!" : "hover:bg-primary! hover:text-white!"
                    }`}
                  >
                    {item.icon && <item.icon className='size-5!' />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
