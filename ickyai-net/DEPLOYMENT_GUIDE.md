# IckyAI.net Deployment Guide

Complete step-by-step guide to deploy IckyAI.net to the cloud with custom domain.

## Overview

This guide covers:
1. Setting up Supabase database
2. Configuring Vercel for deployment
3. Registering the IckyAI.net domain
4. Connecting domain to Vercel
5. Creating the admin user

## Step 1: Create Supabase Database

### 1.1 Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click **Start your project**
3. Sign up with email or GitHub
4. Create a new organization if needed

### 1.2 Create a New Project

1. Click **New Project** in your dashboard
2. Project name: `ickyai-net`
3. Database password: Choose a strong password (save it!)
4. Region: Europe (closest to your location)
5. Pricing plan: **Free** (perfect for starting)
6. Click **Create new project** and wait for setup (takes 1-2 minutes)

### 1.3 Get API Keys

1. Go to **Settings** → **API**
2. Copy and save these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** (under Project API keys) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 1.4 Create Database Tables

1. In Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste this complete SQL:

```sql
-- Create accounts table
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  status VARCHAR(50) DEFAULT 'NEW',
  deal_size DECIMAL(10,2),
  notes TEXT,
  last_activity DATE,
  next_action VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create activities table
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE NOT NULL,
  account_name VARCHAR(255),
  activity_type VARCHAR(50) NOT NULL,
  notes TEXT,
  duration_minutes INT,
  outcome VARCHAR(255),
  next_step VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for accounts table
CREATE POLICY "Users can view their own accounts"
  ON accounts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own accounts"
  ON accounts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own accounts"
  ON accounts
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own accounts"
  ON accounts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS Policies for activities table
CREATE POLICY "Users can view their own activities"
  ON activities
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities"
  ON activities
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities"
  ON activities
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activities"
  ON activities
  FOR DELETE
  USING (auth.uid() = user_id);
```

4. Click **Run** button
5. You should see "Success. No rows returned" - Perfect! ✅

### 1.5 Create Admin User

1. In Supabase, click **Auth** in the left sidebar
2. Click **Users** tab
3. Click **Invite** button
4. Enter:
   - Email: `Klemen.witwicky@gmail.com`
   - Password: `Icky44ewa` (check "Auto generate password" or type this)
5. Click **Send invite** or **Create user**

You should see the user created in the users list.

## Step 2: Prepare Application for Deployment

### 2.1 Create GitHub Repository

1. Go to [github.com](https://github.com) and log in
2. Click **+** → **New repository**
3. Repository name: `ickyai-net`
4. Description: `Cloud-synced sales organization platform`
5. Make it **Public** (required for Vercel free tier)
6. Click **Create repository**

### 2.2 Push Code to GitHub

In the ickyai-net directory, run:

```bash
git init
git add .
git commit -m "Initial commit: IckyAI.net application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ickyai-net.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### 2.3 Verify Files

Make sure these files are in the repository:
- `package.json` ✅
- `next.config.js` ✅
- `tailwind.config.js` ✅
- `app/page.jsx` ✅
- `components/` folder with all components ✅
- `lib/supabaseClient.js` ✅

## Step 3: Deploy to Vercel

### 3.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up**
3. Choose **Continue with GitHub**
4. Authorize Vercel to access your GitHub account

### 3.2 Import Project

1. Click **Add New Project**
2. Select your GitHub repository `ickyai-net`
3. Click **Import**

### 3.3 Configure Environment Variables

1. In the **Configure Project** section, click **Environment Variables**
2. Add these variables:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NEXT_PUBLIC_API_URL` | `https://ickyai.net` |

3. Click **Deploy**

### 3.4 Wait for Deployment

- Vercel will build and deploy your app
- This takes 2-3 minutes
- You'll see a "Deployment Successful" message
- You'll get a temporary URL like `https://ickyai-net.vercel.app`

### 3.5 Test the Deployment

1. Click the URL or go to the temporary domain
2. Login with:
   - Email: `Klemen.witwicky@gmail.com`
   - Password: `Icky44ewa`
3. You should see the dashboard ✅

## Step 4: Register & Connect Custom Domain

### 4.1 Register IckyAI.net Domain

Option A: **Register through Vercel** (Easiest)
1. In Vercel project settings, click **Domains**
2. Click **Add**
3. Enter `ickyai.net`
4. Click **Buy**
5. Complete the purchase
6. Vercel will automatically configure DNS

Option B: **Register elsewhere** (Namecheap, GoDaddy, etc.)
1. Go to your domain registrar
2. Register `IckyAI.net` (around €10-15/year)
3. Save your domain registrar login info

### 4.2 Connect Custom Domain to Vercel

If you registered elsewhere:

1. In Vercel, go to your project **Settings** → **Domains**
2. Click **Add**
3. Enter `ickyai.net`
4. Click **Add Domain**
5. Vercel will show you the nameservers:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
   - `ns3.vercel-dns.com`
   - `ns4.vercel-dns.com`

6. Go to your domain registrar (Namecheap, GoDaddy, etc.)
7. Update nameservers to Vercel's nameservers
8. Wait 24-48 hours for DNS propagation

### 4.3 Verify Domain Connection

1. In Vercel dashboard, check the domain status (should show "Valid Configuration")
2. Wait for SSL certificate (automatic, takes a few minutes)
3. Visit `https://ickyai.net` in your browser
4. Should redirect to your app ✅

## Step 5: Verify Everything Works

### ✅ Checklist Before Going Live

- [ ] Database tables created in Supabase
- [ ] Admin user created in Supabase Auth
- [ ] App deployed on Vercel
- [ ] Environment variables configured
- [ ] Can login to app from phone and computer
- [ ] Dashboard loads without errors
- [ ] Can add account and activity
- [ ] Pipeline dashboard shows data
- [ ] Email templates are visible
- [ ] Coaching tools display correctly
- [ ] Custom domain (ickyai.net) works
- [ ] SSL certificate installed (green padlock)

## Access Instructions

### From Computer
1. Open browser
2. Go to `https://ickyai.net`
3. Login with credentials
4. Dashboard loads

### From Phone
1. Open any browser (Chrome, Safari, etc.)
2. Go to `https://ickyai.net`
3. Bookmark the site
4. Can add to home screen for app-like experience

### Mobile App-Like Experience (Optional)
iOS:
1. Open Safari
2. Go to `ickyai.net`
3. Tap Share → Add to Home Screen
4. Creates a shortcut that opens like an app

Android:
1. Open Chrome
2. Go to `ickyai.net`
3. Tap ⋮ (menu) → Add to Home Screen
4. Creates a shortcut that opens like an app

## Troubleshooting

### Domain not working (404 error)
- Check DNS propagation: `dns.google.com`
- Wait 24-48 hours for changes to propagate
- Verify nameservers match Vercel's

### Login not working
- Check Supabase user exists in Auth panel
- Verify email and password exactly
- Clear browser cache
- Try incognito/private window

### No data showing
- Check RLS policies are created
- Verify auth token (check browser console)
- Confirm user_id matches authenticated user

### Deployment failed
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Make sure all files were pushed to GitHub
- Check `package.json` has all dependencies

## Support

If you need help:
1. Check Vercel deployment logs
2. Check Supabase error messages
3. Review browser console for errors (F12)
4. Check network tab for failed requests

## Next Steps

After deployment:
1. Invite team members to Supabase
2. Create additional users for teammates
3. Start adding accounts and activities
4. Set up calendar reminders for follow-ups
5. Configure email notifications (future feature)

## Quick Links

- **IckyAI.net Dashboard:** https://ickyai.net
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Console:** https://app.supabase.com
- **GitHub Repository:** https://github.com/your-username/ickyai-net

---

**✅ Congratulations! IckyAI.net is now deployed and ready to use! 🚀**
