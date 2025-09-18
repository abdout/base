"use client"

import { TabsNav } from "@/components/atom/tabs"
import type { getDictionary } from "@/components/internationalization/dictionaries"

interface MicroTabsProps {
  dictionary?: Awaited<ReturnType<typeof getDictionary>>
}

export default function MicroTabs({ dictionary }: MicroTabsProps) {
  const examples = [
    {
      name: dictionary?.micro?.buttons || "Buttons",
      href: "/micros/buttons",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/buttons",
      hidden: false,
    },
    {
      name: dictionary?.micro?.inputs || "Inputs",
      href: "/micros/inputs",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/inputs",
      hidden: false,
    },
    {
      name: dictionary?.micro?.cards || "Cards",
      href: "/micros/cards",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/cards",
      hidden: false,
    },
    {
      name: dictionary?.micro?.badges || "Badges",
      href: "/micros/badges",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/badges",
      hidden: false,
    },
    {
      name: dictionary?.micro?.avatars || "Avatars",
      href: "/micros/avatars",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/avatars",
      hidden: false,
    },
    {
      name: dictionary?.micro?.icons || "Icons",
      href: "/micros/icons",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/icons",
      hidden: false,
    },
  ]

  const defaultTab = {
    name: dictionary?.micro?.components || "Micro Components",
    href: "/micros",
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