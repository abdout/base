"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { MoreHorizontal, Eye, Edit, Trash, Mail, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LeadForm } from "./form";
import { LeadDetailSheet } from "../lead-detail-sheet";
import { leadUpdateSchema } from "./validation";
import { deleteLead, updateLead } from "./actions";
import { LeadRow } from "./types";

interface LeadActionsProps {
  lead: LeadRow;
  dictionary: any;
}

export function LeadActions({ lead, dictionary }: LeadActionsProps) {
  const router = useRouter();
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<z.infer<typeof leadUpdateSchema>>({
    resolver: zodResolver(leadUpdateSchema),
    defaultValues: {
      name: lead.name,
      company: lead.company || "",
      email: lead.email || "",
      phone: lead.phone || "",
      status: lead.status,
      source: lead.source,
      priority: lead.priority,
    },
  });

  const handleUpdate = async (data: z.infer<typeof leadUpdateSchema>) => {
    try {
      const result = await updateLead({ ...data, id: lead.id });
      if (result.success) {
        toast.success(dictionary.leads.messages.leadUpdated || "Lead updated successfully");
        setEditOpen(false);
        form.reset();
        router.refresh();
      } else {
        toast.error(result.error || dictionary.leads.errors.updateFailed || "Failed to update lead");
      }
    } catch (error) {
      toast.error(dictionary.leads.errors.unexpected || "An unexpected error occurred");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteLead(lead.id);
      if (result.success) {
        toast.success(dictionary.leads.messages.leadDeleted || "Lead deleted successfully");
        setDeleteOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || dictionary.leads.errors.deleteFailed || "Failed to delete lead");
      }
    } catch (error) {
      toast.error(dictionary.leads.errors.unexpected || "An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{dictionary.leads.actions.label}</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setViewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            {dictionary.leads.actions.view}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            {dictionary.leads.actions.edit}
          </DropdownMenuItem>
          {lead.email && (
            <DropdownMenuItem
              onClick={() => {
                window.location.href = `mailto:${lead.email}`;
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              {dictionary.leads.actions.email}
            </DropdownMenuItem>
          )}
          {lead.phone && (
            <DropdownMenuItem
              onClick={() => {
                window.location.href = `tel:${lead.phone}`;
              }}
            >
              <Phone className="mr-2 h-4 w-4" />
              {dictionary.leads.actions.call}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            {dictionary.leads.actions.delete}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Lead Sheet */}
      <LeadDetailSheet
        lead={lead}
        open={viewOpen}
        onOpenChange={setViewOpen}
        dictionary={dictionary}
      />

      {/* Edit Lead Sheet */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{dictionary.leads.form.editTitle || "Edit Lead"}</SheetTitle>
            <SheetDescription>
              {dictionary.leads.form.editDescription || "Update the lead details below"}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <LeadForm
              form={form}
              onSubmit={handleUpdate}
              mode="edit"
              dictionary={dictionary}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dictionary.leads.delete.title || "Are you absolutely sure?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dictionary.leads.delete.description ||
                `This action cannot be undone. This will permanently delete the lead "${lead.name}" from the database.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {dictionary.leads.delete.cancel || "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting
                ? (dictionary.leads.delete.deleting || "Deleting...")
                : (dictionary.leads.delete.confirm || "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}