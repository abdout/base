import { Suspense } from "react";
import { listLeads } from "./actions";
import { LeadsTable } from "./table";
import { leadsSearchParams } from "./list-params";
import { DataTableSkeleton } from "@/components/table/data-table/data-table-skeleton";
import { LeadRow } from "./types";

interface LeadsContentProps {
  searchParams?: any;
  defaultFilters?: {
    status?: string;
    source?: string;
    priority?: string;
  };
  dictionary: any;
}

export async function LeadsContent({
  searchParams,
  defaultFilters,
  dictionary
}: LeadsContentProps) {
  // Parse search params
  const parsedParams = leadsSearchParams.parse(searchParams);

  // Apply default filters if provided
  const params = {
    ...parsedParams,
    ...(defaultFilters?.status && { status: [defaultFilters.status] }),
    ...(defaultFilters?.source && { source: [defaultFilters.source] }),
    ...(defaultFilters?.priority && { priority: [defaultFilters.priority] }),
  };

  // Fetch leads from database
  const result = await listLeads(params);

  if (!result.success) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-semibold">{dictionary.leads.errors.loadingFailed}</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {result.error || dictionary.leads.errors.unexpected}
          </p>
        </div>
      </div>
    );
  }

  // Transform leads to table rows
  const rows: LeadRow[] = result.data.leads.map(lead => ({
    id: lead.id,
    name: lead.name,
    company: lead.company,
    email: lead.email,
    phone: lead.phone,
    status: lead.status,
    source: lead.source,
    priority: lead.priority,
    score: lead.score,
    createdAt: lead.createdAt.toISOString(),
    confidence: lead.confidence
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{dictionary.leads.title}</h2>
          <p className="text-muted-foreground">
            {dictionary.leads.description}
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {result.data.pagination.total} {dictionary.leads.table.totalLeads}
        </div>
      </div>

      <Suspense fallback={<DataTableSkeleton columnCount={10} />}>
        <LeadsTable
          data={rows}
          pagination={result.data.pagination}
          dictionary={dictionary}
        />
      </Suspense>
    </div>
  );
}