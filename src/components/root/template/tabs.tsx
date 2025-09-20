"use client"

import { TabsNav } from "@/components/atom/tabs"
import type { getDictionary } from "@/components/local/dictionaries"

interface TemplateTabsProps {
  dictionary?: Awaited<ReturnType<typeof getDictionary>>
}

export default function TemplateTabs({ dictionary }: TemplateTabsProps) {
  const examples = [
    {
      name: dictionary?.template?.hero || "Hero",
      href: "/templates/hero",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/hero-templates",
      hidden: false,
    },
    {
      name: dictionary?.template?.landing || "Landing",
      href: "/templates/landing",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/landing-templates",
      hidden: false,
    },
    {
      name: dictionary?.template?.dashboard || "Dashboard",
      href: "/templates/dashboard",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/dashboard-templates",
      hidden: false,
    },
    {
      name: dictionary?.template?.ecommerce || "E-commerce",
      href: "/templates/ecommerce",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/ecommerce-templates",
      hidden: false,
    },
    {
      name: dictionary?.template?.blog || "Blog",
      href: "/templates/blog",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/blog-templates",
      hidden: false,
    },
    {
      name: dictionary?.template?.portfolio || "Portfolio",
      href: "/templates/portfolio",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/portfolio-templates",
      hidden: false,
    },
  ]

  const defaultTab = {
    name: dictionary?.template?.components || "Template Components",
    href: "/templates",
    code: "",
    hidden: false,
  }

  return (
    <div className="py-3 border-b-[0.5px]">
      <div className="rtl:text-right">
        <TabsNav tabs={examples} defaultTab={defaultTab} />
      </div>
    </div>
  )
}