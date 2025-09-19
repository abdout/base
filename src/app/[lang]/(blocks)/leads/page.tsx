import { LeadsContent } from "@/components/leads/clients/content";
import { Shell } from "@/components/table/shell";
import { getDictionary } from "@/components/local/dictionaries";

export const runtime = "nodejs"; // Required for Prisma

interface LeadsPageProps {
  params: Promise<{
    lang: string;
  }>;
  searchParams: any;
}

export default async function LeadsPage({ params, searchParams }: LeadsPageProps) {
  const resolvedParams = await params;
  const dict = await getDictionary(resolvedParams.lang);

  return (
    <Shell>
      <LeadsContent
        searchParams={searchParams}
        dictionary={dict}
      />
    </Shell>
  );
}