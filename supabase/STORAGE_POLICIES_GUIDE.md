# Storage Bucket Policies Setup Guide

## 🚀 Quick Setup (Recommended - SQL Method)

**Easiest way:** Run the SQL script!

1. **Go to Supabase Dashboard → SQL Editor**
2. **Open `setup_storage.sql`** in this directory
3. **Copy the entire contents**
4. **Paste into SQL Editor**
5. **Click "Run"**

That's it! This creates the bucket and all policies automatically.

---

## 📋 Manual Setup (Alternative - UI Method)

If the SQL method doesn't work, use the Dashboard UI:

## Steps to Fix Storage Upload Issues:

### 1. Navigate to Storage Policies
1. Go to https://supabase.com/dashboard
2. Select your "Trove_Book-site" project
3. Click **Storage** in the left sidebar
4. Click on the **books** bucket
5. Click the **Policies** tab

### 2. Create Upload Policy
Click **"New Policy"** and create the following:

**Policy Name:** `Users can upload books`  
**Allowed operation:** `INSERT`  
**Target roles:** Leave empty OR select `authenticated`  
**Policy definition:**
```sql
bucket_id = 'books' AND (storage.foldername(name))[1] = auth.uid()::text
```

**Note:** For "Target roles" field:
- **Leave it empty** (defaults to authenticated users)
- OR select **"authenticated"** from the dropdown
- This means only logged-in users can use this policy

### 3. Create Read Policy
Click **"New Policy"** again:

**Policy Name:** `Users can view their books`  
**Allowed operation:** `SELECT`  
**Target roles:** Leave empty OR select `authenticated`  
**Policy definition:**
```sql
bucket_id = 'books' AND (storage.foldername(name))[1] = auth.uid()::text
```

### 4. Create Update Policy (Optional)
**Policy Name:** `Users can update their books`  
**Allowed operation:** `UPDATE`  
**Target roles:** Leave empty OR select `authenticated`  
**Policy definition:**
```sql
bucket_id = 'books' AND (storage.foldername(name))[1] = auth.uid()::text
```

### 5. Create Delete Policy (Optional)
**Policy Name:** `Users can delete their books`  
**Allowed operation:** `DELETE`  
**Target roles:** Leave empty OR select `authenticated`  
**Policy definition:**
```sql
bucket_id = 'books' AND (storage.foldername(name))[1] = auth.uid()::text
```

## Alternative: Use Policy Templates

Supabase provides templates for common policies:

1. Click **"New Policy"**
2. Select **"Create a policy from a template"**
3. Choose **"Enable insert for authenticated users only"**
4. Modify the policy to include the folder check:
   ```sql
   bucket_id = 'books' AND (storage.foldername(name))[1] = auth.uid()::text
   ```

## What These Policies Do:

- **INSERT**: Allows users to upload files to `books/[their-user-id]/filename`
- **SELECT**: Allows users to view/download their own files
- **UPDATE**: Allows users to update their own files
- **DELETE**: Allows users to delete their own files

The `(storage.foldername(name))[1] = auth.uid()::text` part ensures users can only access files in their own folder.

## After Creating Policies:

1. Try uploading a book again
2. Check browser console for success message
3. Book should now appear in your library!

## Troubleshooting:

If upload still fails:
- Check that the bucket is named exactly `books`
- Verify RLS is enabled on the bucket
- Check browser console for specific error messages
