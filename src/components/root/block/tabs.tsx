"use client"

import { TabsNav } from "@/components/atom/tabs"
import type { getDictionary } from "@/components/local/dictionaries"

interface BlockTabsProps {
  dictionary?: Awaited<ReturnType<typeof getDictionary>>
}

export default function BlockTabs({ dictionary }: BlockTabsProps) {
  const examples = [
    {
      name: dictionary?.block?.hero || "Hero",
      href: "/blocks/hero",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/hero",
      hidden: false,
    },
    {
      name: dictionary?.block?.features || "Features",
      href: "/blocks/features",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/features",
      hidden: false,
    },
    {
      name: dictionary?.block?.testimonials || "Testimonials",
      href: "/blocks/testimonials",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/testimonials",
      hidden: false,
    },
    {
      name: dictionary?.block?.pricing || "Pricing",
      href: "/blocks/pricing",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/pricing",
      hidden: false,
    },
    {
      name: dictionary?.block?.contact || "Contact",
      href: "/blocks/contact",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/contact",
      hidden: false,
    },
    {
      name: dictionary?.block?.footer || "Footer",
      href: "/blocks/footer",
      code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/footer",
      hidden: false,
    },
  ]

  const defaultTab = {
    name: dictionary?.block?.components || "Block Components",
    href: "/blocks",
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