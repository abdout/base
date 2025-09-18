import Card from "@/components/atom/card"
import { RulesIcon, PromptsIcon, TwitterIcon, MCPVibeIcon, CursorVibeIcon, ExtensionsIcon } from "@/components/atom/icons"

const vibes = [
  {
    id: "rules",
    title: "Rules",
    description: "AI coding rules and patterns for quick wins.",
    icon: <RulesIcon className="size-12 fill-current" />,
    href: "https://block.databayt.org/rules",
  },
  {
    id: "prompts",
    title: "Prompts",
    description: "Ready-to-use prompts for AI pair programming.",
    icon: <PromptsIcon className="size-12 fill-current" />,
    href: "https://block.databayt.org/prompts",
  },
  {
    id: "tweets",
    title: "Tweets",
    description: "Latest vibe coding updates from Twitter.",
    icon: <TwitterIcon className="size-12" />,
    href: "https://block.databayt.org/tweets",
  },
  {
    id: "mcp",
    title: "MCP",
    description: "Model Context Protocol for AI coding.",
    icon: <MCPVibeIcon className="size-12" />,
    href: "https://block.databayt.org/mcp",
  },
  {
    id: "cursor",
    title: "Cursor",
    description: "AI pair programming with Cursor.",
    icon: <CursorVibeIcon className="size-12" />,
    href: "https://block.databayt.org/cursor",
  },
  {
    id: "extensions",
    title: "Extensions",
    description: "VSCode extensions for vibe coding.",
    icon: <ExtensionsIcon className="size-12" />,
    href: "https://block.databayt.org/extensions",
  },
]

export default function VibesPage() {
  return (
    <div className="container mx-auto grid grid-cols-1 gap-4 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {vibes.map((vibe) => (
        <Card
          key={vibe.id}
          id={vibe.id}
          title={vibe.title}
          description={vibe.description}
          icon={vibe.icon}
          href={vibe.href}
        />
      ))}
    </div>
  )
}