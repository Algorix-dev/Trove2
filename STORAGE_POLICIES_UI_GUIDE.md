# 📸 Step-by-Step: Creating Storage Policies in Supabase UI

## ⚠️ Important
Storage policies **CANNOT** be created with SQL. You **MUST** use the Supabase Dashboard UI.

---

## 🎯 Part 1: Create the Avatars Bucket

### Step 1: Navigate to Storage
1. Go to https://supabase.com/dashboard
2. Select your **Trove2** project
3. Click **Storage** in the left sidebar
4. Click the green **"New bucket"** button

### Step 2: Create the Bucket
1. **Name:** Type `avatars` (exactly, lowercase)
2. **Public bucket:** Toggle this to **ON** (enabled)
3. **File size limit:** Leave default or set to 5MB
4. **Allowed MIME types:** Leave empty (allows all image types)
5. Click **"Create bucket"**

---

## 🔒 Part 2: Create Storage Policies (UI Method)

### Policy 1: Allow Users to Upload Their Own Avatars

1. **Click on the `avatars` bucket** you just created
2. Click the **"Policies"** tab at the top
3. Click the green **"New Policy"** button
4. You'll see a form. Fill it out like this:

#### Option A: Using the Form (Recommended)

**Policy Name:**
```
Users can upload own avatar
```

**Allowed operation:**
- Select **"INSERT"** from the dropdown

**Target roles:**
- **Leave this field EMPTY** (it defaults to authenticated users)
- OR select **"authenticated"** from the dropdown if you see one

**Policy definition (USING clause):**
- **Leave this EMPTY** (not used for INSERT)

**Policy definition (WITH CHECK clause):**
- Click in this text area
- Paste this code:
```sql
bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
```

5. Click **"Review"** or **"Save policy"** button

---

### Policy 2: Allow Public to View Avatars

1. Click **"New Policy"** again
2. Fill out the form:

**Policy Name:**
```
Public can view avatars
```

**Allowed operation:**
- Select **"SELECT"** from the dropdown

**Target roles:**
- **Leave EMPTY** OR select **"public"** if available

**Policy definition (USING clause):**
- Paste this code:
```sql
bucket_id = 'avatars'
```

**Policy definition (WITH CHECK clause):**
- **Leave this EMPTY** (not used for SELECT)

3. Click **"Save policy"**

---

### Policy 3: Allow Users to Delete Their Own Avatars

1. Click **"New Policy"** again
2. Fill out the form:

**Policy Name:**
```
Users can delete own avatar
```

**Allowed operation:**
- Select **"DELETE"** from the dropdown

**Target roles:**
- **Leave EMPTY** OR select **"authenticated"**

**Policy definition (USING clause):**
- Paste this code:
```sql
bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
```

**Policy definition (WITH CHECK clause):**
- **Leave this EMPTY** (not used for DELETE)

3. Click **"Save policy"**

---

## 🎨 Visual Guide: What the Form Looks Like

When you click "New Policy", you'll see a form with these fields:

```
┌─────────────────────────────────────────┐
│ Policy Name:                            │
│ [Users can upload own avatar        ]  │
│                                         │
│ Allowed operation:                      │
│ [INSERT ▼]                              │
│                                         │
│ Target roles:                           │
│ [                                    ]  │ ← Leave empty
│                                         │
│ Policy definition (USING clause):      │
│ [                                    ]  │ ← Leave empty for INSERT
│                                         │
│ Policy definition (WITH CHECK clause): │
│ [bucket_id = 'avatars' AND...        ]  │ ← Paste code here
│                                         │
│              [Save policy]              │
└─────────────────────────────────────────┘
```

---

## 🔍 Troubleshooting

### Problem: "I don't see a Policies tab"
**Solution:**
- Make sure you clicked on the bucket name itself (not just the Storage page)
- The bucket must be created first

### Problem: "The form doesn't have those fields"
**Solution:**
- Supabase UI may have changed
- Look for fields labeled:
  - "Policy name" or "Name"
  - "Operation" or "Action"
  - "Policy" or "Definition" or "USING" or "WITH CHECK"

### Problem: "I see 'Create a policy from a template'"
**Solution:**
- You can use templates! Click that option
- Choose "Enable insert for authenticated users only"
- Then modify the policy code to add the folder check

### Problem: "Target roles field is confusing"
**Solution:**
- **For authenticated users:** Leave empty OR type `authenticated`
- **For public access:** Leave empty OR type `public`
- If there's a dropdown, select from it

### Problem: "I don't know which field is USING vs WITH CHECK"
**Solution:**
- **USING clause:** Used for SELECT, UPDATE, DELETE (checks existing data)
- **WITH CHECK clause:** Used for INSERT, UPDATE (checks new/modified data)
- If you only see one "Policy definition" field, put the code there

---

## ✅ Verification

After creating all 3 policies, you should see:

1. **Users can upload own avatar** (INSERT)
2. **Public can view avatars** (SELECT)
3. **Users can delete own avatar** (DELETE)

---

## 📝 Quick Reference: Policy Types

| Operation | USING Clause | WITH CHECK Clause | Target Roles |
|-----------|--------------|-------------------|--------------|
| INSERT    | Empty        | Your code         | authenticated |
| SELECT    | Your code    | Empty             | public/empty |
| DELETE    | Your code    | Empty             | authenticated |

---

## 🎯 Alternative: Using Policy Templates

If the form is confusing, try templates:

1. Click **"New Policy"**
2. Click **"Create a policy from a template"**
3. Select a template (e.g., "Enable insert for authenticated users only")
4. The template will pre-fill the form
5. Modify the policy code in the text area to match what you need

---

## 💡 Pro Tip

If you're still having trouble:
1. Take a screenshot of the form you see
2. The Supabase UI might have changed
3. The key is: **Policy definition** field = where you paste the SQL code

---

**Need more help?** Check the Supabase docs: https://supabase.com/docs/guides/storage/security/access-control

