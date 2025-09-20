export interface TemplateItem {
  id: string
  title: string
  description: string
  icon: string
  iconFill?: boolean
  href: string
}

export const templates: TemplateItem[] = [
  {
    id: "dashboard-01",
    title: "Dashboard Pro",
    description: "Full dashboard with sidebar, charts and data table.",
    icon: "OnboardingIcon",
    iconFill: true,
    href: "/templates/dashboard-01",
  },
  {
    id: "hero-01",
    title: "Hero Landing",
    description: "Clean hero section with large headline and CTAs.",
    icon: "StarterKit",
    iconFill: true,
    href: "/templates/hero-01",
  },
  {
    id: "sidebar-01",
    title: "Simple Sidebar",
    description: "Navigation sidebar with grouped sections.",
    icon: "MDXIcon",
    href: "/templates/sidebar-01",
  },
  {
    id: "sidebar-02",
    title: "Collapsible Sidebar",
    description: "Sidebar with collapsible navigation sections.",
    icon: "MDXIcon",
    href: "/templates/sidebar-02",
  },
  {
    id: "sidebar-03",
    title: "Sidebar with Submenus",
    description: "Hierarchical navigation with nested submenus.",
    icon: "MDXIcon",
    href: "/templates/sidebar-03",
  },
  {
    id: "login-01",
    title: "Simple Login",
    description: "Clean login form with social auth options.",
    icon: "ShieldIcon",
    iconFill: true,
    href: "/templates/login-01",
  },
  {
    id: "login-02",
    title: "Split Screen Login",
    description: "Two-column login page with cover image.",
    icon: "ShieldIcon",
    iconFill: true,
    href: "/templates/login-02",
  },
  {
    id: "login-03",
    title: "Minimal Login",
    description: "Login page with muted background design.",
    icon: "ShieldIcon",
    iconFill: true,
    href: "/templates/login-03",
  },
]