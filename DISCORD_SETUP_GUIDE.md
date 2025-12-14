# 💬 Discord Integration - Complete Setup Guide

## 🎯 What This Guide Covers

This guide will help you:
1. Create a Discord application
2. Set up OAuth for user login
3. Create a Discord bot
4. Connect communities to Discord channels
5. Implement the code in your app

---

## 📋 Step 1: Create Discord Application

### 1.1 Go to Discord Developer Portal
1. Visit: https://discord.com/developers/applications
2. Log in with your Discord account
3. Click the green **"New Application"** button

### 1.2 Name Your Application
1. **Name:** Enter "Trove Community" (or any name you like)
2. Click **"Create"**

### 1.3 Note Your Application ID
- You'll see your **Application ID** at the top
- Copy this - you'll need it later
- It looks like: `123456789012345678`

---

## 🔐 Step 2: Set Up OAuth2 (For User Login)

### 2.1 Configure OAuth2
1. In your Discord app, click **"OAuth2"** in the left sidebar
2. You'll see **"Client ID"** and **"Client Secret"**

### 2.2 Add Redirect URL
1. Scroll down to **"Redirects"** section
2. Click **"Add Redirect"**
3. Enter your redirect URL:
   ```
   http://localhost:3000/auth/discord/callback
   ```
   **For production, also add:**
   ```
   https://yourdomain.com/auth/discord/callback
   ```
4. Click **"Save Changes"**

### 2.3 Copy Credentials
1. **Client ID:** Copy this (it's visible)
2. **Client Secret:** Click **"Reset Secret"** if needed, then copy it
   - ⚠️ **Important:** Copy the secret immediately - you can only see it once!

### 2.4 Select OAuth2 Scopes
1. Scroll to **"Scopes"** section
2. Select these scopes:
   - ✅ `identify` - Get user's basic info
   - ✅ `email` - Get user's email
   - ✅ `guilds` - Get user's servers (optional)

---

## 🤖 Step 3: Create Discord Bot

### 3.1 Create the Bot
1. Click **"Bot"** in the left sidebar
2. Click **"Add Bot"**
3. Click **"Yes, do it!"** to confirm

### 3.2 Get Bot Token
1. Under **"Token"**, click **"Reset Token"**
2. Click **"Yes, do it!"** to confirm
3. **Copy the token immediately!** (You can only see it once)
   - It looks like: `MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwLkFCLkMuRGVmZ2hpamtsbW5vcHFyc3R1dnd4eXo`

### 3.3 Configure Bot Settings
1. **Username:** Your bot's name (e.g., "Trove Bot")
2. **Icon:** Upload a bot icon (optional)
3. **Public Bot:** Toggle ON (must be public for OAuth to work!)
   - ⚠️ **Important:** For OAuth login to work, the bot MUST be public
   - Don't worry - it's still secure because only you can invite it
4. **Requires OAuth2 Code Grant:** Toggle OFF

### 3.4 Enable Privileged Gateway Intents
Scroll down to **"Privileged Gateway Intents"** and enable:
- ✅ **Server Members Intent** (needed to see server members)
- ✅ **Message Content Intent** (if you want the bot to read messages)

Click **"Save Changes"**

---

## 🔗 Step 4: Invite Bot to Your Discord Server

### 4.1 Generate Invite URL
1. Go to **"OAuth2"** → **"URL Generator"** in left sidebar
2. Under **"Scopes"**, select:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Under **"Bot Permissions"**, select:
   - ✅ **Manage Channels** (to create channels)
   - ✅ **Create Instant Invite** (to create invites)
   - ✅ **Send Messages** (to send messages)
   - ✅ **Read Message History** (to read messages)
   - ✅ **Embed Links** (to send rich messages)
   - ✅ **Attach Files** (optional)
   - ✅ **Read Messages/View Channels** (to see channels)

4. Scroll down - you'll see a **"Generated URL"**
5. **Copy this URL**

### 4.2 Invite Bot to Server
1. Open the copied URL in your browser
2. Select your Discord server from the dropdown
3. Click **"Authorize"**
4. Complete any CAPTCHA if prompted
5. Bot should now be in your server!

**⚠️ Important:** If you see "Private application cannot have a default authorization link":
- Go back to Bot settings
- Toggle **"Public Bot"** to **ON** (enabled)
- Save changes
- Then try the invite URL again

---

## 🆔 Step 5: Get Your Discord Server ID

### 5.1 Enable Developer Mode
1. Open Discord app
2. Go to **User Settings** (gear icon)
3. Go to **Advanced**
4. Enable **"Developer Mode"**

### 5.2 Get Server ID
1. Right-click on your Discord server name (in server list)
2. Click **"Copy Server ID"**
3. Save this ID - you'll need it

---

## 🔧 Step 6: Add Credentials to Your App

Add these to your `.env.local` file:

```env
# Discord OAuth2
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here
DISCORD_REDIRECT_URI=http://localhost:3000/auth/discord/callback

# Discord Bot
DISCORD_BOT_TOKEN=your_bot_token_here

# Discord Server (Guild)
DISCORD_GUILD_ID=your_server_id_here
```

**Replace:**
- `your_client_id_here` - Your OAuth2 Client ID
- `your_client_secret_here` - Your OAuth2 Client Secret
- `your_bot_token_here` - Your Bot Token
- `your_server_id_here` - Your Server ID

---

## 💻 Step 7: Install Discord Package

Run this command:

```bash
npm install discord.js
```

---

## 📝 Step 8: Implementation Code

I'll create the Discord integration code for you. Here's what you need:

### 8.1 Discord OAuth Route

Create: `app/auth/discord/route.ts`

```typescript
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const origin = request.url.split('/auth/discord')[0]

  if (!code) {
    // Redirect to Discord OAuth
    const discordAuthUrl = new URL('https://discord.com/api/oauth2/authorize')
    discordAuthUrl.searchParams.set('client_id', process.env.DISCORD_CLIENT_ID!)
    discordAuthUrl.searchParams.set('redirect_uri', process.env.DISCORD_REDIRECT_URI!)
    discordAuthUrl.searchParams.set('response_type', 'code')
    discordAuthUrl.searchParams.set('scope', 'identify email')
    
    return NextResponse.redirect(discordAuthUrl.toString())
  }

  // Exchange code for token
  try {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI!,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      return NextResponse.redirect(`${origin}/login?error=discord_auth_failed`)
    }

    // Get user info from Discord
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const discordUser = await userResponse.json()

    // Sign in or create user in Supabase
    const supabase = await createClient()
    
    // Check if user exists by email
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', discordUser.email)
      .single()

    if (existingUser) {
      // User exists - sign them in
      // You'll need to implement Supabase auth here
      return NextResponse.redirect(`${origin}/dashboard`)
    } else {
      // Create new user
      // You'll need to implement user creation here
      return NextResponse.redirect(`${origin}/onboarding`)
    }
  } catch (error) {
    console.error('Discord OAuth error:', error)
    return NextResponse.redirect(`${origin}/login?error=discord_auth_failed`)
  }
}
```

### 8.2 Discord Bot Service (For Auto Channels)

Create: `lib/discord/bot.ts`

```typescript
import { Client, GatewayIntentBits, ChannelType } from 'discord.js'

let discordClient: Client | null = null

export async function getDiscordClient(): Promise<Client> {
  if (discordClient) {
    return discordClient
  }

  discordClient = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
    ],
  })

  await discordClient.login(process.env.DISCORD_BOT_TOKEN)
  return discordClient
}

export async function createDiscordChannel(
  channelName: string,
  categoryId?: string
): Promise<string | null> {
  try {
    const client = await getDiscordClient()
    const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID!)

    const channel = await guild.channels.create({
      name: channelName.toLowerCase().replace(/\s+/g, '-'),
      type: ChannelType.GuildText,
      parent: categoryId,
    })

    return channel.id
  } catch (error) {
    console.error('Error creating Discord channel:', error)
    return null
  }
}
```

---

## ✅ Step 9: Test the Integration

### 9.1 Test OAuth Login
1. Start your dev server: `npm run dev`
2. Visit: `http://localhost:3000/auth/discord`
3. Should redirect to Discord login
4. After login, should redirect back to your app

### 9.2 Test Bot
1. Go to your Discord server
2. The bot should be online
3. Try creating a community in your app
4. Check if a Discord channel was created

---

## 🐛 Troubleshooting

### Problem: "Invalid redirect URI"
**Solution:**
- Make sure the redirect URI in Discord matches exactly what's in your `.env.local`
- Check for trailing slashes
- For localhost, use `http://` not `https://`

### Problem: "Bot not appearing in server"
**Solution:**
- Make sure you invited the bot using the generated URL
- Check that the bot has the correct permissions
- Verify the bot token is correct

### Problem: "OAuth flow not working"
**Solution:**
- Check that Client ID and Secret are correct
- Verify redirect URI is added in Discord dashboard
- Check browser console for errors

### Problem: "Bot can't create channels"
**Solution:**
- Make sure bot has "Manage Channels" permission
- Check that bot is in the server
- Verify bot token is correct

---

## 📚 Next Steps

After setup:
1. ✅ Test OAuth login
2. ✅ Test bot functionality
3. ✅ Integrate with community creation
4. ✅ Add Discord button to login page
5. ✅ Sync community members with Discord roles

---

## 🎯 Quick Checklist

- [ ] Created Discord application
- [ ] Got Client ID and Secret
- [ ] Added redirect URI
- [ ] Created Discord bot
- [ ] Got bot token
- [ ] Invited bot to server
- [ ] Got server ID
- [ ] Added all credentials to `.env.local`
- [ ] Installed `discord.js`
- [ ] Tested OAuth login
- [ ] Tested bot functionality

---

**Need help?** Check Discord.js docs: https://discord.js.org/

