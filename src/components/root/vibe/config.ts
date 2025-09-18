export interface VibeItem {
  id: string
  title: string
  description: string
  icon: string
  iconFill?: boolean
  href: string
}

export const vibes: VibeItem[] = [
  {
    id: "rules",
    title: "Rules",
    description: "AI coding rules and patterns for quick wins.",
    icon: "RulesIcon",
    iconFill: true,
    href: "https://block.databayt.org/rules",
  },
  {
    id: "prompts",
    title: "Prompts",
    description: "Ready-to-use prompts for AI pair programming.",
    icon: "PromptsIcon",
    iconFill: true,
    href: "https://block.databayt.org/prompts",
  },
  {
    id: "tweets",
    title: "Tweets",
    description: "Latest vibe coding updates from Twitter.",
    icon: "TwitterIcon",
    href: "https://block.databayt.org/tweets",
  },
  {
    id: "mcp",
    title: "MCP",
    description: "Model Context Protocol for AI coding.",
    icon: "MCPVibeIcon",
    href: "https://block.databayt.org/mcp",
  },
  {
    id: "cursor",
    title: "Cursor",
    description: "AI pair programming with Cursor.",
    icon: "CursorVibeIcon",
    href: "https://block.databayt.org/cursor",
  },
  {
    id: "extensions",
    title: "Extensions",
    description: "VSCode extensions for vibe coding.",
    icon: "ExtensionsIcon",
    href: "https://block.databayt.org/extensions",
  },
]