export const runtime = "nodejs";

import { Metadata } from "next";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDictionary } from "@/components/local/dictionaries";
import LeadsClient from "./leads-client";

export const metadata: Metadata = {
  title: "Leads Management",
  description: "Manage your leads and track interactions",
};

export default async function LeadsPage({
  params,
}: {
  params: { lang: string };
}) {
  const user = await currentUser();

  if (!user) {
    redirect(`/${params.lang}/login`);
  }

  const dictionary = await getDictionary(params.lang);

  return <LeadsClient lang={params.lang} dictionary={dictionary} />;
}