# 🚀 Quick Start Guide

## ✅ What's Done

1. ✅ **Supabase cleanup** - One clean SQL file ready
2. ✅ **Codebase fixes** - All issues resolved
3. ✅ **Git preparation** - Ready for your new repo

---

## 📋 What You Need to Do Now

### 1. Create GitHub Repository (5 minutes)

1. Go to: https://github.com/new
2. Repository name: `trove` (or your choice)
3. **DO NOT** check "Initialize with README"
4. Click "Create repository"
5. **Copy the repository URL** (e.g., `https://github.com/YOUR_USERNAME/trove.git`)

### 2. Get Supabase Credentials (10 minutes)

1. Go to: https://supabase.com
2. Sign up/Login
3. Click "New Project"
4. Fill in:
   - Name: `trove`
   - Database Password: (save this!)
   - Region: (choose closest)
5. Wait 2-3 minutes for setup
6. Go to: **Settings → API**
7. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### 3. Run Database Setup (2 minutes)

1. In Supabase Dashboard → **SQL Editor**
2. Click **"New Query"**
3. Open `supabase/setup_database.sql` in your project
4. **Copy entire file contents**
5. **Paste into SQL Editor**
6. Click **"Run"** (or Ctrl+Enter)
7. ✅ Done! Check "Table Editor" to verify tables were created

### 4. Set Up Git Remote

**Option A: Use PowerShell Script (Easiest)**

```powershell
# Run this in PowerShell (replace with your repo URL):
.\setup_new_repo.ps1 -RepoUrl "https://github.com/YOUR_USERNAME/trove.git"
```

**Option B: Manual Commands**

```powershell
# Update remote
git remote set-url origin https://github.com/YOUR_USERNAME/trove.git

# Switch to main branch
git checkout main

# Add all changes
git add .

# Commit
git commit -m "Initial commit - Trove setup"

# Push to your new repo
git push -u origin main
```

### 5. Configure Environment Variables

1. Create `.env.local` in project root:
   ```powershell
   New-Item -Path .env.local -ItemType File
   ```

2. Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. Save the file

### 6. Test Locally

```powershell
# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

Visit: **http://localhost:3000**

### 7. Create Storage Bucket

1. In Supabase Dashboard → **Storage**
2. Click **"Create a new bucket"**
3. Name: `books`
4. **Uncheck** "Public bucket" (keep it private)
5. Click **"Create bucket"**
6. See `supabase/STORAGE_POLICIES_GUIDE.md` for policies

---

## 🎯 Checklist

- [ ] GitHub repository created
- [ ] Supabase project created
- [ ] Database schema run (`setup_database.sql`)
- [ ] Storage bucket `books` created
- [ ] `.env.local` file created with credentials
- [ ] Git remote updated
- [ ] Code pushed to your repository
- [ ] Local test successful (`npm run dev`)

---

## 🆘 Need Help?

- **Git issues?** See `GIT_SETUP_OPTION_C.md`
- **Database issues?** See `supabase/README.md`
- **Storage setup?** See `supabase/STORAGE_POLICIES_GUIDE.md`
- **Full guide?** See `COMPLETE_SETUP_GUIDE.md`

---

## 🚀 Next: Deploy to Production

Once everything works locally:
1. Push code to GitHub
2. Deploy to Vercel (see `COMPLETE_SETUP_GUIDE.md` Step 8)
3. Update OAuth redirect URLs in Supabase
4. Your site is live! 🎉

---

**You're almost there!** Follow the steps above and you'll have a fully functional Trove website! 🎊

