import Card from "@/components/atom/card"
import { StarterKit, OnboardingIcon, NotificationIcon, ContentlayerIcon, ShieldIcon, StripeIcon } from "@/components/atom/icons"

const blocks = [
  {
    id: "starter",
    title: "Starter Kit",
    description: "Routing, Layouts, Loading UI and API routes.",
    icon: <StarterKit className="size-12 fill-current" />,
    href: "https://block.databayt.org/starter",
  },
  {
    id: "onboarding",
    title: "Onboarding",
    description: "Onboarding using Server Actions and Zod.",
    icon: <OnboardingIcon className="size-12 fill-current" />,
    href: "https://block.databayt.org/onboarding",
  },
  {
    id: "notification",
    title: "Notification",
    description: "Notifications using Pusher and web sockets.",
    icon: <NotificationIcon className="size-12" />,
    href: "https://block.databayt.org/notification",
  },
  {
    id: "contentlayer",
    title: "Contentlayer",
    description: "Content using Contentlayer and MDX.",
    icon: <ContentlayerIcon className="size-12" />,
    href: "https://block.databayt.org/contentlayer",
  },
  {
    id: "auth",
    title: "Authentication",
    description: "Authentication using Auth.js and middlewares.",
    icon: <ShieldIcon className="size-12 fill-current" />,
    href: "https://block.databayt.org/auth",
  },
  {
    id: "subscription",
    title: "Subscriptions",
    description: "Free and paid subscriptions using Stripe.",
    icon: <StripeIcon className="size-12 fill-current" />,
    href: "https://block.databayt.org/subscription",
  },
]

export default function BlocksPage() {
  return (
    <div className="container mx-auto grid grid-cols-1 gap-4 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {blocks.map((block) => (
        <Card
          key={block.id}
          id={block.id}
          title={block.title}
          description={block.description}
          icon={block.icon}
          href={block.href}
        />
      ))}
    </div>
  )
}