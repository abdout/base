"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createLead, updateLead, getLead } from "@/components/leads/clients/actions";
import { leadCreateSchema, leadUpdateSchema } from "@/components/leads/clients/validation";
import { Form } from "@/components/ui/form";
import { useModal } from "@/components/atom/modal/context";
import { useRouter } from "next/navigation";
import { LeadFormContent } from "./lead-form-content";
import { LeadFormFooter } from "./lead-form-footer";

interface LeadModalFormProps {
  dictionary?: any;
}

export function LeadModalForm({ dictionary }: LeadModalFormProps) {
  const { modal, closeModal } = useModal();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isView = !!(modal.id && modal.id.startsWith("view:"));
  const currentId = modal.id ? (modal.id.startsWith("view:") ? modal.id.split(":")[1] : modal.id) : undefined;

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
      score: undefined,
    },
  });

  // Load existing lead data if editing
  useEffect(() => {
    const load = async () => {
      if (!currentId || currentId === "new") return;

      try {
        const res = await getLead(currentId);
        if (res.success && res.data) {
          const lead = res.data;
          form.reset({
            name: lead.name || "",
            company: lead.company || "",
            email: lead.email || "",
            phone: lead.phone || "",
            website: lead.website || "",
            description: lead.description || "",
            notes: lead.notes || "",
            status: lead.status || "NEW",
            source: lead.source || "MANUAL",
            priority: lead.priority || "MEDIUM",
            tags: lead.tags || [],
            score: lead.score || undefined,
          });
        }
      } catch (error) {
        toast.error(dictionary?.leads?.errors?.loadFailed || "Failed to load lead");
      }
    };

    void load();
  }, [currentId, form, dictionary]);

  async function onSubmit(values: z.infer<typeof leadCreateSchema>) {
    setIsSubmitting(true);

    try {
      const result = currentId && currentId !== "new"
        ? await updateLead({ id: currentId, ...values })
        : await createLead(values);

      if (result?.success) {
        toast.success(
          currentId && currentId !== "new"
            ? dictionary?.leads?.messages?.leadUpdated || "Lead updated successfully"
            : dictionary?.leads?.messages?.leadCreated || "Lead created successfully"
        );
        closeModal();
        router.refresh();
      } else {
        toast.error(
          result?.error ||
          (currentId && currentId !== "new"
            ? dictionary?.leads?.errors?.updateFailed || "Failed to update lead"
            : dictionary?.leads?.errors?.createFailed || "Failed to create lead")
        );
      }
    } catch (error) {
      toast.error(dictionary?.leads?.errors?.unexpected || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleCancel = () => {
    closeModal();
  };

  const getTitle = () => {
    if (isView) return dictionary?.leads?.form?.viewTitle || "View Lead";
    if (currentId && currentId !== "new") return dictionary?.leads?.form?.editTitle || "Edit Lead";
    return dictionary?.leads?.form?.createTitle || "Create Lead";
  };

  const getDescription = () => {
    if (isView) return dictionary?.leads?.form?.viewDescription || "View lead details";
    if (currentId && currentId !== "new") return dictionary?.leads?.form?.editDescription || "Update the lead information";
    return dictionary?.leads?.form?.createDescription || "Add a new lead to your pipeline";
  };

  return (
    <div className="flex h-full flex-col">
      <Form {...form}>
        <form className="flex flex-col h-full" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex-grow flex gap-6">
            {/* Title Section */}
            <div className="w-1/3">
              <h2 className="text-2xl font-semibold">{getTitle()}</h2>
              <p className="text-sm text-muted-foreground mt-2">{getDescription()}</p>
            </div>

            {/* Form Content */}
            <div className="flex-1">
              <div className="overflow-y-auto max-h-[500px] pr-2">
                <LeadFormContent
                  form={form}
                  isView={isView}
                  dictionary={dictionary}
                />
              </div>
            </div>
          </div>

          <LeadFormFooter
            isView={isView}
            isSubmitting={isSubmitting}
            isEdit={!!(currentId && currentId !== "new")}
            onCancel={handleCancel}
            form={form}
            dictionary={dictionary}
          />
        </form>
      </Form>
    </div>
  );
}

export default LeadModalForm;