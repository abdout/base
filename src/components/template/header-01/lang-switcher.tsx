"use client"

import * as React from "react"
import { Languages } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { i18n, localeConfig, type Locale } from "@/components/local/config"

export function LangSwitcher() {
  const pathname = usePathname()

  // Extract current locale from pathname
  const currentLocale = i18n.locales.find(locale =>
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  ) || i18n.defaultLocale

  // Toggle between locales (en <-> ar)
  const targetLocale: Locale = currentLocale === 'en' ? 'ar' : 'en'
  const targetConfig = localeConfig[targetLocale]

  // Function to get the new path with different locale
  const getLocalePath = () => {
    if (pathname.startsWith(`/${currentLocale}`)) {
      return pathname.replace(`/${currentLocale}`, `/${targetLocale}`)
    }
    return `/${targetLocale}${pathname}`
  }

  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="h-8 w-8 px-0"
      title={`Switch to ${targetConfig.nativeName}`}
    >
      <Link href={getLocalePath()}>
        <Languages className="h-4 w-4" />
        <span className="sr-only">Switch language to {targetConfig.nativeName}</span>
      </Link>
    </Button>
  )
}