import { z } from "zod";

// Base lead schema with all fields - flexible for imports
export const leadBaseSchema = z.object({
  name: z.string().max(100).optional().nullable(),
  company: z.string().max(100).optional().nullable(),
  email: z.string().email("Invalid email format").optional().nullable().or(z.literal("")),
  phone: z.string()
    .regex(/^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/, "Invalid phone format")
    .optional()
    .nullable()
    .or(z.literal("")),
  website: z.string().url("Invalid URL format").optional().nullable().or(z.literal("")),
  description: z.string().max(1000).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),

  status: z.enum([
    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "PROPOSAL",
    "NEGOTIATION",
    "CLOSED_WON",
    "CLOSED_LOST",
    "ARCHIVED"
  ]).default("NEW"),

  source: z.enum([
    "MANUAL",
    "IMPORT",
    "API",
    "WEBSITE",
    "REFERRAL",
    "SOCIAL_MEDIA",
    "EMAIL_CAMPAIGN"
  ]).default("MANUAL"),

  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),

  tags: z.array(z.string()).default([]),
  score: z.number().min(0).max(100).optional().nullable(),
  assignedTo: z.string().optional().nullable(),
  nextFollowUp: z.date().optional().nullable(),
});

// Create lead schema (for new leads)
export const leadCreateSchema = leadBaseSchema.extend({
  // Additional fields for creation
  rawInput: z.string().optional().nullable(),
  autoEnrich: z.boolean().default(false),
});

// Flexible import schema - requires at least one identifying field
export const leadImportSchema = leadBaseSchema.extend({
  rawInput: z.string().optional().nullable(),
  autoEnrich: z.boolean().default(false),
}).refine(
  (data) => {
    // At least one of these fields must be present and non-empty
    const hasName = data.name && data.name.trim().length > 0;
    const hasCompany = data.company && data.company.trim().length > 0;
    const hasEmail = data.email && data.email.trim().length > 0;
    const hasPhone = data.phone && data.phone.trim().length > 0;
    const hasDescription = data.description && data.description.trim().length > 0;

    return hasName || hasCompany || hasEmail || hasPhone || hasDescription;
  },
  {
    message: "At least one field (name, company, email, phone, or description) must be provided",
  }
);

// Update lead schema (for editing existing leads)
export const leadUpdateSchema = leadBaseSchema.extend({
  id: z.string().cuid(),
});

// Bulk import schema
export const bulkImportSchema = z.object({
  entries: z.array(z.string()).min(1, "At least one entry is required"),
  autoEnrich: z.boolean().default(false),
  skipDuplicates: z.boolean().default(true),
  defaultSource: z.enum([
    "MANUAL",
    "IMPORT",
    "API",
    "WEBSITE",
    "REFERRAL",
    "SOCIAL_MEDIA",
    "EMAIL_CAMPAIGN"
  ]).default("IMPORT"),
});

// Raw text extraction schema
export const extractionSchema = z.object({
  rawText: z.string().min(1, "Text is required for extraction"),
  autoCreate: z.boolean().default(false),
  enrichAfterExtraction: z.boolean().default(false),
});

// Interaction schema
export const interactionSchema = z.object({
  leadId: z.string().cuid(),
  type: z.enum(["EMAIL", "CALL", "MEETING", "NOTE", "STATUS_CHANGE"]),
  subject: z.string().max(200).optional().nullable(),
  content: z.string().min(1, "Content is required"),
});

// Search/filter schema
export const leadSearchSchema = z.object({
  search: z.string().optional(),
  status: z.array(z.enum([
    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "PROPOSAL",
    "NEGOTIATION",
    "CLOSED_WON",
    "CLOSED_LOST",
    "ARCHIVED"
  ])).optional(),
  source: z.array(z.enum([
    "MANUAL",
    "IMPORT",
    "API",
    "WEBSITE",
    "REFERRAL",
    "SOCIAL_MEDIA",
    "EMAIL_CAMPAIGN"
  ])).optional(),
  priority: z.array(z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"])).optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  scoreMin: z.number().min(0).max(100).optional(),
  scoreMax: z.number().min(0).max(100).optional(),
  tags: z.array(z.string()).optional(),
  assigned: z.boolean().optional(),
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Export request schema
export const exportSchema = z.object({
  format: z.enum(["csv", "json", "excel"]),
  fields: z.array(z.string()).optional(),
  filters: leadSearchSchema.optional(),
});

// Type exports
export type LeadCreateInput = z.infer<typeof leadCreateSchema>;
export type LeadImportInput = z.infer<typeof leadImportSchema>;
export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>;
export type BulkImportInput = z.infer<typeof bulkImportSchema>;
export type ExtractionInput = z.infer<typeof extractionSchema>;
export type InteractionInput = z.infer<typeof interactionSchema>;
export type LeadSearchInput = z.infer<typeof leadSearchSchema>;
export type ExportInput = z.infer<typeof exportSchema>;