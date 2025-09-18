"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "./constants"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/atom/icons"
import type { getDictionary } from "@/components/internationalization/dictionaries"

interface MainNavProps {
  dictionary?: Awaited<ReturnType<typeof getDictionary>>
}

export function MainNav({ dictionary }: MainNavProps) {
  const pathname = usePathname()

  return (
    <div className="me-4 hidden md:flex">
      <Link href="/" className="me-4 flex items-center gap-2 text-foreground lg:me-6">
        <div className="-mt-[2px]">
          <Icons.logo className="h-6 w-6" />
        </div>
        <h5 className="hidden lg:inline-block">
          {dictionary?.common?.brandName || siteConfig.name}
        </h5>
      </Link>
      <nav className="flex items-center gap-6 xl:gap-8">
        <Link
          href="/docs/installation"
          className={cn(
            pathname === "/docs/installation"
              ? "text-foreground"
              : ""
          )}
        >
          <h6>{dictionary?.navigation?.docs || "Docs"}</h6>
        </Link>
        <Link
          href="/docs/components"
          className={cn(
            pathname?.startsWith("/docs/components") &&
              !pathname?.startsWith("/docs/component/chart")
              ? "text-foreground"
              : ""
          )}
        >
          <h6>{dictionary?.navigation?.atoms || "Atoms"}</h6>
        </Link>
        <Link
          href="/templates"
          className={cn(
            pathname?.startsWith("/templates")
              ? "text-foreground"
              : ""
          )}
        >
          <h6>{dictionary?.navigation?.templates || "Templates"}</h6>
        </Link>
        <Link
          href="/blocks"
          className={cn(
            pathname?.startsWith("/docs/component/blocks") ||
              pathname?.startsWith("/blocks")
              ? "text-foreground"
              : ""
          )}
        >
          <h6>{dictionary?.navigation?.blocks || "Blocks"}</h6>
        </Link>
        <Link
          href="/micros"
          className={cn(
            pathname?.startsWith("/docs/component/micros") ||
              pathname?.startsWith("/micros")
              ? "text-foreground"
              : ""
          )}
        >
          <h6>{dictionary?.navigation?.micros || "Micros"}</h6>
        </Link>
        <Link
          href="/vibes"
          className={cn(
            pathname?.startsWith("/docs/component/vibes") ||
              pathname?.startsWith("/vibes")
              ? "text-foreground"
              : ""
          )}
        >
          <h6>{dictionary?.navigation?.vibes || "Vibes"}</h6>
        </Link>
        {/* <Link
          href="/charts"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/docs/component/chart") ||
              pathname?.startsWith("/charts")
              ? "text-foreground"
              : "text-foreground/80"
          )}
        >
          Charts
        </Link>
        <Link
          href="/themes"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/themes")
              ? "text-foreground"
              : "text-foreground/80"
          )}
        >
          Themes
        </Link>
        <Link
          href="/colors"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/colors")
              ? "text-foreground"
              : "text-foreground/80"
          )}
        >
          Colors
        </Link> */}
      </nav>
    </div>
  )
}
