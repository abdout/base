import Link from "next/link"

import { siteConfig } from "./constants"
import { CommandMenu } from "./command-menu"
import { Icons } from "@/components/atom/icons"
import { MainNav } from "./main-nav"
import { MobileNav } from "./mobile-nav"
import { ModeSwitcher } from "./mode-switcher"
import { LangSwitcher } from "./lang-switcher"
import { Button } from "@/components/ui/button"
import type { getDictionary } from "@/components/internationalization/dictionaries"

interface SiteHeaderProps {
    dictionary?: Awaited<ReturnType<typeof getDictionary>>
}

export function SiteHeader({ dictionary }: SiteHeaderProps) {
    return (
        <header className="border-grid sticky top-0 z-50 w-full border-b-[0.5px] bg-background">
            <div className="flex h-14 items-center gap-2 md:gap-4">
                    <MainNav dictionary={dictionary} />
                    <MobileNav dictionary={dictionary} />
                    <div className="ms-auto flex items-center gap-2 md:flex-1 md:justify-end">
                        <div className="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
                            <CommandMenu dictionary={dictionary} />
                        </div>
                        <nav className="flex items-center gap-0.5">
                            <Button
                                asChild
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 px-0"
                            >
                                <Link
                                    href={siteConfig.links.github}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <Icons.gitHub className="h-4 w-4" />
                                    <span className="sr-only">{dictionary?.header?.github || "GitHub"}</span>
                                </Link>
                            </Button>
                            <LangSwitcher />
                            <ModeSwitcher />
                        </nav>
                    </div>
            </div>
        </header>
    )
}
