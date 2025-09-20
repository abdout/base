import { Suspense } from "react";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { getDictionary } from "@/components/local/dictionaries";
import { type Locale } from "@/components/local/config";
import TemplatePreview from "@/components/root/template/preview";
import { getTemplateRegistry, type TemplateKey } from "@/components/root/template/registry";
import Loading from "./loading";

interface TemplatePageProps {
  params: Promise<{
    lang: Locale;
    template: string;
  }>;
}

// Generate static params for all templates
export async function generateStaticParams() {
  const registry = getTemplateRegistry();
  const templates = Object.keys(registry) as TemplateKey[];
  const locales: Locale[] = ["en", "ar"];

  return locales.flatMap(lang =>
    templates.map(template => ({
      lang,
      template,
    }))
  );
}

// Generate metadata for each template
export async function generateMetadata({ params }: TemplatePageProps): Promise<Metadata> {
  const { template, lang } = await params;
  const registry = getTemplateRegistry();
  const templateData = registry[template as TemplateKey];

  if (!templateData) {
    return {
      title: "Template Not Found",
    };
  }

  const dictionary = await getDictionary(lang);

  return {
    title: `${templateData.name} Template`,
    description: templateData.description,
    openGraph: {
      title: `${templateData.name} Template`,
      description: templateData.description,
      type: "website",
    },
  };
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { template, lang } = await params;
  const registry = getTemplateRegistry();
  const templateData = registry[template as TemplateKey];

  if (!templateData) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return (
    <Suspense fallback={<Loading />}>
      <TemplatePreview
        template={template as TemplateKey}
        dictionary={dictionary}
        lang={lang}
      />
    </Suspense>
  );
}