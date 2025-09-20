"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { leadCreateSchema } from "@/components/leads/clients/validation";
import { Loader2 } from "lucide-react";

interface LeadFormFooterProps {
  isView: boolean;
  isSubmitting: boolean;
  isEdit: boolean;
  onCancel: () => void;
  form: UseFormReturn<z.infer<typeof leadCreateSchema>>;
  dictionary?: any;
}

// Fields to track for progress
const FORM_FIELDS = [
  'name', 'company', 'email', 'phone', 'website',
  'description', 'notes', 'status', 'source', 'priority', 'score'
];
const REQUIRED_FIELDS = ['name'];
const TOTAL_FIELDS = FORM_FIELDS.length;

export function LeadFormFooter({
  isView,
  isSubmitting,
  isEdit,
  onCancel,
  form,
  dictionary
}: LeadFormFooterProps) {
  // Watch all form fields for changes
  const values = form.watch();

  const getFilledFieldsCount = () => {
    const filledCount = FORM_FIELDS.filter(field => {
      const value = values[field as keyof typeof values];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== "" && value !== null;
    }).length;

    return filledCount;
  };

  const getRequiredFieldsStatus = () => {
    return REQUIRED_FIELDS.every(field => {
      const value = values[field as keyof typeof values];
      return value !== undefined && value !== "" && value !== null;
    });
  };

  const filledFields = getFilledFieldsCount();
  const progressPercentage = (filledFields / TOTAL_FIELDS) * 100;
  const hasRequiredFields = getRequiredFieldsStatus();

  return (
    <div className="border-t pt-4 space-y-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {dictionary?.leads?.form?.progress || "Form Progress"}
          </span>
          <span className="text-muted-foreground">
            {filledFields}/{TOTAL_FIELDS} fields completed
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
        {!hasRequiredFields && (
          <p className="text-xs text-amber-600">
            {dictionary?.leads?.form?.requiredFieldsMessage || "Please fill in all required fields (*)"}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-muted-foreground">
          {isView
            ? dictionary?.leads?.form?.viewingLead || "Viewing Lead"
            : isEdit
            ? dictionary?.leads?.form?.editingLead || "Editing Lead"
            : dictionary?.leads?.form?.creatingLead || "Creating Lead"}
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onCancel}
          >
            {isView
              ? dictionary?.common?.close || "Close"
              : dictionary?.common?.cancel || "Cancel"}
          </Button>

          {!isView && (
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !hasRequiredFields}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEdit
                    ? dictionary?.leads?.form?.updating || "Updating..."
                    : dictionary?.leads?.form?.creating || "Creating..."}
                </>
              ) : (
                <>
                  {isEdit
                    ? dictionary?.leads?.form?.updateLead || "Update Lead"
                    : dictionary?.leads?.form?.createLead || "Create Lead"}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}