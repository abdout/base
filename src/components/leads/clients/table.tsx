"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { CustomDataTable } from "./custom-data-table";
import { DataTableAdvancedToolbar } from "@/components/table/data-table/data-table-advanced-toolbar";
import { DataTableFilterbar } from "@/components/table/data-table/data-table-filterbar";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { leadColumns } from "./columns";
import { LeadForm } from "./form";
import { PasteImportInterface } from "../paste-import";
import { LeadRow } from "./types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadCreateSchema, leadImportSchema } from "./validation";
import { createLead, deleteLeads } from "./actions";
import { toast } from "sonner";
import { z } from "zod";
import {
  LEAD_STATUS_OPTIONS,
  LEAD_SOURCE_OPTIONS,
  PRIORITY_OPTIONS
} from "./constants";

interface LeadsTableProps {
  data: LeadRow[];
  pagination: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
  dictionary: any;
}

export function LeadsTable({ data, pagination, dictionary }: LeadsTableProps) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Get columns with dictionary
  const columns = useMemo(() => leadColumns(dictionary), [dictionary]);

  // Create table instance directly with useReactTable
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    pageCount: pagination.totalPages,
    manualPagination: true,
  });

  const form = useForm<z.infer<typeof leadCreateSchema>>({
    resolver: zodResolver(leadCreateSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      website: "",
      description: "",
      notes: "",
      status: "NEW",
      source: "MANUAL",
      priority: "MEDIUM",
      tags: [],
    },
  });

  const handleCreate = async (data: z.infer<typeof leadCreateSchema>) => {
    try {
      const result = await createLead(data);
      if (result.success) {
        toast.success(dictionary.leads.messages.leadCreated);
        setCreateOpen(false);
        form.reset();
        router.refresh();
      } else {
        toast.error(result.error || dictionary.leads.errors.createFailed);
      }
    } catch (error) {
      toast.error(dictionary.leads.errors.unexpected);
    }
  };

  const handleBulkDelete = async () => {
    const selectedRowIds = table.getFilteredSelectedRowModel().rows.map(row => row.id);
    if (selectedRowIds.length === 0) return;

    setIsDeleting(true);
    try {
      const result = await deleteLeads(selectedRowIds);
      if (result.success) {
        toast.success(result.message);
        table.resetRowSelection();
        router.refresh();
      } else {
        toast.error(result.error || dictionary.leads.errors.deleteFailed);
      }
    } catch (error) {
      toast.error(dictionary.leads.errors.unexpected);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImport = async (parsedData: any[]) => {
    console.log("Import started with data:", parsedData);

    try {
      // Process each parsed lead
      let successCount = 0;
      let failedCount = 0;

      for (const item of parsedData) {
        try {
          // Use extracted data if available, otherwise fall back to basic parsing
          let leadData;

          if (item.extractedData) {
            // Use the intelligent extraction data
            leadData = {
              name: item.extractedData.name || null,
              email: item.extractedData.email || null,
              phone: item.extractedData.phone || null,
              company: item.extractedData.company || null,
              website: item.extractedData.website || null,
              description: item.extractedData.description || null,
              notes: item.extractedData.notes || null,
              status: "NEW" as const,
              source: "IMPORT" as const,
              priority: "MEDIUM" as const,
              tags: ["imported"],
              rawInput: item.raw,
              autoEnrich: false
            };
          } else {
            // Fall back to basic field parsing for backwards compatibility
            leadData = {
              name: item.fields?.[0] || item.raw?.split(/[,\t|]/)[0]?.trim() || null,
              email: item.fields?.[1] || item.raw?.split(/[,\t|]/)[1]?.trim() || null,
              phone: item.fields?.[2] || item.raw?.split(/[,\t|]/)[2]?.trim() || null,
              company: item.fields?.[3] || item.raw?.split(/[,\t|]/)[3]?.trim() || null,
              status: "NEW" as const,
              source: "IMPORT" as const,
              priority: "MEDIUM" as const,
              description: `Imported from bulk data`,
              notes: `Raw: ${item.raw}`,
              tags: ["imported"],
              rawInput: item.raw,
              autoEnrich: false
            };
          }

          console.log("Creating lead:", leadData);

          // Validate with the flexible import schema
          const validationResult = leadImportSchema.safeParse(leadData);
          if (!validationResult.success) {
            console.warn("Validation failed for lead:", validationResult.error.issues);
            failedCount++;
            continue;
          }

          // Save to database
          const result = await createLead(validationResult.data);

          if (result.success) {
            successCount++;
            console.log("Lead created successfully:", result);
          } else {
            failedCount++;
            console.error("Failed to create lead:", result.error);
          }
        } catch (error) {
          failedCount++;
          console.error("Error processing lead:", error);
        }
      }

      // Show results
      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} lead(s)`);
        // Refresh the table to show new leads
        router.refresh();
      }

      if (failedCount > 0) {
        toast.warning(`Failed to import ${failedCount} lead(s)`);
      }

      setImportOpen(false);

    } catch (error) {
      console.error("Import error:", error);
      toast.error(dictionary.leads.errors.unexpected);
    }
  };

  const handleExport = () => {
    // Export functionality
    toast.info(dictionary.leads.messages.exportComingSoon);
  };

  // Filter definitions for the toolbar
  const filters = [
    {
      columnId: "status",
      title: dictionary.leads.filters.status,
      options: LEAD_STATUS_OPTIONS.map(opt => ({
        value: opt.value,
        label: opt.label,
      })),
    },
    {
      columnId: "source",
      title: dictionary.leads.filters.source,
      options: LEAD_SOURCE_OPTIONS.map(opt => ({
        value: opt.value,
        label: opt.label,
      })),
    },
    {
      columnId: "priority",
      title: dictionary.leads.filters.priority,
      options: PRIORITY_OPTIONS.map(opt => ({
        value: opt.value,
        label: opt.label,
      })),
    },
  ];

  return (
    <>
      <CustomDataTable table={table}>
        <DataTableAdvancedToolbar
          table={table}
          filters={filters}
        >
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setImportOpen(true)}
            >
              <Upload className="mr-2 h-4 w-4" />
              {dictionary.leads.actions.import}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="mr-2 h-4 w-4" />
              {dictionary.leads.actions.export}
            </Button>
            <Button
              size="sm"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              {dictionary.leads.actions.create}
            </Button>
          </div>
        </DataTableAdvancedToolbar>
        <DataTableFilterbar table={table} filters={filters} />
      </CustomDataTable>

      {/* Floating bar for bulk actions */}
      {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-lg border bg-background p-2 shadow-lg">
          <span className="text-sm text-muted-foreground px-2">
            {table.getFilteredSelectedRowModel().rows.length} {dictionary.leads.table.rowsSelected}
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            disabled={isDeleting}
          >
            {dictionary.leads.actions.deleteSelected}
          </Button>
        </div>
      )}

      {/* Create Lead Sheet */}
      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{dictionary.leads.form.createTitle}</SheetTitle>
            <SheetDescription>
              {dictionary.leads.form.createDescription}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <LeadForm
              form={form}
              onSubmit={handleCreate}
              mode="create"
              dictionary={dictionary}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Import Sheet */}
      <Sheet open={importOpen} onOpenChange={setImportOpen}>
        <SheetContent className="sm:max-w-4xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{dictionary.leads.import.title}</SheetTitle>
            <SheetDescription>
              {dictionary.leads.import.description}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <PasteImportInterface onImport={handleImport} dictionary={dictionary} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}