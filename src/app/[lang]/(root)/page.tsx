import RootContent from "@/components/root/content";
import { getDictionary } from "@/components/internationalization/dictionaries";
import { type Locale } from "@/components/internationalization/config";

export const metadata = {
  title: "Root",
}

interface RootPageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function Root({ params }: RootPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <RootContent dictionary={dictionary} params={{ lang }} />;
}