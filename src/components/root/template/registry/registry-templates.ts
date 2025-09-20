import { type Registry } from "registry/registry"

export const templates: Registry["items"] = [
  {
    name: "dashboard-01",
    type: "registry:template",
    description: "A dashboard with sidebar, charts and data table.",
    dependencies: [
      "@dnd-kit/core",
      "@dnd-kit/modifiers",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities",
      "@tanstack/react-table",
      "zod",
    ],
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "label",
      "chart",
      "card",
      "select",
      "tabs",
      "table",
      "toggle-group",
      "badge",
      "button",
      "checkbox",
      "dropdown-menu",
      "drawer",
      "input",
      "avatar",
      "sheet",
      "sonner",
    ],
    files: [
      {
        path: "templates/dashboard-01/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "templates/dashboard-01/data.json",
        type: "registry:file",
        target: "app/dashboard/data.json",
      },
      {
        path: "templates/dashboard-01/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "templates/dashboard-01/components/chart-area-interactive.tsx",
        type: "registry:component",
      },
      {
        path: "templates/dashboard-01/components/data-table.tsx",
        type: "registry:component",
      },
      {
        path: "templates/dashboard-01/components/nav-documents.tsx",
        type: "registry:component",
      },
      {
        path: "templates/dashboard-01/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "templates/dashboard-01/components/nav-secondary.tsx",
        type: "registry:component",
      },
      {
        path: "templates/dashboard-01/components/nav-user.tsx",
        type: "registry:component",
      },
      {
        path: "templates/dashboard-01/components/section-cards.tsx",
        type: "registry:component",
      },
      {
        path: "templates/dashboard-01/components/site-header.tsx",
        type: "registry:component",
      },
    ],
    categories: ["dashboard"],
  },
  {
    name: "sidebar-01",
    type: "registry:template",
    description: "A simple sidebar with navigation grouped by section.",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "label",
      "dropdown-menu",
    ],
    files: [
      {
        path: "templates/sidebar-01/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "templates/sidebar-01/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-01/components/search-form.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-01/components/version-switcher.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-02",
    description: "A sidebar with collapsible sections.",
    type: "registry:template",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "label",
      "dropdown-menu",
    ],
    files: [
      {
        path: "templates/sidebar-02/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "templates/sidebar-02/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-02/components/search-form.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-02/components/version-switcher.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-03",
    description: "A sidebar with submenus.",
    type: "registry:template",
    registryDependencies: ["sidebar", "breadcrumb"],
    files: [
      {
        path: "templates/sidebar-03/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "templates/sidebar-03/components/app-sidebar.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-04",
    description: "A floating sidebar with submenus.",
    type: "registry:template",
    registryDependencies: ["sidebar", "breadcrumb", "separator"],
    files: [
      {
        path: "templates/sidebar-04/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "templates/sidebar-04/components/app-sidebar.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-05",
    description: "A sidebar with collapsible submenus.",
    type: "registry:template",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "label",
      "collapsible",
    ],
    files: [
      {
        path: "templates/sidebar-05/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "templates/sidebar-05/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-05/components/search-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-06",
    description: "A sidebar with submenus as dropdowns.",
    type: "registry:template",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "card",
      "dropdown-menu",
    ],
    files: [
      {
        path: "templates/sidebar-06/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "templates/sidebar-06/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-06/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-06/components/sidebar-opt-in-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-07",
    type: "registry:template",
    description: "A sidebar that collapses to icons.",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "collapsible",
      "dropdown-menu",
      "avatar",
    ],
    files: [
      {
        path: "templates/sidebar-07/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "templates/sidebar-07/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-07/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-07/components/nav-projects.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-07/components/nav-user.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-07/components/team-switcher.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-08",
    description: "An inset sidebar with secondary navigation.",
    type: "registry:template",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "collapsible",
      "dropdown-menu",
      "avatar",
    ],
    files: [
      {
        path: "templates/sidebar-08/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "templates/sidebar-08/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-08/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-08/components/nav-projects.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-08/components/nav-secondary.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-08/components/nav-user.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-09",
    description: "Collapsible nested sidebars.",
    type: "registry:template",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "collapsible",
      "dropdown-menu",
      "avatar",
      "switch",
      "label",
    ],
    files: [
      {
        path: "templates/sidebar-09/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "templates/sidebar-09/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-09/components/nav-user.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-10",
    description: "A sidebar in a popover.",
    type: "registry:template",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "popover",
      "collapsible",
      "dropdown-menu",
    ],
    files: [
      {
        path: "templates/sidebar-10/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "templates/sidebar-10/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-10/components/nav-actions.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-10/components/nav-favorites.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-10/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-10/components/nav-secondary.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-10/components/nav-workspaces.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-10/components/team-switcher.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-11",
    description: "A sidebar with a collapsible file tree.",
    type: "registry:template",
    registryDependencies: ["sidebar", "breadcrumb", "separator", "collapsible"],
    files: [
      {
        path: "templates/sidebar-11/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "templates/sidebar-11/components/app-sidebar.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-12",
    description: "A sidebar with a calendar.",
    type: "registry:template",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "collapsible",
      "calendar",
      "dropdown-menu",
      "avatar",
    ],
    files: [
      {
        path: "templates/sidebar-12/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "templates/sidebar-12/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-12/components/calendars.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-12/components/date-picker.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-12/components/nav-user.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-13",
    description: "A sidebar in a dialog.",
    type: "registry:template",
    registryDependencies: ["sidebar", "breadcrumb", "button", "dialog"],
    files: [
      {
        path: "templates/sidebar-13/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "templates/sidebar-13/components/settings-dialog.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-14",
    description: "A sidebar on the right.",
    type: "registry:template",
    registryDependencies: ["sidebar", "breadcrumb"],
    files: [
      {
        path: "templates/sidebar-14/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "templates/sidebar-14/components/app-sidebar.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-15",
    description: "A left and right sidebar.",
    type: "registry:template",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "popover",
      "collapsible",
      "dropdown-menu",
      "calendar",
      "avatar",
    ],
    files: [
      {
        path: "templates/sidebar-15/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "templates/sidebar-15/components/calendars.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-15/components/date-picker.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-15/components/nav-favorites.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-15/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-15/components/nav-secondary.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-15/components/nav-user.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-15/components/nav-workspaces.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-15/components/sidebar-left.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-15/components/sidebar-right.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-15/components/team-switcher.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "sidebar-16",
    description: "A sidebar with a sticky site header.",
    type: "registry:template",
    registryDependencies: [
      "sidebar",
      "breadcrumb",
      "separator",
      "collapsible",
      "dropdown-menu",
      "avatar",
      "button",
      "label",
    ],
    files: [
      {
        path: "templates/sidebar-16/page.tsx",
        type: "registry:page",
        target: "app/dashboard/page.tsx",
      },
      {
        path: "templates/sidebar-16/components/app-sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-16/components/nav-main.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-16/components/nav-projects.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-16/components/nav-secondary.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-16/components/nav-user.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-16/components/search-form.tsx",
        type: "registry:component",
      },
      {
        path: "templates/sidebar-16/components/site-header.tsx",
        type: "registry:component",
      },
    ],
    categories: ["sidebar", "dashboard"],
  },
  {
    name: "login-01",
    description: "A simple login form.",
    type: "registry:template",
    registryDependencies: ["button", "card", "input", "label"],
    files: [
      {
        path: "templates/login-01/page.tsx",
        target: "app/login/page.tsx",
        type: "registry:page",
      },
      {
        path: "templates/login-01/components/login-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["authentication", "login"],
  },
  {
    name: "login-02",
    description: "A two column login page with a cover image.",
    type: "registry:template",
    registryDependencies: ["button", "card", "input", "label"],
    files: [
      {
        path: "templates/login-02/page.tsx",
        target: "app/login/page.tsx",
        type: "registry:page",
      },
      {
        path: "templates/login-02/components/login-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["authentication", "login"],
  },
  {
    name: "login-03",
    description: "A login page with a muted background color.",
    type: "registry:template",
    registryDependencies: ["button", "card", "input", "label"],
    files: [
      {
        path: "templates/login-03/page.tsx",
        target: "app/login/page.tsx",
        type: "registry:page",
      },
      {
        path: "templates/login-03/components/login-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["authentication", "login"],
  },
  {
    name: "login-04",
    description: "A login page with form and image.",
    type: "registry:template",
    registryDependencies: ["button", "card", "input", "label"],
    files: [
      {
        path: "templates/login-04/page.tsx",
        target: "app/login/page.tsx",
        type: "registry:page",
      },
      {
        path: "templates/login-04/components/login-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["authentication", "login"],
  },
  {
    name: "login-05",
    description: "A simple email-only login page.",
    type: "registry:template",
    registryDependencies: ["button", "card", "input", "label"],
    files: [
      {
        path: "templates/login-05/page.tsx",
        target: "app/login/page.tsx",
        type: "registry:page",
      },
      {
        path: "templates/login-05/components/login-form.tsx",
        type: "registry:component",
      },
    ],
    categories: ["authentication", "login"],
  },
  {
    name: "hero-01",
    description: "A clean hero section with a large headline.",
    type: "registry:template",
    registryDependencies: ["button"],
    files: [
      {
        path: "templates/hero-01/page.tsx",
        target: "app/hero/page.tsx",
        type: "registry:page",
      },
      {
        path: "templates/hero-01/components/hero.tsx",
        type: "registry:component",
        target: "app/hero/components/hero.tsx",
      },
      {
        path: "templates/hero-01/components/constant.ts",
        type: "registry:component",
        target: "app/hero/components/constant.ts",
      },
      {
        path: "templates/hero-01/components/type.ts",
        type: "registry:component",
        target: "app/hero/components/type.ts",
      },
    ],
    categories: ["hero"],
  },
]
