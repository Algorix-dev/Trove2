# 🚀 Quick Start Guide - Trove

## ⚡ Running Locally (3 Steps)

### Step 1: Open PowerShell/Terminal
Navigate to the Trove folder:
```powershell
cd C:\Users\DELL\Desktop\Trove
```

### Step 2: Start the Development Server
Run this command:
```powershell
npx next dev
```

### Step 3: Open Your Browser
Visit: **http://localhost:3000**

That's it! Your app is now running locally! 🎉

---

## 🌐 Deploy as a Live Website (Free)

### Option 1: Vercel (Easiest - 5 Minutes)

1. **Create Account**: Go to [vercel.com](https://vercel.com) and sign up (free)

2. **Install Vercel CLI**:
   ```powershell
   npm install -g vercel
   ```

3. **Login**:
   ```powershell
   vercel login
   ```

4. **Deploy**:
   ```powershell
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? **(select your account)**
   - Link to existing project? **N**
   - What's your project's name? **trove**
   - In which directory is your code located? **./**
   - Want to override settings? **N**

5. **Your Live URL**:
   After deployment, Vercel will give you a URL like:
   ```
   https://trove-abc123.vercel.app
   ```

6. **Deploy to Production**:
   ```powershell
   vercel --prod
   ```

### Option 2: GitHub + Vercel (Auto-Deploy)

1. **Push to GitHub**:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   # Create repo on GitHub first, then:
   git remote add origin https://github.com/YOUR_USERNAME/trove.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Done!** Every time you push to GitHub, it auto-deploys!

---

## 🔧 Before Deploying - Important!

### Fix Build Issues (Required)

The app uses Next.js 16 (beta) which has some issues. Downgrade to stable:

```powershell
npm install next@15.1.0 react@18 react-dom@18
```

Then test the build:
```powershell
npm run build
npm start
```

If successful, you're ready to deploy!

---

## 🎯 Recommended Workflow

1. ✅ **Test Locally**: `npx next dev` → Visit http://localhost:3000
2. ✅ **Fix Build**: `npm install next@15.1.0 react@18 react-dom@18`
3. ✅ **Test Build**: `npm run build && npm start`
4. ✅ **Deploy**: `vercel --prod`
5. ✅ **Get Live URL**: `https://your-project.vercel.app`

---

## 📱 Your Live Website URLs

After deployment, you'll have:

- **Development**: http://localhost:3000 (local only)
- **Production**: https://trove-[random].vercel.app (live on internet)
- **Custom Domain**: Add your own domain in Vercel settings (optional)

---

## 🆘 Troubleshooting

### "npm run dev" fails
Try: `npx next dev` instead

### Build fails
Run: `npm install next@15.1.0 react@18 react-dom@18`

### Port 3000 already in use
Run: `npx next dev -p 3001` (uses port 3001 instead)

---

## 🎉 You're All Set!

Your Trove app is ready to use locally and deploy to the web!

**Local**: http://localhost:3000  
**Live**: Deploy with `vercel --prod`
