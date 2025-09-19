## Leads Management Block

AI-powered lead generation and management system with automated extraction, enrichment, and full CRUD capabilities. Built following the mirror pattern with server-driven pagination, filtering, and real-time updates.

### 🚀 Key Features

- **AI Extraction**: Paste raw text and automatically extract lead information using Claude AI
- **Bulk Import**: Process multiple leads simultaneously with progress tracking
- **Data Enrichment**: Automatic company and contact information enrichment
- **Real-time Updates**: Server-sent events for live data synchronization
- **Full CRUD**: Complete create, read, update, delete operations
- **Advanced Search**: Full-text search across all lead fields
- **Mobile Responsive**: Optimized for desktop and mobile devices

### 📁 Files and Responsibilities

#### Core Components
- `content.tsx`: RSC that reads `leadsSearchParams` and fetches leads from `db.lead`. Passes data to client table.
- `table.tsx`: Client wrapper using `useDataTable` with URL-synced state. Includes import button and modal management.
- `columns.tsx`: Column definitions with sorting, filtering, and custom renderers. Includes confidence scores and enrichment indicators.
- `form.tsx`: Lead creation/edit form using `react-hook-form` + `zodResolver`. Supports both manual entry and AI extraction.
- `import-form.tsx`: Bulk import interface with paste area, field preview, and progress tracking.

#### Server Logic
- `actions.ts`: Server actions for CRUD operations, AI extraction, enrichment, and bulk import. All operations include audit trails.
- `queries.ts`: Optimized database queries with proper indexing and pagination support.
- `validations.ts`: Zod schemas for input validation, ensuring data integrity across client and server.
- `extraction.ts`: AI extraction pipeline using Claude API for intelligent field detection.
- `enrichment.ts`: Data enrichment utilities for company information, email verification, and social profiles.

#### Supporting Files
- `types.ts`: TypeScript definitions for Lead, ImportResult, and transport DTOs.
- `constants.ts`: Status enums, source types, priority levels, and configuration constants.
- `hooks.ts`: Custom React hooks for lead management, real-time updates, and optimistic UI.
- `list-params.ts`: URL state management using `nuqs` for persistent filters and pagination.

### 🔄 Data Flow (Server-Source-of-Truth)

1. **Import Flow**:
   - User pastes raw text → `import-form.tsx`
   - Text sent to `extractAndCreateLead` action
   - AI extraction via Claude → Field validation → Duplicate check
   - Lead created with confidence scores → Enrichment queued
   - `revalidatePath("/leads")` triggers table refresh

2. **Table Flow**:
   - URL state → `leadsSearchParams` → `content.tsx` → Prisma query
   - Server returns paginated results → `LeadsTable` → `useDataTable`
   - Filters update URL → Server re-fetches on navigation
   - Real-time updates via SSE keep data synchronized

3. **CRUD Flow**:
   - All mutations parse with Zod schemas
   - Operations create audit trail entries
   - `revalidatePath` ensures UI consistency
   - Optimistic updates for instant feedback

### 💡 Current Implementation

#### Search & Filtering
- **Name Search**: Partial, case-insensitive match on name and company
- **Email Search**: Exact and domain-based filtering
- **Status Filter**: NEW, CONTACTED, QUALIFIED, PROPOSAL, NEGOTIATION, CLOSED_WON, CLOSED_LOST
- **Source Filter**: MANUAL, IMPORT, API, WEBSITE, REFERRAL, SOCIAL_MEDIA
- **Date Filters**: Created date range, last contact date
- **Score Filter**: Lead quality score (0-100)

#### Table Columns
- `name`: Lead name with company subtitle
- `email`: Validated email with verification indicator
- `phone`: Formatted phone number
- `status`: Color-coded status badge
- `score`: Quality score with visual indicator
- `source`: Lead source icon
- `createdAt`: Relative time display
- `actions`: View, Edit, Delete, Enrich

#### Actions Menu
- **View**: Opens detailed lead sheet with full information
- **Edit**: Opens form modal with pre-filled data
- **Delete**: Confirmation dialog with soft delete option
- **Enrich**: Triggers background enrichment job
- **Export**: Download lead data as CSV/JSON

#### Bulk Operations
- **Select All**: Toggle all visible leads
- **Bulk Delete**: Remove multiple leads with confirmation
- **Bulk Status Update**: Change status for selected leads
- **Bulk Export**: Export selected leads
- **Bulk Assign**: Assign leads to team members

### 🏗️ Architecture Patterns

#### Mirror Pattern
```
app/[lang]/(expose)/(protected)/leads/page.tsx
  → imports from →
components/leads/clients/content.tsx
```

#### Server Actions Pattern
```typescript
"use server"
export async function createLead(input: CreateLeadSchema) {
  const user = await currentUser();
  const validated = createLeadSchema.parse(input);
  const lead = await db.lead.create({ data: validated });
  revalidatePath("/leads");
  return { success: true, data: lead };
}
```

#### AI Extraction Pattern
```typescript
export async function extractLead(text: string) {
  const patterns = detectPatterns(text);
  const extracted = await claude.extract(text, patterns);
  const validated = validateExtraction(extracted);
  return { ...validated, confidence: calculateConfidence(validated) };
}
```

### 🔧 Configuration

#### Environment Variables
```env
# AI Configuration
CLAUDE_API_KEY=your_api_key
CLAUDE_MODEL=claude-3-opus-20240229

# Enrichment APIs (Optional)
CLEARBIT_API_KEY=
HUNTER_API_KEY=

# Real-time (Optional)
REDIS_URL=
```

#### Feature Flags
```typescript
export const features = {
  aiExtraction: true,
  bulkImport: true,
  enrichment: false, // Requires API keys
  realtime: false,   // Requires Redis
  export: true,
  audit: true
};
```

### 🚦 Implementation Status

#### Completed ✅
- [x] Basic CRUD operations
- [x] Table with pagination and sorting
- [x] Manual lead creation form
- [x] Search functionality
- [x] Status filtering
- [x] Delete with confirmation
- [x] Mobile responsive design

#### In Progress 🔄
- [ ] AI extraction integration
- [ ] Bulk import interface
- [ ] Field detection preview
- [ ] Confidence scoring
- [ ] Duplicate detection

#### Planned 📋
- [ ] Data enrichment APIs
- [ ] Real-time updates (SSE)
- [ ] Export functionality
- [ ] Audit trail viewer
- [ ] Team assignment
- [ ] Email verification
- [ ] Lead scoring algorithm

### 🧪 Testing

#### Unit Tests
```bash
# Run component tests
pnpm test components/leads/clients

# Test extraction logic
pnpm test:extraction

# Test server actions
pnpm test:actions
```

#### Integration Tests
```bash
# Test full import flow
pnpm test:e2e leads/import

# Test CRUD operations
pnpm test:e2e leads/crud
```

### 📈 Performance Optimizations

1. **Database Indexes**: Optimized queries with proper indexing
2. **Full-text Search**: PostgreSQL full-text search for descriptions
3. **Pagination**: Server-side pagination with cursor-based option
4. **Caching**: Query result caching with proper invalidation
5. **Lazy Loading**: Components loaded on-demand
6. **Optimistic Updates**: Instant UI feedback for better UX
7. **Debounced Search**: Reduces API calls during typing

### 🔐 Security Considerations

1. **Input Validation**: All inputs validated with Zod schemas
2. **SQL Injection**: Protected via Prisma parameterized queries
3. **XSS Prevention**: React's built-in protections + sanitization
4. **Rate Limiting**: API calls limited per user
5. **Access Control**: Row-level security for multi-tenancy
6. **Audit Trail**: All operations logged with user context

### 📚 Usage Examples

#### Basic Usage
```tsx
// In your page component
import { LeadsContent } from '@/components/leads/clients/content';

export default function LeadsPage() {
  return <LeadsContent />;
}
```

#### With Custom Filters
```tsx
// Pre-filtered view
export default function QualifiedLeadsPage() {
  return <LeadsContent defaultFilters={{ status: 'QUALIFIED' }} />;
}
```

#### Programmatic Import
```typescript
import { extractAndCreateLead } from '@/components/leads/clients/actions';

// In your server action or API route
const lead = await extractAndCreateLead({
  rawText: "John Doe from Acme Corp, john@acme.com"
});
```

### 🛠️ Development Workflow

1. **Setup Database**:
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

2. **Configure AI**:
   - Add Claude API key to `.env`
   - Adjust extraction prompts in `claude-config.ts`

3. **Run Development**:
   ```bash
   pnpm dev
   ```

4. **Test Extraction**:
   - Navigate to `/leads/import`
   - Paste sample data
   - Preview and adjust field mappings

### 🤝 Contributing

When adding features to the leads block:

1. Follow the established file structure
2. Add proper TypeScript types
3. Include Zod validation schemas
4. Update this README
5. Add tests for new functionality
6. Ensure mobile responsiveness
7. Consider internationalization

### 📖 Related Documentation

- [Architecture Patterns](../../../app/[lang]/docs/architecture/page.mdx)
- [Table Components](../../table/README.md)
- [Server Actions Guide](../../../app/[lang]/docs/pattern/page.mdx)
- [Technical PDR](../../../docs/TECHNICAL_PDR_LEADS.md)

### 🐛 Known Issues & Limitations

1. **Extraction Accuracy**: Complex formats may require manual adjustment
2. **Rate Limits**: Claude API has request limits
3. **Enrichment Cost**: Third-party APIs may incur charges
4. **Large Imports**: Files > 1000 leads should be processed in batches
5. **Real-time**: Requires Redis for production SSE support

### 🚀 Next Steps

1. Complete AI extraction integration
2. Add enrichment API integrations
3. Implement real-time updates
4. Add export functionality
5. Create mobile app views
6. Add advanced lead scoring
7. Integrate with CRM systems

---

For questions or issues, please refer to the [Technical PDR](../../../docs/TECHNICAL_PDR_LEADS.md) or create an issue in the repository.