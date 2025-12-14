# 🧪 Testing Checklist - Trove2

## ✅ Setup Complete
- [x] GitHub repository created
- [x] Supabase project created
- [x] Database schema run
- [x] Storage bucket created
- [x] Storage policies configured
- [x] Environment variables set

---

## 🚀 Test Locally

### Step 1: Start Development Server

```powershell
npm run dev
```

Visit: **http://localhost:3000**

---

## ✅ Test Each Feature

### 1. Authentication
- [ ] **Sign Up:**
  - Go to http://localhost:3000/signup
  - Create an account with email and password
  - Check email for confirmation link
  - Click confirmation link
  - Should redirect to dashboard

- [ ] **Sign In:**
  - Go to http://localhost:3000/login
  - Sign in with your credentials
  - Should redirect to dashboard

- [ ] **Sign Out:**
  - Click sign out (if available)
  - Should redirect to login page

### 2. Book Upload
- [ ] **Upload a Book:**
  - Go to Dashboard → Library
  - Click "Upload Book"
  - Select a PDF, EPUB, or TXT file
  - Upload should succeed
  - Book should appear in library
  - Cover image should display (or gradient)

### 3. Reading
- [ ] **Open a Book:**
  - Click on a book in your library
  - Reader should open
  - Book content should display

- [ ] **Navigation:**
  - Test page navigation (next/previous)
  - Test bookmarking
  - Test progress tracking

- [ ] **Reader Features:**
  - Theme toggle (light/dark/sepia)
  - Font size (if applicable)
  - Settings panel

### 4. Notes & Bookmarks
- [ ] **Create Note:**
  - While reading, create a note
  - Note should save
  - Check Notes page - note should appear

- [ ] **Add Bookmark:**
  - Add a bookmark while reading
  - Bookmark should save
  - Check Bookmarks page - bookmark should appear

### 5. Analytics & Dashboard
- [ ] **Dashboard Stats:**
  - Check reading streak
  - Check total minutes
  - Check books read count
  - Check daily goal progress

- [ ] **Charts:**
  - Reading time charts should display
  - Progress charts should work

- [ ] **Gamification:**
  - Check level progress
  - Check XP points
  - Check achievements (if any unlocked)

### 6. Settings
- [ ] **Update Profile:**
  - Go to Settings
  - Update username
  - Update full name
  - Update daily goal
  - Changes should save

---

## 🐛 Common Issues & Fixes

### Issue: "Invalid API key"
**Fix:**
- Check `.env.local` has correct Supabase credentials
- Restart dev server: `npm run dev`

### Issue: "Storage bucket not found"
**Fix:**
- Verify bucket named `books` exists in Supabase Storage
- Check storage policies are created

### Issue: "Upload fails"
**Fix:**
- Check storage policies allow INSERT
- Verify file size is under 50MB
- Check browser console for specific errors

### Issue: "Can't read book"
**Fix:**
- Check storage policies allow SELECT
- Verify file was uploaded successfully
- Check browser console for errors

### Issue: "Tables don't exist"
**Fix:**
- Run `supabase/setup_database.sql` again
- Check SQL Editor for any errors

---

## ✅ Success Criteria

Your setup is working if:
- ✅ You can sign up and sign in
- ✅ You can upload a book
- ✅ You can open and read a book
- ✅ You can create notes and bookmarks
- ✅ Dashboard shows your stats
- ✅ No errors in browser console

---

## 🎯 Next: Deploy to Production

Once everything works locally:
1. Push any remaining code changes
2. Deploy to Vercel (see `COMPLETE_SETUP_GUIDE.md`)
3. Update OAuth redirect URLs
4. Test production site

---

**Ready to test?** Run `npm run dev` and start testing! 🚀

