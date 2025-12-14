# 🚀 Complete Setup Guide - Making Trove Fully Functional

## 📋 Overview

This guide will help you set up Trove as a fully functional website. Since you're collaborating with antigravity on the [Algorix-dev/Trove](https://github.com/Algorix-dev/Trove) repository, we'll cover repository strategy, database setup, and deployment.

---

## 🎯 Step 1: Repository Strategy

### Option A: Fork the Repository (Recommended for Collaboration)

If you want to work independently but contribute back:

1. **Fork the repository:**
   - Go to https://github.com/Algorix-dev/Trove
   - Click "Fork" button (top right)
   - This creates your own copy: `https://github.com/YOUR_USERNAME/Trove`

2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Trove.git
   cd Trove
   ```

3. **Add upstream for syncing:**
   ```bash
   git remote add upstream https://github.com/Algorix-dev/Trove.git
   ```

4. **Sync with upstream:**
   ```bash
   git fetch upstream
   git merge upstream/main
   ```

### Option B: Direct Collaboration (If You Have Access)

If you're a collaborator on the main repo:

1. **Clone directly:**
   ```bash
   git clone https://github.com/Algorix-dev/Trove.git
   cd Trove
   ```

2. **Create your own branch:**
   ```bash
   git checkout -b your-feature-branch
   ```

### Option C: Create New Repository (For Independent Project)

If you want a completely separate project:

1. **Create new GitHub repository**
2. **Clone the original and push to your new repo:**
   ```bash
   git clone https://github.com/Algorix-dev/Trove.git
   cd Trove
   git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

**Recommendation:** Use **Option A (Fork)** for collaboration, or **Option C** if you want a completely independent project.

---

## 🗄️ Step 2: Set Up Your Own Supabase Database (REQUIRED)

**⚠️ IMPORTANT:** You MUST create your own Supabase project. Never use someone else's database credentials!

### 2.1 Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up/Login** (free tier is sufficient)
3. **Click "New Project"**
4. **Fill in details:**
   - **Name:** `trove` (or your preferred name)
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to you
   - **Pricing Plan:** Free tier is fine for development

5. **Wait for project to initialize** (2-3 minutes)

### 2.2 Get Your Supabase Credentials

1. **Go to Project Settings** (gear icon in sidebar)
2. **Click "API"** in the left menu
3. **Copy these values:**
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

4. **For admin operations (optional):**
   - Go to **Settings → API**
   - Copy **service_role key** (keep this secret! Never expose in frontend)

---

## 🔐 Step 3: Configure Environment Variables

### 3.1 Create `.env.local` File

In your project root, create `.env.local`:

```bash
# Windows PowerShell
New-Item -Path .env.local -ItemType File

# Or create manually in your editor
```

### 3.2 Add Your Supabase Credentials

Open `.env.local` and add:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: For server-side admin operations (NEVER expose in frontend!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Optional: Site URL for OAuth callbacks
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Replace:**
- `your-project-id` with your actual Supabase project ID
- `your-anon-key-here` with your actual anon key
- `your-service-role-key-here` with your service role key (if needed)

### 3.3 Add to `.gitignore`

Make sure `.env.local` is in `.gitignore` (it should already be):

```gitignore
.env.local
.env*.local
```

**⚠️ NEVER commit `.env.local` to Git!**

---

## 🗃️ Step 4: Set Up Database Schema

### 4.1 Open Supabase SQL Editor

1. **Go to your Supabase Dashboard**
2. **Click "SQL Editor"** in the left sidebar
3. **Click "New Query"**

### 4.2 Run Complete Schema

For a **brand new database**, use the complete schema:

1. **Open:** `supabase/complete_schema.sql` in your project
2. **Copy the entire contents**
3. **Paste into Supabase SQL Editor**
4. **Click "Run"** (or press Ctrl+Enter)

This creates:
- All tables (profiles, books, reading_progress, notes, bookmarks, etc.)
- Row Level Security (RLS) policies
- Indexes for performance
- Gamification tables (levels, achievements, XP)
- Triggers and functions

### 4.3 Alternative: Use Migration Script

If you want to be more careful or have an existing database:

1. **Open:** `supabase/migration_update.sql`
2. **Copy and paste into SQL Editor**
3. **Run the query**

This safely adds missing features without breaking existing data.

### 4.4 Verify Tables Were Created

In Supabase Dashboard:
1. **Go to "Table Editor"**
2. **You should see these tables:**
   - `profiles`
   - `books`
   - `reading_progress`
   - `notes`
   - `bookmarks`
   - `reading_sessions`
   - `levels`
   - `achievements`
   - `user_achievements`
   - `quotes`
   - `reading_goals`

---

## 📦 Step 5: Set Up Storage Buckets

### 5.1 Create Books Storage Bucket

1. **Go to "Storage"** in Supabase Dashboard
2. **Click "Create a new bucket"**
3. **Configure:**
   - **Name:** `books`
   - **Public bucket:** ❌ **UNCHECKED** (private)
   - **File size limit:** 50 MB (or your preference)
   - **Allowed MIME types:** 
     - `application/pdf`
     - `application/epub+zip`
     - `text/plain`

4. **Click "Create bucket"**

### 5.2 Set Up Storage Policies

1. **Click on the `books` bucket**
2. **Go to "Policies" tab**
3. **Click "New Policy"**

#### Policy 1: Allow users to upload to their own folder

```sql
-- Policy Name: Users can upload to their own folder
-- Policy Type: INSERT
-- Policy Definition:
(user_id()) = (storage.foldername(name))[1]::uuid
```

#### Policy 2: Allow users to read their own files

```sql
-- Policy Name: Users can read their own files
-- Policy Type: SELECT
-- Policy Definition:
(user_id()) = (storage.foldername(name))[1]::uuid
```

#### Policy 3: Allow users to delete their own files

```sql
-- Policy Name: Users can delete their own files
-- Policy Type: DELETE
-- Policy Definition:
(user_id()) = (storage.foldername(name))[1]::uuid
```

**Or use the provided script:**

1. **Open:** `supabase/STORAGE_POLICIES_GUIDE.md`
2. **Follow the instructions there**

---

## 🚀 Step 6: Install Dependencies & Run Locally

### 6.1 Install Dependencies

```bash
npm install
```

### 6.2 Start Development Server

```bash
npm run dev
```

### 6.3 Open in Browser

Visit: **http://localhost:3000**

You should see the Trove landing page!

---

## ✅ Step 7: Test Core Functionality

### 7.1 Test Authentication

1. **Click "Get Started" or "Sign Up"**
2. **Create an account:**
   - Enter email and password
   - Check your email for confirmation link
   - Click the confirmation link
3. **Sign in** with your credentials
4. **You should be redirected to the dashboard**

### 7.2 Test Book Upload

1. **Go to Dashboard → Library**
2. **Click "Upload Book"**
3. **Upload a test PDF/EPUB/TXT file**
4. **Verify:**
   - File appears in your library
   - Cover image displays (or gradient generated)
   - Book is clickable

### 7.3 Test Reading

1. **Click on a book in your library**
2. **Reader should open**
3. **Test features:**
   - Page navigation
   - Theme toggle
   - Bookmarking
   - Progress tracking

### 7.4 Test Other Features

- **Notes:** Create notes on books
- **Bookmarks:** Add bookmarks
- **Analytics:** Check reading stats
- **Settings:** Update profile

---

## 🌐 Step 8: Deploy to Production

### 8.1 Deploy to Vercel (Recommended - Free)

#### Option A: Via Vercel Dashboard

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial setup"
   git push origin main
   ```

2. **Go to [vercel.com](https://vercel.com)**
3. **Sign up/Login with GitHub**
4. **Click "Add New Project"**
5. **Import your GitHub repository**
6. **Configure:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

7. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
     - `NEXT_PUBLIC_SITE_URL` = your Vercel URL (will be provided)

8. **Click "Deploy"**
9. **Wait for deployment** (2-3 minutes)
10. **Your site is live!** 🎉

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts, then deploy to production:
vercel --prod
```

### 8.2 Update OAuth Redirect URLs

After deployment, update Supabase:

1. **Go to Supabase Dashboard → Authentication → URL Configuration**
2. **Add to "Redirect URLs":**
   - `https://your-project.vercel.app/auth/callback`
   - `https://your-project.vercel.app/**`

3. **Update Site URL:**
   - Set to: `https://your-project.vercel.app`

### 8.3 Update Environment Variables in Vercel

1. **Go to Vercel Dashboard → Your Project → Settings → Environment Variables**
2. **Update `NEXT_PUBLIC_SITE_URL`:**
   - Change from `http://localhost:3000`
   - To: `https://your-project.vercel.app`

3. **Redeploy** (or wait for auto-deploy on next push)

---

## 🔧 Step 9: Post-Deployment Checklist

- [ ] ✅ Database schema created
- [ ] ✅ Storage bucket created with policies
- [ ] ✅ Environment variables set in Vercel
- [ ] ✅ OAuth redirect URLs configured
- [ ] ✅ Site URL updated in Supabase
- [ ] ✅ Test sign up/sign in works
- [ ] ✅ Test book upload works
- [ ] ✅ Test reading works
- [ ] ✅ Test all features (notes, bookmarks, analytics)
- [ ] ✅ Custom domain configured (optional)

---

## 🐛 Troubleshooting

### Issue: "Invalid API key" error

**Solution:**
- Check `.env.local` has correct Supabase credentials
- Restart dev server: `npm run dev`
- Verify credentials in Supabase Dashboard → Settings → API

### Issue: "Storage bucket not found"

**Solution:**
- Create `books` bucket in Supabase Storage
- Set up storage policies (see Step 5.2)

### Issue: "Table does not exist"

**Solution:**
- Run `supabase/complete_schema.sql` in Supabase SQL Editor
- Verify tables exist in Table Editor

### Issue: "OAuth redirect error"

**Solution:**
- Add redirect URL to Supabase: `https://your-site.vercel.app/auth/callback`
- Update Site URL in Supabase Auth settings

### Issue: Build fails on Vercel

**Solution:**
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify `package.json` has correct dependencies

---

## 📚 Additional Resources

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Docs:** https://vercel.com/docs
- **Project Repository:** https://github.com/Algorix-dev/Trove

---

## 🎯 Quick Reference Commands

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build

# Test production build locally
npm start

# Deploy to Vercel
vercel --prod

# Check TypeScript errors
npm run type-check

# Run linter
npm run lint
```

---

## ✅ Success Checklist

Once everything is set up, you should have:

- ✅ Your own GitHub repository (forked or new)
- ✅ Your own Supabase project with database
- ✅ All tables and policies created
- ✅ Storage bucket configured
- ✅ Environment variables set
- ✅ Local development working
- ✅ Production deployment live
- ✅ All features functional

---

## 🎉 You're Done!

Your Trove website should now be fully functional! 

**Local:** http://localhost:3000  
**Production:** https://your-project.vercel.app

If you encounter any issues, refer to the troubleshooting section or check the project's GitHub issues.

---

**Last Updated:** Based on latest codebase audit and fixes  
**Status:** ✅ Production Ready

