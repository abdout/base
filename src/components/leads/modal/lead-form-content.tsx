"use client";

import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { leadCreateSchema } from "@/components/leads/clients/validation";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import {
  LEAD_STATUS_OPTIONS,
  LEAD_SOURCE_OPTIONS,
  PRIORITY_OPTIONS,
} from "@/components/leads/clients/constants";

interface LeadFormContentProps {
  form: UseFormReturn<z.infer<typeof leadCreateSchema>>;
  isView: boolean;
  dictionary?: any;
}

export function LeadFormContent({ form, isView, dictionary }: LeadFormContentProps) {
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues("tags") || [];
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue("tags", [...currentTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-6">
      {/* Basic Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {dictionary?.leads?.form?.basicInfo || "Basic Information"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {dictionary?.leads?.form?.basicInfoDescription || "Core details about the lead"}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary?.leads?.form?.name || "Name"} *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isView}
                    placeholder={dictionary?.leads?.form?.namePlaceholder || "John Doe"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary?.leads?.form?.company || "Company"}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    disabled={isView}
                    placeholder={dictionary?.leads?.form?.companyPlaceholder || "Acme Corporation"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary?.leads?.form?.email || "Email"}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    disabled={isView}
                    type="email"
                    placeholder={dictionary?.leads?.form?.emailPlaceholder || "john@example.com"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary?.leads?.form?.phone || "Phone"}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    disabled={isView}
                    placeholder={dictionary?.leads?.form?.phonePlaceholder || "+1 (555) 123-4567"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>{dictionary?.leads?.form?.website || "Website"}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    disabled={isView}
                    type="url"
                    placeholder={dictionary?.leads?.form?.websitePlaceholder || "https://example.com"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Details & Notes Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {dictionary?.leads?.form?.details || "Details & Notes"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {dictionary?.leads?.form?.detailsDescription || "Additional information about the lead"}
        </p>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary?.leads?.form?.description || "Description"}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ""}
                  disabled={isView}
                  placeholder={dictionary?.leads?.form?.descriptionPlaceholder || "Brief description or role..."}
                  className="min-h-[80px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary?.leads?.form?.notes || "Notes"}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ""}
                  disabled={isView}
                  placeholder={dictionary?.leads?.form?.notesPlaceholder || "Additional notes or context..."}
                  className="min-h-[80px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Classification Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {dictionary?.leads?.form?.classification || "Classification"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {dictionary?.leads?.form?.classificationDescription || "Categorize and prioritize the lead"}
        </p>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary?.leads?.form?.status || "Status"}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isView}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={dictionary?.leads?.form?.selectStatus || "Select status"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LEAD_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary?.leads?.form?.source || "Source"}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isView}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={dictionary?.leads?.form?.selectSource || "Select source"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LEAD_SOURCE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary?.leads?.form?.priority || "Priority"}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isView}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={dictionary?.leads?.form?.selectPriority || "Select priority"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="score"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary?.leads?.form?.score || "Score"} (0-100)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 100)) {
                        field.onChange(value === "" ? undefined : Number(value));
                      }
                    }}
                    disabled={isView}
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0-100"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary?.leads?.form?.tags || "Tags"}</FormLabel>
                {!isView && (
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Add tag..."
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-2 border rounded hover:bg-accent"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      {!isView && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                  {(!field.value || field.value.length === 0) && (
                    <span className="text-sm text-muted-foreground">No tags</span>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}