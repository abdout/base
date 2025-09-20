# Debug Guide: Leads Import

## What Was Fixed

1. **Import Handler Implementation**: The `handleImport` function was previously just showing a toast message. Now it:
   - Processes the parsed data from the paste import interface
   - Extracts lead information from each row
   - Creates leads in the database
   - Shows success/failure counts
   - Refreshes the page to show new leads

2. **Debug Logging Added**: Added console.log statements throughout the flow to track:
   - Import data processing
   - Lead creation in database
   - Data fetching from database

## How to Test Import

1. **Open Developer Console** (F12 in Chrome/Edge)
   - Go to Console tab to see debug logs

2. **Navigate to Leads Page**
   - http://localhost:3002/en/leads
   - Login if required

3. **Click Import Button**
   - Click the "Import" button in the top toolbar

4. **Paste Sample Data**
   - Use the "Use Sample Data" button OR
   - Paste this test data:
   ```
   John Doe, john@example.com, +1 555-0123, ABC Corp
   Jane Smith, jane@example.com, +1 555-0124, XYZ Inc
   Bob Johnson, bob@example.com, +1 555-0125, 123 Company
   ```

5. **Click "Import Leads"**

## What to Check in Console

You should see these debug logs:

### 1. Import Processing
```
Import started with data: [...]
Creating lead: {name: "John Doe", email: "john@example.com", ...}
```

### 2. Server-side Creation
```
[CREATE LEAD] Starting with input: {...}
[CREATE LEAD] User authenticated: [user-id]
[CREATE LEAD] Input validated: {...}
[CREATE LEAD] Creating lead in database...
[CREATE LEAD] Lead created successfully: [lead-id]
[CREATE LEAD] Cache revalidated, returning success
```

### 3. Data Fetching
```
[LIST LEADS] Starting with params: {...}
[LIST LEADS] User authenticated: [user-id]
[LIST LEADS] Query where clause: {...}
[LIST LEADS] Found X leads, total: Y
```

## Common Issues & Solutions

### Issue: "A lead with this email already exists"
**Solution**: The system prevents duplicate emails. Try with different email addresses.

### Issue: No leads showing after import
**Check**:
1. Console for errors
2. Network tab for failed requests
3. Database directly: `pnpm prisma studio`

### Issue: "Failed to create lead"
**Possible Causes**:
1. Validation error - check console for details
2. Database connection issue
3. Authentication problem - make sure you're logged in

## Direct Database Check

To verify leads are in the database:

```bash
# Open Prisma Studio
pnpm prisma studio
```

1. Navigate to Lead table
2. Check if imported leads are present
3. Verify userId field matches your user

## Manual Lead Creation Test

You can also test by creating a lead manually:

1. Click "New Lead" button
2. Fill in form:
   - Name: Test Lead
   - Email: test@example.com
   - Company: Test Company
   - Status: New
   - Source: Manual Entry
   - Priority: Medium
3. Click "Create Lead"
4. Check if it appears in table

## What Each Log Means

- **"Import started with data"**: Client received paste data
- **"Creating lead"**: Client is processing each lead
- **"[CREATE LEAD] Starting"**: Server received create request
- **"[CREATE LEAD] Lead created successfully"**: Database insert successful
- **"[LIST LEADS] Found X leads"**: Table refresh found leads
- **"Successfully imported X lead(s)"**: Import complete

## If Import Still Doesn't Work

1. **Check Browser Console** for JavaScript errors
2. **Check Network Tab** for failed API calls
3. **Check Server Console** (terminal running `pnpm dev`) for server errors
4. **Verify Database Schema**:
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

5. **Try Manual Database Insert**:
   ```bash
   pnpm prisma studio
   # Manually add a lead in the Lead table
   ```

## Success Criteria

✅ Console shows all debug logs without errors
✅ Toast notification shows "Successfully imported X lead(s)"
✅ New leads appear in the table after import
✅ Leads are visible in Prisma Studio
✅ Page refreshes automatically after import