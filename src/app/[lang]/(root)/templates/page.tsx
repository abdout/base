import TemplateContent from "@/components/root/template/content";
import { getDictionary } from "@/components/local/dictionaries";
import { type Locale } from "@/components/local/config";

export const metadata = {
  title: "Templates",
}

interface TemplatePageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function Templates({ params }: TemplatePageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <TemplateContent dictionary={dictionary} params={{ lang }} />;
}