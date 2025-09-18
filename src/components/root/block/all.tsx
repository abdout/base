import Card from "@/components/atom/card"
import { blocks } from "./config"
import { StarterKit, OnboardingIcon, NotificationIcon, MDXIcon, ShieldIcon, StripeIcon } from "@/components/atom/icons"

const iconMap = {
  StarterKit,
  OnboardingIcon,
  NotificationIcon,
  MDXIcon,
  ShieldIcon,
  StripeIcon,
}

export default function BlocksPage() {
  return (
    <div className="grid grid-cols-1 gap-4 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {blocks.map((block) => {
        const IconComponent = iconMap[block.icon as keyof typeof iconMap]
        return (
          <Card
            key={block.id}
            id={block.id}
            title={block.title}
            description={block.description}
            icon={IconComponent ? <IconComponent className={block.iconFill ? "fill-current" : ""} /> : null}
            href={block.href}
          />
        )
      })}
    </div>
  )
}