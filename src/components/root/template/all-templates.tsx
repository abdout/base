"use client";

import { useParams } from "next/navigation";
import Card from "@/components/atom/card";
import { templates } from "./template-config";
import { StarterKit, OnboardingIcon, NotificationIcon, MDXIcon, ShieldIcon, StripeIcon } from "@/components/atom/icons";
import type { Locale } from "@/components/local/config";

const iconMap = {
  StarterKit,
  OnboardingIcon,
  NotificationIcon,
  MDXIcon,
  ShieldIcon,
  StripeIcon,
}

export default function AllTemplatesPage() {
  const params = useParams<{ lang: Locale }>();
  const lang = params?.lang || "en";

  return (
    <div className="grid grid-cols-1 gap-4 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {templates.map((template) => {
        const IconComponent = iconMap[template.icon as keyof typeof iconMap];
        // Prepend the language to the href
        const localizedHref = `/${lang}${template.href}`;

        return (
          <Card
            key={template.id}
            id={template.id}
            title={template.title}
            description={template.description}
            icon={IconComponent ? <IconComponent className={template.iconFill ? "fill-current" : ""} /> : null}
            href={localizedHref}
          />
        )
      })}
    </div>
  )
}