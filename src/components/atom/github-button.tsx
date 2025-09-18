import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/atom/icons"

interface GitHubButtonProps {
  href: string
  children?: React.ReactNode
  className?: string
  variant?: "default" | "ghost" | "outline" | "secondary" | "destructive" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function GitHubButton({
  href,
  children,
  className,
  variant = "ghost",
  size = "icon"
}: GitHubButtonProps) {
  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={className}
    >
      <Link
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        <Icons.gitHub className="h-4 w-4" />
        {children && <span className="sr-only">{children}</span>}
      </Link>
    </Button>
  )
}