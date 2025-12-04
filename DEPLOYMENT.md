# 🚀 Trove Deployment Guide

## 🖥️ Running Locally

### Quick Start

1. **Open Terminal** in the Trove directory:
   ```bash
   cd C:\Users\DELL\Desktop\Trove
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and visit:
   ```
   http://localhost:3000
   ```

That's it! The app should now be running locally.

---

## 🌐 Deploy to Vercel (Recommended - Free & Easy)

Vercel is the easiest way to deploy Next.js apps and offers a generous free tier.

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Create a Vercel account**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub, GitLab, or Bitbucket

2. **Push your code to GitHub**:
   ```bash
   # Initialize git (if not already done)
   git init
   git add .
   git commit -m "Initial commit"
   
   # Create a new repository on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/trove.git
   git push -u origin main
   ```

3. **Import to Vercel**:
   - Click "Add New Project" in Vercel dashboard
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

4. **Add Environment Variables** (in Vercel dashboard):
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
     ```

5. **Your site is live!**
   - Vercel will give you a URL like: `https://trove-xyz.vercel.app`
   - Every push to GitHub will auto-deploy

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow the prompts, then your site is live!
```

---

## 🔧 Before Deploying - Fix Build Issues

The app currently has build issues with Next.js 16. Here's how to fix:

### Option A: Downgrade to Next.js 15 (Recommended)

```bash
npm install next@15.1.0 react@18 react-dom@18 --save
npm run build
```

### Option B: Wait for Next.js 16 Stable

Next.js 16 is still in RC. Wait for the stable release or use dev mode only.

---

## 🎨 Alternative Deployment Options

### Deploy to Netlify

1. **Create Netlify account**: [netlify.com](https://netlify.com)
2. **Connect GitHub repository**
3. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. **Add environment variables** in Netlify dashboard
5. **Deploy!**

### Deploy to Railway

1. **Create Railway account**: [railway.app](https://railway.app)
2. **New Project → Deploy from GitHub**
3. **Add environment variables**
4. **Deploy automatically**

### Deploy to Your Own Server (VPS)

```bash
# On your server
git clone your-repo
cd trove
npm install
npm run build
npm start

# Use PM2 to keep it running
npm install -g pm2
pm2 start npm --name "trove" -- start
pm2 save
pm2 startup
```

---

## 📝 Pre-Deployment Checklist

- [ ] Fix build issues (downgrade Next.js or wait for stable)
- [ ] Set up Supabase project
- [ ] Add environment variables
- [ ] Test locally with `npm run build && npm start`
- [ ] Push code to GitHub
- [ ] Deploy to Vercel/Netlify
- [ ] Test live site
- [ ] Set up custom domain (optional)

---

## 🔗 Your Live URLs

After deployment, you'll get:

- **Vercel**: `https://your-project.vercel.app`
- **Netlify**: `https://your-project.netlify.app`
- **Railway**: `https://your-project.up.railway.app`

You can add a custom domain in the platform settings!

---

## ⚡ Quick Deploy Commands

```bash
# Fix build first
npm install next@15.1.0 react@18 react-dom@18

# Test build locally
npm run build
npm start

# Deploy to Vercel
npx vercel --prod

# Or push to GitHub and let Vercel auto-deploy
git add .
git commit -m "Ready for deployment"
git push
```

---

## 🆘 Troubleshooting

### Build fails on Vercel
- Check build logs in Vercel dashboard
- Ensure Next.js 15 is installed
- Verify environment variables are set

### Site loads but features don't work
- Check browser console for errors
- Verify Supabase credentials
- Check API routes are working

### Styles not loading
- Clear Vercel cache and redeploy
- Check Tailwind config is correct

---

## 🎯 Recommended: Start Here

1. **Run locally first**: `npm run dev` → Visit `http://localhost:3000`
2. **Fix build**: `npm install next@15.1.0 react@18 react-dom@18`
3. **Test build**: `npm run build && npm start`
4. **Deploy to Vercel**: Push to GitHub → Import to Vercel
5. **Done!** 🎉

Your live site will be at: `https://your-project.vercel.app`
