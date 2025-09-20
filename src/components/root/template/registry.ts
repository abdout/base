import { lazy } from "react";

export type TemplateKey =
  | "dashboard-01"
  | "sidebar-01"
  | "sidebar-02"
  | "sidebar-03"
  | "login-01"
  | "login-02"
  | "login-03"
  | "hero-01";

export interface TemplateConfig {
  name: string;
  description: string;
  category: "dashboard" | "sidebar" | "authentication" | "hero" | "landing";
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  dependencies?: string[];
  requiresAuth?: boolean;
  runtime?: "nodejs" | "edge";
}

// Template registry with lazy loading
const templateRegistry: Record<TemplateKey, TemplateConfig> = {
  "dashboard-01": {
    name: "Dashboard 01",
    description: "Full dashboard with sidebar, charts and data table",
    category: "dashboard",
    component: lazy(() => import("@/components/root/template/templates/dashboard-01")),
    requiresAuth: false,
    runtime: "nodejs", // Uses Prisma for data
    dependencies: ["@tanstack/react-table", "recharts"],
  },
  "sidebar-01": {
    name: "Sidebar 01",
    description: "Simple sidebar with navigation grouped by section",
    category: "sidebar",
    component: lazy(() => import("@/components/root/template/templates/sidebar-01")),
    requiresAuth: false,
    runtime: "edge",
  },
  "sidebar-02": {
    name: "Sidebar 02",
    description: "Sidebar with collapsible sections",
    category: "sidebar",
    component: lazy(() => import("@/components/root/template/templates/sidebar-02")),
    requiresAuth: false,
    runtime: "edge",
  },
  "sidebar-03": {
    name: "Sidebar 03",
    description: "Sidebar with submenus",
    category: "sidebar",
    component: lazy(() => import("@/components/root/template/templates/sidebar-03")),
    requiresAuth: false,
    runtime: "edge",
  },
  "login-01": {
    name: "Login 01",
    description: "Simple login form with email and password",
    category: "authentication",
    component: lazy(() => import("@/components/root/template/templates/login-01")),
    requiresAuth: false,
    runtime: "nodejs", // Uses NextAuth
  },
  "login-02": {
    name: "Login 02",
    description: "Two column login page with cover image",
    category: "authentication",
    component: lazy(() => import("@/components/root/template/templates/login-02")),
    requiresAuth: false,
    runtime: "nodejs",
  },
  "login-03": {
    name: "Login 03",
    description: "Login page with muted background",
    category: "authentication",
    component: lazy(() => import("@/components/root/template/templates/login-03")),
    requiresAuth: false,
    runtime: "nodejs",
  },
  "hero-01": {
    name: "Hero 01",
    description: "Clean hero section with large headline",
    category: "hero",
    component: lazy(() => import("@/components/root/template/templates/hero-01")),
    requiresAuth: false,
    runtime: "edge",
  },
};

export function getTemplateRegistry() {
  return templateRegistry;
}

export function getTemplatesByCategory(category: TemplateConfig["category"]) {
  return Object.entries(templateRegistry)
    .filter(([_, config]) => config.category === category)
    .map(([key, config]) => ({ key: key as TemplateKey, ...config }));
}

export function getTemplateConfig(key: TemplateKey): TemplateConfig | undefined {
  return templateRegistry[key];
}