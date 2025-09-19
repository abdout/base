import { LeadStatus, LeadSource, Priority } from "./types";

// Status options for filters and forms
export const LEAD_STATUS_OPTIONS = [
  { value: LeadStatus.NEW, label: "New", color: "blue" },
  { value: LeadStatus.CONTACTED, label: "Contacted", color: "yellow" },
  { value: LeadStatus.QUALIFIED, label: "Qualified", color: "green" },
  { value: LeadStatus.PROPOSAL, label: "Proposal", color: "purple" },
  { value: LeadStatus.NEGOTIATION, label: "Negotiation", color: "orange" },
  { value: LeadStatus.CLOSED_WON, label: "Won", color: "emerald" },
  { value: LeadStatus.CLOSED_LOST, label: "Lost", color: "red" },
  { value: LeadStatus.ARCHIVED, label: "Archived", color: "gray" }
];

// Source options for filters and forms
export const LEAD_SOURCE_OPTIONS = [
  { value: LeadSource.MANUAL, label: "Manual Entry", icon: "✏️" },
  { value: LeadSource.IMPORT, label: "Imported", icon: "📥" },
  { value: LeadSource.API, label: "API", icon: "🔌" },
  { value: LeadSource.WEBSITE, label: "Website", icon: "🌐" },
  { value: LeadSource.REFERRAL, label: "Referral", icon: "🤝" },
  { value: LeadSource.SOCIAL_MEDIA, label: "Social Media", icon: "📱" },
  { value: LeadSource.EMAIL_CAMPAIGN, label: "Email Campaign", icon: "📧" }
];

// Priority options for filters and forms
export const PRIORITY_OPTIONS = [
  { value: Priority.LOW, label: "Low", color: "gray" },
  { value: Priority.MEDIUM, label: "Medium", color: "blue" },
  { value: Priority.HIGH, label: "High", color: "orange" },
  { value: Priority.URGENT, label: "Urgent", color: "red" }
];

// Score ranges for categorization
export const SCORE_RANGES = [
  { min: 0, max: 25, label: "Cold", color: "blue" },
  { min: 26, max: 50, label: "Warm", color: "yellow" },
  { min: 51, max: 75, label: "Hot", color: "orange" },
  { min: 76, max: 100, label: "Very Hot", color: "red" }
];

// Common tags for quick selection
export const COMMON_TAGS = [
  "Enterprise",
  "SMB",
  "Startup",
  "Government",
  "Education",
  "Healthcare",
  "Technology",
  "Finance",
  "Retail",
  "Manufacturing",
  "Decision Maker",
  "Technical Contact",
  "Budget Approved",
  "Demo Requested",
  "Trial User"
];

// Sample data for testing and demos
export const SAMPLE_LEAD_DATA = [
  `John Doe
  VP of Sales at Acme Corporation
  john.doe@acmecorp.com
  +1 (555) 123-4567
  https://www.acmecorp.com
  Interested in enterprise plan for 500+ users
  Met at TechConf 2024`,

  `Sarah Johnson from StartupXYZ (sarah@startupxyz.io)
  Looking for affordable solution for 10-person team
  Phone: 555-987-6543
  LinkedIn: linkedin.com/in/sarahjohnson
  Budget: $5,000/year`,

  `Contact: Mike Chen
  Company: Global Innovations Inc
  Email: m.chen@globalinnovations.com
  Role: CTO
  Needs: API integration, custom workflows
  Timeline: Q2 2024`
];

// AI extraction configuration
export const EXTRACTION_CONFIG = {
  models: {
    default: "claude-3-opus-20240229",
    fast: "claude-3-haiku-20240307",
    balanced: "claude-3-sonnet-20240229"
  },
  temperature: 0.3,
  maxTokens: 2000,
  confidenceThreshold: 0.7
};

// Table configuration
export const TABLE_CONFIG = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
  maxExportRows: 5000,
  searchDebounceMs: 300
};

// Form configuration
export const FORM_CONFIG = {
  maxNameLength: 100,
  maxDescriptionLength: 1000,
  maxNotesLength: 2000,
  maxTags: 10,
  phoneRegex: /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/
};

// Feature flags
export const FEATURES = {
  aiExtraction: true,
  bulkImport: true,
  dataEnrichment: false, // Requires API keys
  realTimeUpdates: false, // Requires Redis
  export: true,
  auditTrail: true,
  teamAssignment: true,
  leadScoring: true,
  duplicateDetection: true,
  emailVerification: false // Requires email service
};

// API endpoints (if using REST instead of server actions)
export const API_ENDPOINTS = {
  leads: "/api/leads",
  extract: "/api/leads/extract",
  bulkImport: "/api/leads/bulk-import",
  enrich: "/api/leads/enrich",
  export: "/api/leads/export",
  stats: "/api/leads/stats",
  stream: "/api/leads/stream"
};

// Error messages
export const ERROR_MESSAGES = {
  EXTRACTION_FAILED: "Failed to extract lead information. Please try again or enter manually.",
  DUPLICATE_DETECTED: "A lead with this email already exists.",
  ENRICHMENT_FAILED: "Failed to enrich lead data. The lead has been created without enrichment.",
  IMPORT_FAILED: "Failed to import some leads. Please check the format and try again.",
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  PERMISSION_DENIED: "You don't have permission to perform this action.",
  VALIDATION_ERROR: "Please check all required fields and try again."
};

// Success messages
export const SUCCESS_MESSAGES = {
  LEAD_CREATED: "Lead created successfully",
  LEAD_UPDATED: "Lead updated successfully",
  LEAD_DELETED: "Lead deleted successfully",
  IMPORT_COMPLETE: "Import completed successfully",
  EXPORT_COMPLETE: "Export completed successfully",
  ENRICHMENT_COMPLETE: "Lead enrichment completed"
};