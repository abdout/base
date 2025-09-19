"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash, Mail, Phone, Sparkles } from "lucide-react";
import { DataTableColumnHeader } from "@/components/table/data-table/data-table-column-header";
import { LeadRow, LeadStatus, LeadSource, Priority } from "./types";
import {
  LEAD_STATUS_OPTIONS,
  LEAD_SOURCE_OPTIONS,
  PRIORITY_OPTIONS,
  SCORE_RANGES
} from "./constants";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { LeadActions } from "./lead-actions";

export const leadColumns = (dictionary: any): ColumnDef<LeadRow>[] => [
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={dictionary.leads.columns.name} />
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const company = row.original.company;
      const confidence = row.original.confidence;

      return (
        <div className="flex items-center gap-2">
          <div>
            <div className="font-medium">{name}</div>
            {company && (
              <div className="text-xs text-muted-foreground">{company}</div>
            )}
          </div>
          {confidence !== null && confidence < 0.7 && (
            <Sparkles className="h-3 w-3 text-yellow-500" title={`AI Confidence: ${(confidence * 100).toFixed(0)}%`} />
          )}
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      variant: "text",
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={dictionary.leads.columns.email} />
    ),
    cell: ({ row }) => {
      const email = row.getValue("email") as string | null;
      if (!email) return <span className="text-muted-foreground">-</span>;

      return (
        <div className="flex items-center gap-1">
          <a
            href={`mailto:${email}`}
            className="text-sm hover:underline text-blue-600 dark:text-blue-400"
            onClick={(e) => e.stopPropagation()}
          >
            {email}
          </a>
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      variant: "text",
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={dictionary.leads.columns.phone} />
    ),
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string | null;
      if (!phone) return <span className="text-muted-foreground">-</span>;

      return (
        <div className="flex items-center gap-1">
          <a
            href={`tel:${phone}`}
            className="text-sm hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {phone}
          </a>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={dictionary.leads.columns.status} />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as LeadStatus;
      const statusOption = LEAD_STATUS_OPTIONS.find(opt => opt.value === status);

      if (!statusOption) return null;

      return (
        <Badge
          variant="outline"
          className={cn(
            "border",
            status === LeadStatus.NEW && "border-blue-500 text-blue-700",
            status === LeadStatus.CONTACTED && "border-yellow-500 text-yellow-700",
            status === LeadStatus.QUALIFIED && "border-green-500 text-green-700",
            status === LeadStatus.PROPOSAL && "border-purple-500 text-purple-700",
            status === LeadStatus.NEGOTIATION && "border-orange-500 text-orange-700",
            status === LeadStatus.CLOSED_WON && "border-emerald-500 text-emerald-700",
            status === LeadStatus.CLOSED_LOST && "border-red-500 text-red-700",
            status === LeadStatus.ARCHIVED && "border-gray-500 text-gray-700"
          )}
        >
          {statusOption.label}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      variant: "select",
      options: LEAD_STATUS_OPTIONS.map(opt => ({
        value: opt.value,
        label: opt.label,
      })),
    },
  },
  {
    accessorKey: "source",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={dictionary.leads.columns.source} />
    ),
    cell: ({ row }) => {
      const source = row.getValue("source") as LeadSource;
      const sourceOption = LEAD_SOURCE_OPTIONS.find(opt => opt.value === source);

      if (!sourceOption) return null;

      return (
        <div className="flex items-center gap-1">
          <span className="text-lg">{sourceOption.icon}</span>
          <span className="text-xs text-muted-foreground">{sourceOption.label}</span>
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      variant: "select",
      options: LEAD_SOURCE_OPTIONS.map(opt => ({
        value: opt.value,
        label: opt.label,
      })),
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={dictionary.leads.columns.priority} />
    ),
    cell: ({ row }) => {
      const priority = row.getValue("priority") as Priority;
      const priorityOption = PRIORITY_OPTIONS.find(opt => opt.value === priority);

      if (!priorityOption) return null;

      return (
        <Badge
          variant={
            priority === Priority.URGENT ? "destructive" :
            priority === Priority.HIGH ? "default" :
            priority === Priority.MEDIUM ? "secondary" :
            "outline"
          }
        >
          {priorityOption.label}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      variant: "select",
      options: PRIORITY_OPTIONS.map(opt => ({
        value: opt.value,
        label: opt.label,
      })),
    },
  },
  {
    accessorKey: "score",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={dictionary.leads.columns.score} />
    ),
    cell: ({ row }) => {
      const score = row.getValue("score") as number | null;
      if (score === null) return <span className="text-muted-foreground">-</span>;

      const range = SCORE_RANGES.find(r => score >= r.min && score <= r.max);

      return (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={cn(
                "h-2 rounded-full transition-all",
                range?.color === "blue" && "bg-blue-500",
                range?.color === "yellow" && "bg-yellow-500",
                range?.color === "orange" && "bg-orange-500",
                range?.color === "red" && "bg-red-500"
              )}
              style={{ width: `${score}%` }}
            />
          </div>
          <span className="text-xs font-medium">{score}</span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={dictionary.leads.columns.created} />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return (
        <span className="text-sm text-muted-foreground">
          {format(new Date(date), "MMM dd, yyyy")}
        </span>
      );
    },
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const lead = row.original;
      return <LeadActions lead={lead} dictionary={dictionary} />;
    },
  },
];