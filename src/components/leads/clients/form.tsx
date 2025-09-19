"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Loader2, Sparkles, Building2, Mail, Phone, Globe, User, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { leadCreateSchema, leadUpdateSchema } from "./validation";
import {
  LEAD_STATUS_OPTIONS,
  LEAD_SOURCE_OPTIONS,
  PRIORITY_OPTIONS,
  COMMON_TAGS
} from "./constants";
import { LeadStatus, LeadSource, Priority } from "./types";

interface LeadFormProps {
  form: UseFormReturn<z.infer<typeof leadCreateSchema> | z.infer<typeof leadUpdateSchema>>;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
  isExtracting?: boolean;
  confidence?: number;
  mode?: "create" | "edit" | "view";
  dictionary: any;
}

export function LeadForm({
  form,
  onSubmit,
  isSubmitting = false,
  isExtracting = false,
  confidence,
  mode = "create",
  dictionary
}: LeadFormProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(form.getValues("tags") || []);
  const isView = mode === "view";

  const handleTagToggle = (tag: string) => {
    if (isView) return;

    setSelectedTags(prev => {
      const newTags = prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag];
      form.setValue("tags", newTags);
      return newTags;
    });
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Confidence Score (if available from AI extraction) */}
      {confidence !== undefined && (
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-base">{dictionary.leads.form.aiConfidence}</CardTitle>
              </div>
              <Badge variant={confidence > 0.8 ? "default" : confidence > 0.6 ? "secondary" : "outline"}>
                {(confidence * 100).toFixed(0)}%
              </Badge>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {dictionary.leads.form.basicInfo}
          </CardTitle>
          <CardDescription>
            {dictionary.leads.form.basicInfoDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">{dictionary.leads.form.name} *</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="John Doe"
              disabled={isView}
              className={cn(form.formState.errors.name && "border-red-500")}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">{dictionary.leads.form.company}</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="company"
                {...form.register("company")}
                placeholder="Acme Corporation"
                disabled={isView}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{dictionary.leads.form.email}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder="john@example.com"
                disabled={isView}
                className={cn(
                  "pl-10",
                  form.formState.errors.email && "border-red-500"
                )}
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{dictionary.leads.form.phone}</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                {...form.register("phone")}
                placeholder="+1 (555) 123-4567"
                disabled={isView}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="website">{dictionary.leads.form.website}</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="website"
                {...form.register("website")}
                placeholder="https://example.com"
                disabled={isView}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lead Details */}
      <Card>
        <CardHeader>
          <CardTitle>{dictionary.leads.form.details}</CardTitle>
          <CardDescription>
            {dictionary.leads.form.detailsDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">{dictionary.leads.form.description}</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Brief description or role..."
              disabled={isView}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{dictionary.leads.form.notes}</Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              placeholder="Additional notes or context..."
              disabled={isView}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Status & Classification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            {dictionary.leads.form.classification}
          </CardTitle>
          <CardDescription>
            {dictionary.leads.form.classificationDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="status">{dictionary.leads.form.status}</Label>
            <Select
              value={form.watch("status")}
              onValueChange={(value) => form.setValue("status", value as LeadStatus)}
              disabled={isView}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder={dictionary.leads.form.selectStatus} />
              </SelectTrigger>
              <SelectContent>
                {LEAD_STATUS_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        `bg-${option.color}-500`
                      )} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">{dictionary.leads.form.source}</Label>
            <Select
              value={form.watch("source")}
              onValueChange={(value) => form.setValue("source", value as LeadSource)}
              disabled={isView}
            >
              <SelectTrigger id="source">
                <SelectValue placeholder={dictionary.leads.form.selectSource} />
              </SelectTrigger>
              <SelectContent>
                {LEAD_SOURCE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <span>{option.icon}</span>
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">{dictionary.leads.form.priority}</Label>
            <Select
              value={form.watch("priority")}
              onValueChange={(value) => form.setValue("priority", value as Priority)}
              disabled={isView}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder={dictionary.leads.form.selectPriority} />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        `bg-${option.color}-500`
                      )} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-3">
            <Label>{dictionary.leads.form.tags}</Label>
            <div className="flex flex-wrap gap-2">
              {COMMON_TAGS.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-colors",
                    isView && "cursor-default"
                  )}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      {!isView && (
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isSubmitting || isExtracting}
          >
            {dictionary.leads.form.reset}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isExtracting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "create" ? dictionary.leads.form.creating : dictionary.leads.form.updating}
              </>
            ) : isExtracting ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                {dictionary.leads.form.extracting}
              </>
            ) : (
              mode === "create" ? dictionary.leads.form.createLead : dictionary.leads.form.updateLead
            )}
          </Button>
        </div>
      )}
    </form>
  );
}