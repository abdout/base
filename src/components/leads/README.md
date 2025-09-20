# Leads Management System

## Overview
The Leads Management System is a comprehensive CRM module for managing potential customers and tracking their journey through the sales pipeline. Built with Next.js 15, TypeScript, and Prisma ORM.

## Architecture

### Directory Structure
```
src/components/leads/
├── clients/                 # Client-specific lead components
│   ├── actions.ts          # Server actions for CRUD operations
│   ├── columns.tsx         # Table column definitions
│   ├── constants.ts        # Status, source, priority enums
│   ├── content.tsx         # Main content wrapper
│   ├── custom-data-table.tsx # Custom styled data table
│   ├── form.tsx            # Lead creation/edit form
│   ├── lead-actions.tsx    # Dropdown action handlers
│   ├── list-params.ts     # URL search params schema
│   ├── table.tsx           # Main table component
│   ├── types.ts            # TypeScript interfaces
│   └── validation.ts       # Zod validation schemas
├── students/               # Student-specific components (reference)
│   ├── form.tsx           # Multi-step form example
│   └── footer.tsx         # Form footer with progress
├── bulk-operations.tsx     # Bulk action handlers
├── lead-detail-sheet.tsx   # Lead detail view sheet
├── lead-preview.tsx        # Preview component for imports
├── leads-table.tsx         # Legacy table component
├── loading-states.tsx      # Skeleton loaders
├── mobile-lead-card.tsx    # Mobile responsive card
└── paste-import.tsx        # Paste/import interface
```

## Core Features

### 1. Lead Management
- **CRUD Operations**: Create, read, update, delete leads
- **Bulk Actions**: Select and perform actions on multiple leads
- **Status Tracking**: NEW → CONTACTED → QUALIFIED → PROPOSAL → NEGOTIATION → CLOSED_WON/LOST
- **Lead Scoring**: 0-100 score system with visual indicators
- **Source Tracking**: Manual, Import, API, Website, Referral, Social Media, Email Campaign
- **Priority Levels**: Low, Medium, High, Urgent

### 2. Import Capabilities
- **Paste Import**: Copy/paste raw text data
- **AI Extraction**: Intelligent field detection using AI
- **Batch Import**: Process multiple leads simultaneously
- **Duplicate Detection**: Automatic duplicate checking
- **Validation**: Real-time field validation

### 3. User Interface
- **Data Table**: Advanced filtering, sorting, pagination
- **Detail Sheets**: Slide-out panels for lead details
- **Mobile Support**: Responsive card layout for mobile
- **Dark Mode**: Full theme support
- **RTL Support**: Arabic language support

### 4. Internationalization
- **Languages**: English (en) and Arabic (ar)
- **Dictionary-based**: All text from translation files
- **RTL Layout**: Automatic direction switching

## Data Model

### Lead Schema (Prisma)
```prisma
model Lead {
  id                String    @id @default(cuid())
  name              String
  company           String?
  email             String?
  phone             String?
  website           String?
  description       String?
  notes             String?
  status            LeadStatus @default(NEW)
  source            LeadSource @default(MANUAL)
  priority          Priority   @default(MEDIUM)
  score             Int?
  tags              String[]
  confidence        Float?     // AI extraction confidence
  rawInput          String?    // Original import data
  extractionMetadata Json?     // AI extraction details
  createdAt         DateTime   @default(now())
  updatedAt         DateTime   @updatedAt
  lastContactedAt   DateTime?
  nextFollowUp      DateTime?

  // Relations
  userId            String
  user              User      @relation(fields: [userId], references: [id])
  assignedTo        String?
  assignedUser      User?     @relation("AssignedLeads", fields: [assignedTo], references: [id])
  interactions      Interaction[]
  history           LeadHistory[]

  @@index([userId, status])
  @@index([email])
}
```

## Component APIs

### Server Actions

#### `createLead(data: LeadCreateInput)`
Creates a new lead with validation and duplicate checking.

#### `updateLead(data: LeadUpdateInput)`
Updates existing lead with audit trail.

#### `deleteLead(id: string)`
Soft deletes a lead with cascade handling.

#### `listLeads(params: LeadSearchParams)`
Lists leads with filtering, sorting, and pagination.

#### `importLeads(data: BulkImportInput)`
Bulk imports leads with AI extraction.

### Client Components

#### `LeadsTable`
Main table component with advanced features.
```tsx
<LeadsTable
  data={leads}
  pagination={pagination}
  dictionary={dictionary}
/>
```

#### `LeadForm`
Comprehensive form for creating/editing leads.
```tsx
<LeadForm
  form={form}
  onSubmit={handleSubmit}
  mode="create|edit"
  dictionary={dictionary}
/>
```

#### `PasteImport`
AI-powered paste import interface.
```tsx
<PasteImport
  onImport={handleImport}
  dictionary={dictionary}
/>
```

## State Management

### Form State
- React Hook Form for form management
- Zod for validation
- Optimistic updates with `useTransition`

### Table State
- TanStack Table for data grid
- URL-based filtering/sorting
- Server-side pagination

### UI State
- Sheets for detail views
- Modals for forms
- Toast notifications for feedback

## Performance Optimizations

1. **Server Components**: Data fetching on server
2. **Lazy Loading**: Dynamic imports for heavy components
3. **Debouncing**: Search and filter inputs
4. **Virtual Scrolling**: For large datasets
5. **Optimistic Updates**: Immediate UI feedback
6. **Caching**: Next.js cache with tags

## Security

1. **Authentication**: Required for all operations
2. **Authorization**: User-based data isolation
3. **Validation**: Server-side schema validation
4. **Sanitization**: Input cleaning for XSS prevention
5. **Rate Limiting**: API endpoint protection

## Testing Checklist

- [ ] Unit tests for validation schemas
- [ ] Integration tests for server actions
- [ ] Component tests for forms
- [ ] E2E tests for critical flows
- [ ] Accessibility testing
- [ ] Performance testing
- [ ] Security testing

## Development Guidelines

### Adding New Features
1. Update TypeScript types in `types.ts`
2. Add validation in `validation.ts`
3. Create server action in `actions.ts`
4. Update UI components
5. Add translations to dictionaries
6. Test thoroughly

### Code Style
- Use TypeScript strict mode
- Follow ESLint configuration
- Use Prettier for formatting
- Write descriptive comments
- Keep components small and focused

## Known Issues
See [ISSUE.md](./ISSUE.md) for current issues and enhancement roadmap.

## Future Enhancements
- Email integration
- Calendar sync
- Advanced analytics
- AI-powered insights
- Workflow automation
- Third-party integrations