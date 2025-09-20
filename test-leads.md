# Leads Block Testing Guide

## Test URL
http://localhost:3002/en/leads

## What to Test

### 1. Page Load
- ✅ Page should load without errors
- ✅ Should show "Leads" title
- ✅ Should show "Manage and track your potential customers" description

### 2. Table Features
- Check if the table displays with columns:
  - Name
  - Email
  - Phone
  - Status
  - Source
  - Priority
  - Score
  - Created
  - Actions

### 3. Create New Lead
- Click "New Lead" button
- Fill in the form:
  - Name (required)
  - Company
  - Email
  - Phone
  - Website
  - Description
  - Notes
  - Status (dropdown)
  - Source (dropdown)
  - Priority (dropdown)
  - Tags (clickable badges)
- Click "Create Lead" button

### 4. Filters and Search
- Use the search bar to filter by name, email, or company
- Use the status filter dropdown
- Use the source filter dropdown
- Use the priority filter dropdown

### 5. Import/Export
- Click "Import" button
- Paste sample data:
```
John Doe, john@example.com, +1 555-0123, ABC Corp
Jane Smith, jane@example.com, +1 555-0124, XYZ Inc
Bob Johnson, bob@example.com, +1 555-0125, 123 Company
```
- Click "Import Leads" button

### 6. Bulk Operations
- Select multiple leads using checkboxes
- Click "Delete Selected" button in floating bar

### 7. Row Actions
- Click the three dots menu on any row
- Test actions:
  - View Details
  - Edit
  - Send Email (if email exists)
  - Call (if phone exists)
  - Delete

### 8. Internationalization
- Change language to Arabic: http://localhost:3002/ar/leads
- Verify all text is translated
- Verify RTL layout is applied

## Database Check
If you have database access, check the `Lead` table in Prisma Studio:
```bash
pnpm prisma studio
```

## Common Issues & Solutions

### Issue: Page redirects to login
**Solution**: The leads page requires authentication. Log in first at `/en/login`

### Issue: "Dictionary undefined" error
**Solution**: The page has been fixed to properly await params and pass dictionary

### Issue: No data showing
**Solution**: This is normal on first load. Create some test leads using the "New Lead" button

### Issue: Import not working
**Solution**: The AI extraction feature is marked as "coming soon" - basic import will parse the data but full AI extraction is Phase 2

## Success Criteria
- [ ] Page loads without errors
- [ ] Can create a new lead
- [ ] Can view leads in table
- [ ] Filters work correctly
- [ ] Internationalization works (English and Arabic)
- [ ] Form validation works
- [ ] Toast notifications appear for actions