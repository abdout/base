# Lead Generation Automation UI Implementation Plan

## Component Architecture Overview

### 1. Lead Import Components

#### a. PasteImportInterface (`paste-import.tsx`)
- **Purpose**: Main interface for pasting and importing raw lead data
- **Features**:
  - Large textarea with placeholder text
  - Real-time field detection preview
  - Import validation feedback
  - Bulk operation progress indicator
- **Components Used**:
  - `Textarea` for raw data input
  - `Card` for preview container
  - `Badge` for detected field tags
  - `Progress` for import status
  - `Alert` for validation messages
  - `Button` with loading states
  - `Skeleton` for loading states

#### b. LeadExtractionPreview (`lead-preview.tsx`)
- **Purpose**: Shows detected fields and data mapping
- **Features**:
  - Field mapping visualization
  - Data validation indicators
  - Sample data preview
  - Field type badges
- **Components Used**:
  - `Table` for preview data
  - `Badge` for field types
  - `ScrollArea` for overflow
  - `Tooltip` for field descriptions

### 2. Lead Management Table

#### a. LeadsDataTable (`leads-table.tsx`)
- **Purpose**: Main table for viewing and managing leads
- **Features**:
  - Sortable columns
  - Advanced filtering
  - Bulk selection
  - Row actions
  - Pagination
  - Export functionality
- **Components Used**:
  - `DataTable` from existing components
  - `DataTableColumnHeader` for sorting
  - `DataTablePagination` for navigation
  - `DataTableToolbar` for filters
  - `Checkbox` for selection
  - `DropdownMenu` for row actions

#### b. LeadColumns (`lead-columns.tsx`)
- **Purpose**: Column definitions for leads table
- **Fields**:
  - Name (sortable, searchable)
  - Email (sortable)
  - Phone
  - Company
  - Status (filterable)
  - Source
  - Created Date (sortable)
  - Actions

### 3. Lead Detail Components

#### a. LeadDetailSheet (`lead-detail-sheet.tsx`)
- **Purpose**: Slide-out panel for lead details
- **Features**:
  - Edit mode toggle
  - Activity timeline
  - Notes section
  - Status management
  - Contact history
- **Components Used**:
  - `Sheet` for slide-out panel
  - `Form` for edit mode
  - `Tabs` for sections
  - `ScrollArea` for content
  - `Badge` for status
  - `Avatar` for contact display

#### b. LeadEditForm (`lead-edit-form.tsx`)
- **Purpose**: Form for editing lead information
- **Features**:
  - Field validation
  - Auto-save capability
  - Change tracking
  - Undo/redo support
- **Components Used**:
  - `Form` with react-hook-form
  - `Input` for text fields
  - `Select` for dropdowns
  - `Textarea` for notes
  - `Button` for actions
  - `Toast` for feedback

### 4. Bulk Operations

#### a. BulkImportDialog (`bulk-import-dialog.tsx`)
- **Purpose**: Modal for bulk import operations
- **Features**:
  - File upload support
  - CSV/Excel parsing
  - Field mapping interface
  - Import progress tracking
  - Error reporting
- **Components Used**:
  - `Dialog` for modal
  - `Stepper` for wizard flow
  - `Progress` for upload status
  - `Alert` for errors
  - `Table` for mapping preview

#### b. BulkActionsBar (`bulk-actions-bar.tsx`)
- **Purpose**: Action bar for bulk operations
- **Features**:
  - Selected count display
  - Bulk delete
  - Bulk status update
  - Bulk export
- **Components Used**:
  - `Card` for container
  - `Button` for actions
  - `Badge` for count
  - `Select` for bulk updates

### 5. Mobile-Responsive Components

#### a. MobileLeadCard (`mobile-lead-card.tsx`)
- **Purpose**: Card view for mobile devices
- **Features**:
  - Swipe actions
  - Compact information display
  - Quick actions
  - Touch-optimized controls
- **Components Used**:
  - `Card` for container
  - `SwipeableDrawer` for actions
  - `Badge` for status
  - `Button` for CTAs

#### b. MobileFilterSheet (`mobile-filter-sheet.tsx`)
- **Purpose**: Mobile-friendly filter interface
- **Features**:
  - Bottom sheet design
  - Touch-friendly controls
  - Quick filter presets
- **Components Used**:
  - `Sheet` with bottom anchor
  - `RadioGroup` for single select
  - `Checkbox` for multi-select
  - `Button` for apply/reset

### 6. State Management Components

#### a. EmptyState (`empty-state.tsx`)
- **Purpose**: Display when no leads exist
- **Features**:
  - Illustration
  - Helpful message
  - Quick action buttons
  - Import suggestions
- **Components Used**:
  - `Card` for container
  - `Button` for CTAs
  - Custom SVG illustration

#### b. ErrorBoundary (`error-boundary.tsx`)
- **Purpose**: Error handling wrapper
- **Features**:
  - Fallback UI
  - Error reporting
  - Retry capability
  - User-friendly messages
- **Components Used**:
  - `Alert` for error display
  - `Button` for retry
  - `Card` for container

#### c. LoadingSkeletons (`loading-skeletons.tsx`)
- **Purpose**: Loading states for all components
- **Variants**:
  - Table skeleton
  - Card skeleton
  - Form skeleton
  - Detail skeleton
- **Components Used**:
  - `Skeleton` for placeholders
  - `Card` for containers

### 7. Progress Indicators

#### a. ImportProgress (`import-progress.tsx`)
- **Purpose**: Real-time import progress
- **Features**:
  - Step-by-step progress
  - Current operation display
  - Time remaining estimate
  - Cancel capability
- **Components Used**:
  - `Progress` for bar
  - `Card` for container
  - `Badge` for status
  - `Button` for cancel

## Implementation Priority

1. **Phase 1 - Core Components** (Week 1)
   - LeadsDataTable
   - LeadColumns
   - PasteImportInterface
   - LeadExtractionPreview

2. **Phase 2 - Detail Views** (Week 2)
   - LeadDetailSheet
   - LeadEditForm
   - EmptyState
   - LoadingSkeletons

3. **Phase 3 - Bulk Operations** (Week 3)
   - BulkImportDialog
   - BulkActionsBar
   - ImportProgress

4. **Phase 4 - Mobile Optimization** (Week 4)
   - MobileLeadCard
   - MobileFilterSheet
   - Responsive adjustments

## Design System Integration

### Color Scheme
- Primary actions: `primary` variant
- Destructive actions: `destructive` variant
- Success states: `text-green-600 dark:text-green-400`
- Warning states: `text-yellow-600 dark:text-yellow-400`
- Muted text: `text-muted-foreground`

### Spacing
- Container padding: `layout-container` class
- Card spacing: `p-6` standard
- Table spacing: `p-4` cells
- Mobile spacing: `p-4` reduced

### Typography
- Headers: `text-2xl font-semibold`
- Subheaders: `text-lg font-medium`
- Body: `text-sm`
- Muted: `text-xs text-muted-foreground`

### Responsive Breakpoints
- Mobile: `<640px`
- Tablet: `640px-1024px`
- Desktop: `>1024px`

## Accessibility Requirements
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators
- Error announcements
- Loading state announcements

## Performance Considerations
- Virtual scrolling for large datasets
- Debounced search inputs
- Lazy loading for detail views
- Optimistic UI updates
- Request cancellation
- Memoized components