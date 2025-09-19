import MicroContent from "@/components/root/micro/content";
import { getDictionary } from "@/components/local/dictionaries";
import { type Locale } from "@/components/local/config";

export const metadata = {
  title: "Micro",
}

interface MicroPageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function Micro({ params }: MicroPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <MicroContent dictionary={dictionary} params={{ lang }} />;
}