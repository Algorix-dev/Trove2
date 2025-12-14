# 🔧 API Integration Alternatives & Solutions

## 📰 News API - Free Alternatives

### Problem
NewsAPI free tier doesn't work in production (requires payment for production use).

### ✅ Solution 1: Use Google News RSS (FREE, No API Key Needed)

**Advantages:**
- Completely free
- No API key required
- Works in production
- No rate limits
- Covers books, manga, anime news

**Implementation:**

Create a Supabase Edge Function or API route to fetch RSS feeds:

```typescript
// app/api/news/fetch-rss/route.ts
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Google News RSS feeds (free, no API key needed)
    const feeds = [
      'https://news.google.com/rss/search?q=books&hl=en&gl=US&ceid=US:en',
      'https://news.google.com/rss/search?q=manga&hl=en&gl=US&ceid=US:en',
      'https://news.google.com/rss/search?q=anime&hl=en&gl=US&ceid=US:en',
      'https://news.google.com/rss/search?q=book+releases&hl=en&gl=US&ceid=US:en'
    ]

    // Fetch and parse RSS (you'll need an RSS parser library)
    // npm install rss-parser
    const Parser = require('rss-parser')
    const parser = new Parser()
    
    const allNews = []
    for (const feed of feeds) {
      const feedData = await parser.parseURL(feed)
      allNews.push(...feedData.items)
    }

    // Store in database
    // ... save to book_news table

    return NextResponse.json({ success: true, news: allNews })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
```

**Install RSS parser:**
```bash
npm install rss-parser
```

### ✅ Solution 2: Use NewsAPI Free Tier (Development Only)

If you want to use NewsAPI for development/testing:

1. Use the API key you have
2. It will work on `localhost` (development)
3. For production, you have options:
   - Switch to Google News RSS (Solution 1)
   - Use a different free news API
   - Pay for NewsAPI production access

**Update your code to handle both:**

```typescript
// app/api/news/fetch/route.ts
const useNewsAPI = process.env.NODE_ENV === 'development' && process.env.NEWS_API_KEY

if (useNewsAPI) {
  // Use NewsAPI
} else {
  // Use Google News RSS (free, works in production)
}
```

### ✅ Solution 3: Manual News Curation

For a small site, you can manually add news:

1. Create an admin page to add news manually
2. Or use a simple form to submit news
3. Store directly in `book_news` table

---

## 💳 Stripe - Payment Alternatives

### Problem
Stripe doesn't support your country for registration.

### ✅ Solution 1: Use PayPal Personal Account (Works Too!)

**Advantages:**
- Available in 200+ countries
- Easy integration
- Personal account works for receiving payments
- Free to set up

**Steps:**

1. **Create PayPal Account:**
   - Go to https://www.paypal.com
   - Click **"Sign Up"** (top right)
   - Choose **"Personal Account"** (this works too!)
   - Complete signup and verify email

2. **Get API Credentials:**
   - Go to https://developer.paypal.com
   - Click **"Log in"** (use your PayPal account)
   - Click **"Create App"** or go to **"My Apps & Credentials"**
   - Create a new app
   - You'll get Client ID and Client Secret

2. **Install PayPal SDK:**
   ```bash
   npm install @paypal/checkout-server-sdk
   ```

3. **Update Marketplace Payment Code:**
   ```typescript
   // app/api/payments/create/route.ts
   import paypal from '@paypal/checkout-server-sdk'

   const environment = new paypal.core.SandboxEnvironment(
     process.env.PAYPAL_CLIENT_ID!,
     process.env.PAYPAL_CLIENT_SECRET!
   )
   const client = new paypal.core.PayPalHttpClient(environment)
   ```

4. **Add to .env.local:**
   ```env
   PAYPAL_CLIENT_ID=your_client_id
   PAYPAL_CLIENT_SECRET=your_client_secret
   PAYPAL_MODE=sandbox  # or 'live' for production
   ```

### ✅ Solution 2: Use Razorpay (If Available in Your Country)

**Available in:** India, UAE, Singapore, and more

1. Sign up at https://razorpay.com
2. Get API keys
3. Install: `npm install razorpay`
4. Integrate similar to Stripe

### ✅ Solution 3: Use Flutterwave (Africa & More)

**Available in:** Many African countries and more

1. Sign up at https://flutterwave.com
2. Get API keys
3. Install: `npm install flutterwave-node-v3`

### ✅ Solution 4: Marketplace Without Payments (For Now)

You can build the marketplace without payment integration:

1. **Manual Payment:**
   - Users contact each other
   - Pay outside the platform
   - Mark transaction as "paid" manually

2. **Escrow System (Later):**
   - Implement when you have a payment processor
   - Hold funds until delivery confirmed

3. **Free Listings Only:**
   - Focus on connecting buyers/sellers
   - No payment processing needed
   - Can add payments later

**Update marketplace to work without payments:**

```typescript
// Marketplace can work with "pending" status
// Users arrange payment outside platform
// Then mark as "paid" manually
```

---

## 💬 Discord Integration - Step-by-Step Guide

### What You Need to Do

### Step 1: Create Discord Application

1. Go to https://discord.com/developers/applications
2. Click **"New Application"**
3. **Name:** "Trove Community" (or your choice)
4. Click **"Create"**

### Step 2: Get OAuth Credentials

1. In your Discord app, go to **"OAuth2"** in left sidebar
2. Under **"Redirects"**, click **"Add Redirect"**
3. Add your redirect URL:
   ```
   http://localhost:3000/auth/discord/callback
   ```
   (For production, use your actual domain)

4. Copy these values:
   - **Client ID** (you'll see it at the top)
   - **Client Secret** (click "Reset Secret" if needed, copy it)

5. Add to `.env.local`:
   ```env
   DISCORD_CLIENT_ID=your_client_id_here
   DISCORD_CLIENT_SECRET=your_client_secret_here
   DISCORD_REDIRECT_URI=http://localhost:3000/auth/discord/callback
   ```

### Step 3: Create Discord Bot (Optional - for Auto Channels)

1. In your Discord app, go to **"Bot"** in left sidebar
2. Click **"Add Bot"**
3. Click **"Reset Token"** and copy the token
4. Add to `.env.local`:
   ```env
   DISCORD_BOT_TOKEN=your_bot_token_here
   ```

5. **Enable Bot Permissions:**
   - Under "Privileged Gateway Intents", enable:
     - ✅ Server Members Intent
     - ✅ Message Content Intent (if needed)

6. **Bot Permissions (OAuth2 URL Generator):**
   - Go to "OAuth2" → "URL Generator"
   - Select scopes: `bot`, `applications.commands`
   - Select bot permissions:
     - ✅ Manage Channels
     - ✅ Create Instant Invite
     - ✅ Send Messages
     - ✅ Read Message History

### Step 4: Invite Bot to Your Discord Server

1. Go to **"OAuth2"** → **"URL Generator"**
2. Select scopes: `bot`, `applications.commands`
3. Select permissions (as above)
4. Copy the generated URL
5. Open URL in browser
6. Select your Discord server
7. Authorize the bot

### Step 5: Get Your Discord Server (Guild) ID

1. Enable Developer Mode in Discord:
   - Discord Settings → Advanced → Developer Mode (ON)
2. Right-click your server name
3. Click **"Copy Server ID"**
4. Add to `.env.local`:
   ```env
   DISCORD_GUILD_ID=your_server_id_here
   ```

### Step 6: Implement Discord OAuth in Your App

I'll create the Discord OAuth integration code for you. Here's what you need:

**Create Discord OAuth route:**
```typescript
// app/auth/discord/route.ts
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    // Redirect to Discord OAuth
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URI!)}&response_type=code&scope=identify%20email`
    return NextResponse.redirect(discordAuthUrl)
  }

  // Exchange code for token
  // ... implement token exchange
}
```

### What Discord Integration Does

1. **OAuth Login:** Users can sign in with Discord
2. **Auto-Create Channels:** When users create communities, auto-create Discord channels
3. **Sync Members:** Sync community members with Discord roles
4. **Bridge Chat:** Optional - show Discord messages in your app

### Step 7: Test Discord Integration

1. Start your dev server: `npm run dev`
2. Visit: `http://localhost:3000/auth/discord`
3. Should redirect to Discord login
4. After login, redirects back with user info

---

## 🎯 Recommended Approach

### For News:
✅ **Use Google News RSS** (Solution 1)
- Free, works in production
- No API key needed
- No country restrictions

### For Payments:
✅ **Use PayPal** (Solution 1) OR **Build without payments first**
- PayPal works in most countries
- Or build marketplace as "contact seller" first
- Add payments later when you have a processor

### For Discord:
✅ **Follow Step-by-Step Guide Above**
- Create Discord app
- Get OAuth credentials
- Invite bot to server
- Implement OAuth flow

---

## 📝 Quick Setup Checklist

### News API (Google RSS):
- [ ] Install: `npm install rss-parser`
- [ ] Update `app/api/news/fetch/route.ts` to use RSS
- [ ] Test fetching news

### Payments (PayPal):
- [ ] Create PayPal business account
- [ ] Get API credentials
- [ ] Install: `npm install @paypal/checkout-server-sdk`
- [ ] Add PayPal credentials to `.env.local`
- [ ] Update payment routes

### Discord:
- [ ] Create Discord application
- [ ] Get Client ID and Secret
- [ ] Create Discord bot
- [ ] Invite bot to server
- [ ] Get Server ID
- [ ] Add all credentials to `.env.local`
- [ ] Implement OAuth flow

---

## 🚀 Next Steps

1. **Choose your alternatives** (recommendations above)
2. **Set up the services** (follow guides)
3. **Update environment variables**
4. **Test each integration**
5. **Deploy!**

---

**Need help implementing any of these?** Let me know which one and I'll create the code for you!

