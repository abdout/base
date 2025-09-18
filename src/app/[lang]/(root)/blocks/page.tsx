import BlockContent from "@/components/root/block/content";
import { getDictionary } from "@/components/internationalization/dictionaries";
import { type Locale } from "@/components/internationalization/config";

export const metadata = {
  title: "Block",
}

interface BlockPageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function Block({ params }: BlockPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <BlockContent dictionary={dictionary} params={{ lang }} />;
}