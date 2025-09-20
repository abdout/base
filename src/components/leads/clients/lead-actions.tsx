"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontal, Eye, Edit, Trash, Mail, Phone } from "lucide-react";
import { useModal } from "@/components/atom/modal/context";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LeadDetailSheet } from "../lead-detail-sheet";
import { deleteLead } from "./actions";
import { LeadRow } from "./types";

interface LeadActionsProps {
  lead: LeadRow;
  dictionary: any;
}

export function LeadActions({ lead, dictionary }: LeadActionsProps) {
  const router = useRouter();
  const { openModal } = useModal();
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    openModal(lead.id);
  };

  const handleView = () => {
    openModal(`view:${lead.id}`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteLead(lead.id);
      if (result.success) {
        toast.success(dictionary?.leads?.messages?.leadDeleted || "Lead deleted successfully");
        setDeleteOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || dictionary?.leads?.errors?.deleteFailed || "Failed to delete lead");
      }
    } catch (error) {
      toast.error(dictionary?.leads?.errors?.unexpected || "An unexpected error occurred");
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
          <DropdownMenuLabel>{dictionary?.leads?.actions?.label || "Actions"}</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleView}>
            <Eye className="mr-2 h-4 w-4" />
            {dictionary?.leads?.actions?.view || "View"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            {dictionary?.leads?.actions?.edit || "Edit"}
          </DropdownMenuItem>
          {lead.email && (
            <DropdownMenuItem
              onClick={() => {
                window.location.href = `mailto:${lead.email}`;
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              {dictionary?.leads?.actions?.email || "Email"}
            </DropdownMenuItem>
          )}
          {lead.phone && (
            <DropdownMenuItem
              onClick={() => {
                window.location.href = `tel:${lead.phone}`;
              }}
            >
              <Phone className="mr-2 h-4 w-4" />
              {dictionary?.leads?.actions?.call || "Call"}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            {dictionary?.leads?.actions?.delete || "Delete"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Lead Sheet (Legacy - for backwards compatibility) */}
      <LeadDetailSheet
        lead={lead}
        open={viewOpen}
        onOpenChange={setViewOpen}
        dictionary={dictionary}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dictionary?.leads?.delete?.title || "Are you absolutely sure?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dictionary?.leads?.delete?.description ||
                `This action cannot be undone. This will permanently delete the lead "${lead.name}" from the database.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {dictionary?.leads?.delete?.cancel || "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting
                ? (dictionary?.leads?.delete?.deleting || "Deleting...")
                : (dictionary?.leads?.delete?.confirm || "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}