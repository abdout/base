import { type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { leadCreateSchema, leadUpdateSchema } from "./validation";

// Core Lead type matching Prisma schema
export type LeadDTO = {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  description: string | null;
  notes: string | null;

  // Extraction metadata
  rawInput: string | null;
  extractionMetadata: any | null;
  confidence: number | null;

  // Enrichment data
  enrichmentData: any | null;
  linkedinUrl: string | null;
  companySize: string | null;
  industry: string | null;

  // Status & tracking
  status: LeadStatus;
  score: number | null;
  tags: string[];
  source: LeadSource;
  priority: Priority;

  // Relationships
  userId: string;
  assignedTo: string | null;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastContactedAt: Date | null;
  nextFollowUp: Date | null;
}

// Table row type for display
export type LeadRow = {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  status: LeadStatus;
  score: number | null;
  source: LeadSource;
  priority: Priority;
  createdAt: string;
  confidence: number | null;
}

// Enums matching Prisma schema
export enum LeadStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  QUALIFIED = "QUALIFIED",
  PROPOSAL = "PROPOSAL",
  NEGOTIATION = "NEGOTIATION",
  CLOSED_WON = "CLOSED_WON",
  CLOSED_LOST = "CLOSED_LOST",
  ARCHIVED = "ARCHIVED"
}

export enum LeadSource {
  MANUAL = "MANUAL",
  IMPORT = "IMPORT",
  API = "API",
  WEBSITE = "WEBSITE",
  REFERRAL = "REFERRAL",
  SOCIAL_MEDIA = "SOCIAL_MEDIA",
  EMAIL_CAMPAIGN = "EMAIL_CAMPAIGN"
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT"
}

export enum InteractionType {
  EMAIL = "EMAIL",
  CALL = "CALL",
  MEETING = "MEETING",
  NOTE = "NOTE",
  STATUS_CHANGE = "STATUS_CHANGE"
}

// Form types
export interface LeadFormProps {
  form: UseFormReturn<z.infer<typeof leadCreateSchema>>;
  isView?: boolean;
  onSubmit?: (data: z.infer<typeof leadCreateSchema>) => void;
}

export interface LeadUpdateFormProps {
  form: UseFormReturn<z.infer<typeof leadUpdateSchema>>;
  isView?: boolean;
  onSubmit?: (data: z.infer<typeof leadUpdateSchema>) => void;
}

// Import/Export types
export interface ImportResult {
  index: number;
  success: boolean;
  leadId?: string;
  error?: string;
  duplicate?: boolean;
}

export interface BulkImportProgress {
  type: "progress" | "result" | "error" | "complete";
  current?: number;
  total?: number;
  result?: ImportResult;
  error?: string;
  results?: ImportResult[];
}

// Extraction types
export interface ExtractedFields {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  description?: string;
  notes?: string;
  confidence: number;
}

export interface ExtractionMetadata {
  extractedAt: Date;
  model: string;
  confidence: number;
  detectedPatterns: string[];
}

// Filter types
export interface LeadFilters {
  search?: string;
  status?: LeadStatus[];
  source?: LeadSource[];
  priority?: Priority[];
  dateFrom?: Date;
  dateTo?: Date;
  scoreMin?: number;
  scoreMax?: number;
  tags?: string[];
  assigned?: boolean;
}

// Statistics types
export interface LeadStatistics {
  total: number;
  byStatus: Record<LeadStatus, number>;
  bySource: Record<LeadSource, number>;
  byPriority: Record<Priority, number>;
  averageScore: number;
  recentActivity: number;
  conversionRate: number;
}