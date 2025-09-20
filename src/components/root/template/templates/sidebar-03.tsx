"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Home,
  Users,
  Package,
  Settings,
  BarChart3,
  FileText,
  ChevronRight,
} from "lucide-react";
import type { getDictionary } from "@/components/local/dictionaries";
import type { Locale } from "@/components/local/config";

interface SidebarTemplateProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: Locale;
}

const navigationWithSubmenus = [
  {
    title: "Dashboard",
    icon: Home,
    href: "#",
    subItems: [
      { title: "Overview", href: "#" },
      { title: "Statistics", href: "#" },
      { title: "Activity", href: "#" },
    ],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "#",
    subItems: [
      { title: "Traffic", href: "#" },
      { title: "Revenue", href: "#" },
      { title: "Conversions", href: "#" },
      { title: "Performance", href: "#" },
    ],
  },
  {
    title: "Users",
    icon: Users,
    href: "#",
    subItems: [
      { title: "All Users", href: "#" },
      { title: "Roles", href: "#" },
      { title: "Permissions", href: "#" },
    ],
  },
  {
    title: "Products",
    icon: Package,
    href: "#",
    subItems: [
      { title: "All Products", href: "#" },
      { title: "Categories", href: "#" },
      { title: "Inventory", href: "#" },
    ],
  },
];

export default function SidebarTemplate({ dictionary, lang }: SidebarTemplateProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="px-4 py-2">
              <h2 className="text-lg font-semibold">Sidebar with Submenus</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationWithSubmenus.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto h-4 w-4" />
                      </SidebarMenuButton>
                      {item.subItems && (
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <a href={subItem.href}>
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>System</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>General</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Security</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Integrations</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <FileText className="h-4 w-4" />
                      <span>Documentation</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-14 items-center gap-4 border-b px-6">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Submenu Navigation Template</h1>
          </header>
          <main className="flex-1 p-6">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-4 text-2xl font-bold">Hierarchical Navigation</h2>
              <p className="text-muted-foreground">
                This template demonstrates a sidebar with nested submenus, perfect for
                applications with complex navigation structures.
              </p>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}