import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  parseAsArrayOf
} from "nuqs/server";
import { LeadStatus, LeadSource, Priority } from "./types";

// Define the search params for leads list with nuqs
export const leadsSearchParams = createSearchParamsCache({
  // Pagination
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(20),

  // Search
  search: parseAsString.withDefault(""),

  // Filters
  status: parseAsArrayOf(
    parseAsStringEnum(Object.values(LeadStatus))
  ).withDefault([]),

  source: parseAsArrayOf(
    parseAsStringEnum(Object.values(LeadSource))
  ).withDefault([]),

  priority: parseAsArrayOf(
    parseAsStringEnum(Object.values(Priority))
  ).withDefault([]),

  // Score range
  scoreMin: parseAsInteger.withDefault(0),
  scoreMax: parseAsInteger.withDefault(100),

  // Assignment filter
  assigned: parseAsString.withDefault("all"), // "all" | "assigned" | "unassigned"

  // Date range
  dateFrom: parseAsString.withDefault(""),
  dateTo: parseAsString.withDefault(""),

  // Sorting
  sortBy: parseAsString.withDefault("createdAt"),
  sortOrder: parseAsStringEnum(["asc", "desc"] as const).withDefault("desc"),

  // View mode
  view: parseAsStringEnum(["table", "cards", "kanban"] as const).withDefault("table"),

  // Selected items (for bulk operations)
  selected: parseAsArrayOf(parseAsString).withDefault([]),
});