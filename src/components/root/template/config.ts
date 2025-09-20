export interface TemplateItem {
  id: string
  title: string
  description: string
  icon: string
  iconFill?: boolean
  href: string
}

export const templates: TemplateItem[] = [
  {
    id: "hero-landing",
    title: "Hero Landing",
    description: "Modern hero sections with call-to-action elements.",
    icon: "StarterKit",
    iconFill: true,
    href: "https://template.databayt.org/hero-landing",
  },
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Complete dashboard layouts with sidebar navigation.",
    icon: "OnboardingIcon",
    iconFill: true,
    href: "https://template.databayt.org/dashboard",
  },
  {
    id: "ecommerce",
    title: "E-commerce",
    description: "Product listings, cart, and checkout flows.",
    icon: "NotificationIcon",
    href: "https://template.databayt.org/ecommerce",
  },
  {
    id: "blog",
    title: "Blog",
    description: "Article layouts with MDX content support.",
    icon: "MDXIcon",
    href: "https://template.databayt.org/blog",
  },
  {
    id: "portfolio",
    title: "Portfolio",
    description: "Personal portfolio and showcase layouts.",
    icon: "ShieldIcon",
    iconFill: true,
    href: "https://template.databayt.org/portfolio",
  },
  {
    id: "saas-landing",
    title: "SaaS Landing",
    description: "Software-as-a-Service marketing pages.",
    icon: "StripeIcon",
    iconFill: true,
    href: "https://template.databayt.org/saas-landing",
  },
]