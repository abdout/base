import Link from "next/link"
import { ReactNode } from "react"

interface CardProps {
  id: string
  title: string
  description: string
  icon: ReactNode
  href: string
  className?: string
}

export default function Card({ id, title, description, icon, href, className = "" }: CardProps) {
  return (
    <Link
      key={id}
      href={href}
      className={`group relative overflow-hidden rounded-lg border bg-background p-2 transition-all hover:border-primary ${className}`}
    >
      <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
        {icon}
        <div className="space-y-2">
          <h5 className="transition-colors group-hover:text-primary">
            {title}
          </h5>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </Link>
  )
}