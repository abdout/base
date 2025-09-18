import VibeContent from "@/components/root/vibe/content";
import { getDictionary } from "@/components/internationalization/dictionaries";
import { type Locale } from "@/components/internationalization/config";

export const metadata = {
  title: "Vibe",
}

interface VibePageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function Vibe({ params }: VibePageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <VibeContent dictionary={dictionary} params={{ lang }} />;
}