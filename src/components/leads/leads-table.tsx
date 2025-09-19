"use client";

import { useState, useMemo, useCallback } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "@/components/table/data-table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table/data-table-column-header";
import { DataTablePagination } from "@/components/table/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/table/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  Plus,
  Download,
  Upload,
  Filter,
  Search,
  Mail,
  Phone,
  Building,
  Calendar,
  User,
  Edit,
  Trash,
  Eye,
  Copy,
  Archive,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  source: "website" | "email" | "social" | "referral" | "import" | "other";
  score?: number;
  createdAt: Date;
  updatedAt: Date;
  lastContactedAt?: Date;
  assignedTo?: string;
  tags?: string[];
  notes?: string;
}

interface LeadsDataTableProps {
  data: Lead[];
  onEdit?: (lead: Lead) => void;
  onDelete?: (leadIds: string[]) => void;
  onView?: (lead: Lead) => void;
  onBulkAction?: (action: string, leadIds: string[]) => void;
  className?: string;
}

const statusConfig = {
  new: { label: "New", icon: Plus, color: "bg-blue-500" },
  contacted: { label: "Contacted", icon: Mail, color: "bg-yellow-500" },
  qualified: { label: "Qualified", icon: CheckCircle, color: "bg-green-500" },
  converted: { label: "Converted", icon: TrendingUp, color: "bg-purple-500" },
  lost: { label: "Lost", icon: XCircle, color: "bg-red-500" },
};

const sourceConfig = {
  website: { label: "Website", icon: Building },
  email: { label: "Email", icon: Mail },
  social: { label: "Social Media", icon: User },
  referral: { label: "Referral", icon: User },
  import: { label: "Import", icon: Upload },
  other: { label: "Other", icon: AlertCircle },
};

export function LeadsDataTable({
  data,
  onEdit,
  onDelete,
  onView,
  onBulkAction,
  className,
}: LeadsDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<Lead>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => {
          const lead = row.original;
          const initials = `${lead.firstName[0]}${lead.lastName[0]}`.toUpperCase();
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {lead.firstName} {lead.lastName}
                </div>
                {lead.jobTitle && (
                  <div className="text-xs text-muted-foreground">{lead.jobTitle}</div>
                )}
              </div>
            </div>
          );
        },
        filterFn: (row, id, value) => {
          const lead = row.original;
          const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase();
          return fullName.includes(value.toLowerCase());
        },
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <a
              href={`mailto:${row.getValue("email")}`}
              className="text-sm hover:underline"
            >
              {row.getValue("email")}
            </a>
          </div>
        ),
      },
      {
        accessorKey: "company",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Company" />
        ),
        cell: ({ row }) => {
          const company = row.getValue("company") as string;
          if (!company) return <span className="text-muted-foreground">—</span>;
          return (
            <div className="flex items-center gap-2">
              <Building className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm">{company}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const status = row.getValue("status") as keyof typeof statusConfig;
          const config = statusConfig[status];
          const Icon = config.icon;
          return (
            <Badge variant="outline" className="gap-1">
              <span className={cn("h-2 w-2 rounded-full", config.color)} />
              {config.label}
            </Badge>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "source",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Source" />
        ),
        cell: ({ row }) => {
          const source = row.getValue("source") as keyof typeof sourceConfig;
          const config = sourceConfig[source];
          const Icon = config.icon;
          return (
            <div className="flex items-center gap-2">
              <Icon className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm">{config.label}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "score",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Score" />
        ),
        cell: ({ row }) => {
          const score = row.getValue("score") as number;
          if (!score) return <span className="text-muted-foreground">—</span>;

          const getScoreColor = (score: number) => {
            if (score >= 80) return "text-green-600 dark:text-green-400";
            if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
            if (score >= 40) return "text-orange-600 dark:text-orange-400";
            return "text-red-600 dark:text-red-400";
          };

          return (
            <div className={cn("font-medium tabular-nums", getScoreColor(score))}>
              {score}
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created" />
        ),
        cell: ({ row }) => {
          const date = row.getValue("createdAt") as Date;
          return (
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm tabular-nums text-muted-foreground">
                {format(date, "MMM d, yyyy")}
              </span>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const lead = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onView?.(lead)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(lead)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Lead
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(lead.email);
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Email
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete?.([lead.id])}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [onEdit, onDelete, onView]
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
            onValueChange={(value) =>
              table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedCount > 0 && (
        <Card>
          <CardContent className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{selectedCount} selected</Badge>
              <span className="text-sm text-muted-foreground">
                Perform bulk actions on selected leads
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const ids = selectedRows.map((row) => row.original.id);
                  onBulkAction?.("update-status", ids);
                }}
              >
                Update Status
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const ids = selectedRows.map((row) => row.original.id);
                  onBulkAction?.("assign", ids);
                }}
              >
                Assign
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const ids = selectedRows.map((row) => row.original.id);
                  onBulkAction?.("export", ids);
                }}
              >
                Export
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  const ids = selectedRows.map((row) => row.original.id);
                  onDelete?.(ids);
                }}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      <DataTable table={table} />
    </div>
  );
}