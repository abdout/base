"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Users,
  Package,
  ShoppingCart,
  Settings,
  BarChart3,
  FileText,
  HelpCircle,
  ChevronDown,
  Search,
  LayoutDashboard,
  Layers,
  Flag,
  LifeBuoy,
  LogOut,
  User,
} from "lucide-react";
import type { getDictionary } from "@/components/local/dictionaries";
import type { Locale } from "@/components/local/config";

interface SidebarTemplateProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: Locale;
}

const mainNavigation = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "#",
  },
  {
    title: "Projects",
    icon: Layers,
    href: "#",
  },
  {
    title: "Tasks",
    icon: Flag,
    href: "#",
  },
];

const managementNavigation = [
  {
    title: "Users",
    icon: Users,
    href: "#",
  },
  {
    title: "Products",
    icon: Package,
    href: "#",
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    href: "#",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "#",
  },
  {
    title: "Reports",
    icon: FileText,
    href: "#",
  },
];

const supportNavigation = [
  {
    title: "Settings",
    icon: Settings,
    href: "#",
  },
  {
    title: "Help Center",
    icon: HelpCircle,
    href: "#",
  },
  {
    title: "Contact Support",
    icon: LifeBuoy,
    href: "#",
  },
];

export default function SidebarTemplate({ dictionary, lang }: SidebarTemplateProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                S
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Sidebar Pro</span>
                <span className="text-xs text-muted-foreground">v1.0.0</span>
              </div>
            </div>
            <Separator className="my-2" />
            <div className="px-2">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search..."
                  className="pl-8"
                />
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            {/* Main Navigation */}
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainNavigation.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Management Navigation */}
            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {managementNavigation.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Support Navigation */}
            <SidebarGroup>
              <SidebarGroupLabel>Support</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {supportNavigation.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="w-full">
                      <User className="h-4 w-4" />
                      <span>John Doe</span>
                      <ChevronDown className="ml-auto h-4 w-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    align="start"
                    className="w-56"
                  >
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        {/* Main Content Area */}
        <SidebarInset className="flex-1">
          <header className="sticky top-0 flex h-14 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Simple Sidebar Layout</h1>
            </div>
          </header>
          <main className="flex-1 p-6">
            <div className="mx-auto max-w-4xl space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Welcome to Sidebar Template</h2>
                <p className="text-muted-foreground">
                  This is a simple sidebar layout with navigation grouped by sections.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4 rounded-lg border p-6">
                  <h3 className="font-semibold">Features</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Grouped navigation sections</li>
                    <li>• Search functionality</li>
                    <li>• User account dropdown</li>
                    <li>• Collapsible sidebar rail</li>
                    <li>• Responsive design</li>
                  </ul>
                </div>

                <div className="space-y-4 rounded-lg border p-6">
                  <h3 className="font-semibold">Customization</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Easy to add new menu items</li>
                    <li>• Flexible group structure</li>
                    <li>• Theme-aware styling</li>
                    <li>• RTL support ready</li>
                    <li>• Accessible components</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border bg-muted p-6">
                <h3 className="mb-2 font-semibold">Getting Started</h3>
                <p className="text-sm text-muted-foreground">
                  This sidebar template provides a clean and organized navigation structure
                  for your application. The sidebar is collapsible and includes search
                  functionality, making it easy for users to find what they need quickly.
                </p>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}