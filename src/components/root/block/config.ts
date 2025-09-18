export interface BlockItem {
  id: string
  title: string
  description: string
  icon: string
  iconFill?: boolean
  href: string
}

export const blocks: BlockItem[] = [
  {
    id: "starter",
    title: "Starter Kit",
    description: "Routing, Layouts, Loading UI and API routes.",
    icon: "StarterKit",
    iconFill: true,
    href: "https://block.databayt.org/starter",
  },
  {
    id: "onboarding",
    title: "Onboarding",
    description: "Onboarding using Server Actions and Zod.",
    icon: "OnboardingIcon",
    iconFill: true,
    href: "https://block.databayt.org/onboarding",
  },
  {
    id: "notification",
    title: "Notification",
    description: "Notifications using Pusher and web sockets.",
    icon: "NotificationIcon",
    href: "https://block.databayt.org/notification",
  },
  {
    id: "mdx",
    title: "Markdown-x",
    description: "Content using native Next.js MDX",
    icon: "MDXIcon",
    href: "https://block.databayt.org/mdx",
  },
  {
    id: "auth",
    title: "Authentication",
    description: "Authentication using Auth.js and middlewares.",
    icon: "ShieldIcon",
    iconFill: true,
    href: "https://block.databayt.org/auth",
  },
  {
    id: "subscription",
    title: "Subscriptions",
    description: "Free and paid subscriptions using Stripe.",
    icon: "StripeIcon",
    iconFill: true,
    href: "https://block.databayt.org/subscription",
  },
]