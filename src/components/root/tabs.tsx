"use client"

import { TabsNav } from "@/components/atom/tabs"
import type { getDictionary } from "@/components/internationalization/dictionaries"

interface RootTabsProps {
  dictionary?: Awaited<ReturnType<typeof getDictionary>>
}

export default function RootTabs({ dictionary }: RootTabsProps) {
  const examples = [
    {
      name: dictionary?.examples?.mail || "Mail",
      href: "/examples/mail",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/mail",
      hidden: false,
    },
    {
      name: dictionary?.examples?.dashboard || "Dashboard",
      href: "/examples/dashboard",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/dashboard",
      hidden: false,
    },
    {
      name: dictionary?.examples?.tasks || "Tasks",
      href: "/examples/tasks",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/tasks",
      hidden: false,
    },
    {
      name: dictionary?.examples?.playground || "Playground",
      href: "/examples/playground",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/playground",
      hidden: false,
    },
    {
      name: dictionary?.examples?.forms || "Forms",
      href: "/examples/forms",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/forms",
      hidden: false,
    },
    {
      name: dictionary?.examples?.music || "Music",
      href: "/examples/music",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/music",
      hidden: false,
    },
    {
      name: dictionary?.examples?.authentication || "Authentication",
      href: "/examples/authentication",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/authentication",
      hidden: false,
    },
  ]

  const defaultTab = {
    name: dictionary?.examples?.components || "Examples",
    href: "/",
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