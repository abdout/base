import Card from "@/components/atom/card"
import { vibes } from "./config"
import { RulesIcon, PromptsIcon, TwitterIcon, MCPVibeIcon, CursorVibeIcon, ExtensionsIcon } from "@/components/atom/icons"

const iconMap = {
  RulesIcon,
  PromptsIcon,
  TwitterIcon,
  MCPVibeIcon,
  CursorVibeIcon,
  ExtensionsIcon,
}

export default function VibesPage() {
  return (
    <div className="grid grid-cols-1 gap-4 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {vibes.map((vibe) => {
        const IconComponent = iconMap[vibe.icon as keyof typeof iconMap]
        return (
          <Card
            key={vibe.id}
            id={vibe.id}
            title={vibe.title}
            description={vibe.description}
            icon={IconComponent ? <IconComponent className={vibe.iconFill ? "fill-current" : ""} /> : null}
            href={vibe.href}
          />
        )
      })}
    </div>
  )
}