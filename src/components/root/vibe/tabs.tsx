"use client"

import { TabsNav } from "@/components/atom/tabs"
import type { getDictionary } from "@/components/internationalization/dictionaries"

interface VibeTabsProps {
  dictionary?: Awaited<ReturnType<typeof getDictionary>>
}

export default function VibeTabs({ dictionary }: VibeTabsProps) {
  const examples = [
    {
      name: dictionary?.vibe?.animations || "Animations",
      href: "/vibes/animations",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/animations",
      hidden: false,
    },
    {
      name: dictionary?.vibe?.gradients || "Gradients",
      href: "/vibes/gradients",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/gradients",
      hidden: false,
    },
    {
      name: dictionary?.vibe?.patterns || "Patterns",
      href: "/vibes/patterns",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/patterns",
      hidden: false,
    },
    {
      name: dictionary?.vibe?.effects || "Effects",
      href: "/vibes/effects",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/effects",
      hidden: false,
    },
    {
      name: dictionary?.vibe?.themes || "Themes",
      href: "/vibes/themes",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/themes",
      hidden: false,
    },
    {
      name: dictionary?.vibe?.typography || "Typography",
      href: "/vibes/typography",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/typography",
      hidden: false,
    },
  ]

  const defaultTab = {
    name: dictionary?.vibe?.components || "Vibe Components",
    href: "/vibes",
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