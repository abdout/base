export interface SidebarNavItem {
  title: string
  disabled?: boolean
  external?: boolean
  href?: string
  items?: SidebarNavItem[]
}

export const docsConfig: { sidebarNav: SidebarNavItem[] } = {
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
        },
        {
          title: "Installation",
          href: "/docs/installation",
        },
        {
          title: "Typography",
          href: "/docs/typography",
        },
      ],
    },
    {
      title: "Components",
      items: [
        {
          title: "Accordion",
          href: "/docs/components/accordion",
        },
        {
          title: "Alert",
          href: "/docs/components/alert",
        },
        {
          title: "Button",
          href: "/docs/components/button",
        },
        {
          title: "Card",
          href: "/docs/components/card",
        },
        {
          title: "Dialog",
          href: "/docs/components/dialog",
        },
        {
          title: "Input",
          href: "/docs/components/input",
        },
        {
          title: "Table",
          href: "/table",
        },
      ],
    },
    {
      title: "Architecture",
      items: [
        {
          title: "Overview",
          href: "/docs/architecture",
        },
        {
          title: "Project Structure",
          href: "/docs/structure",
        },
        {
          title: "Technology Stack",
          href: "/docs/stack",
        },
        {
          title: "Patterns",
          href: "/docs/pattern",
        },
      ],
    },
    {
      title: "Features",
      items: [
        {
          title: "Authentication",
          href: "/docs/authantication",
        },
        {
          title: "Internationalization",
          href: "/docs/internationalization",
        },
        {
          title: "Timetable",
          href: "/docs/timetable",
        },
      ],
    },
    {
      title: "Development",
      items: [
        {
          title: "Contributing",
          href: "/docs/contribute",
        },
        {
          title: "Code of Conduct",
          href: "/docs/code-of-conduct",
        },
        {
          title: "Roadmap",
          href: "/docs/roadmap",
        },
        {
          title: "Issues",
          href: "/docs/issues",
        },
      ],
    },
    {
      title: "Tools",
      items: [
        {
          title: "ESLint",
          href: "/docs/eslint",
        },
        {
          title: "Prettier",
          href: "/docs/prettier",
        },
      ],
    },
  ],
}