import Card from "@/components/atom/card"
import { templates } from "./config"
import { StarterKit, OnboardingIcon, NotificationIcon, MDXIcon, ShieldIcon, StripeIcon } from "@/components/atom/icons"

const iconMap = {
  StarterKit,
  OnboardingIcon,
  NotificationIcon,
  MDXIcon,
  ShieldIcon,
  StripeIcon,
}

export default function TemplatesPage() {
  return (
    <div className="grid grid-cols-1 gap-4 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {templates.map((template) => {
        const IconComponent = iconMap[template.icon as keyof typeof iconMap]
        return (
          <Card
            key={template.id}
            id={template.id}
            title={template.title}
            description={template.description}
            icon={IconComponent ? <IconComponent className={template.iconFill ? "fill-current" : ""} /> : null}
            href={template.href}
          />
        )
      })}
    </div>
  )
}