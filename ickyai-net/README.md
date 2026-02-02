# IckyAI.net - Cloud-Synced Sales Organization Platform

A modern, mobile-first web application for sales professionals to manage their pipeline, track activities, and stay organized with smart follow-up reminders and coaching tools.

## Features

✨ **Core Features:**
- 📊 Real-time pipeline dashboard with status breakdown
- 👥 Account management with quick data entry
- 📝 Activity logging (calls, emails, visits, demos)
- ⏰ Automated follow-up reminders based on smart rules
- 📧 Email template library (10 ready-to-use templates)
- 🎯 Organization coaching with daily focus, weekly reviews, and activity insights
- 📱 Mobile-first, responsive design optimized for phones
- ☁️ Cloud-synced data via Supabase (PostgreSQL)
- 🔐 Secure authentication with email/password

## Tech Stack

- **Frontend:** React 18, Next.js 14, Tailwind CSS
- **Backend:** Next.js API Routes (serverless)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Hosting:** Vercel
- **Additional:** date-fns, react-icons

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- A Supabase account (free tier available at supabase.com)

### 1. Install Dependencies

```bash
cd ickyai-net
npm install
```

### 2. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → API to get your:
   - `NEXT_PUBLIC_SUPABASE_URL` (Project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon public key)

### 3. Create Database Tables

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Accounts Table
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  account_name VARCHAR NOT NULL,
  contact_name VARCHAR,
  email VARCHAR,
  phone VARCHAR,
  status VARCHAR DEFAULT 'NEW',
  deal_size DECIMAL(10,2),
  notes TEXT,
  last_activity DATE,
  next_action VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Activities Table
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  account_id UUID REFERENCES accounts NOT NULL,
  account_name VARCHAR,
  activity_type VARCHAR NOT NULL,
  notes TEXT,
  duration_minutes INT,
  outcome VARCHAR,
  next_step VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view their own accounts"
  ON accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own accounts"
  ON accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own accounts"
  ON accounts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own activities"
  ON activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities"
  ON activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### 4. Configure Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 5. Create Admin User

1. In Supabase, go to **Auth → Users**
2. Click **Add User** and create:
   - Email: `Klemen.witwicky@gmail.com`
   - Password: `Icky44ewa`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and login with the demo credentials.

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/ickyai-net.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **New Project**
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**

### 3. Custom Domain

1. In Vercel dashboard, go to **Settings → Domains**
2. Add `IckyAI.net` as your custom domain
3. Update your domain registrar's nameservers to point to Vercel

## Access from Phone & Computer

### Mobile Access
- Open browser on your phone
- Navigate to `https://IckyAI.net`
- Bookmark for quick access
- App is fully responsive and mobile-optimized

### Computer Access
- Open any web browser
- Go to `https://IckyAI.net`
- Login with your credentials

### Offline Features (Coming Soon)
- Download data for offline access
- Sync when reconnected

## Admin Credentials

```
Email: Klemen.witwicky@gmail.com
Password: Icky44ewa
```

## Dashboard Sections

### 📊 Pipeline Overview
- Real-time KPIs (total accounts, pipeline value, closed deals, weekly activities)
- Pipeline breakdown by status
- Recent accounts table

### 👥 Accounts
- Add new accounts with quick form
- Track contact info, status, deal size
- View all accounts list
- Edit account details

### 📝 Activities
- Log calls, emails, site visits, demos
- Track duration, outcomes, and next steps
- Activity summary for the week

### ⏰ Follow-up Reminders
- Smart follow-up rules engine
- Today's follow-ups
- Weekly follow-up schedule
- Best practices guide

### 📧 Email Templates
- 10 ready-to-use templates
- Copy and customize
- Templates for every stage of the sales cycle

### 🎯 Coaching Tools
- Daily focus and priorities
- Weekly review and analysis
- Smart insights and recommendations
- Goals tracking and progress

## Follow-Up Rules

The system automatically tracks when follow-ups are due based on these rules:

1. **Quote Follow-up** - Call 3 days after sending quote
2. **Site Visit Summary** - Email 1 day after site visit
3. **Initial Response Check** - Call/Email 7 days after no response
4. **Second Reminder** - Email 14 days after no response
5. **Deal at Risk** - Call 21 days after no response
6. **Cold Lead Nurture** - Call 3 days after initial contact
7. **Stalled Deal Recovery** - Call after 30 days of no activity

## Success Metrics Tracked

- Activities per week (Target: 15)
- Quote-to-close conversion rate (Target: 30%)
- Follow-up adherence (Target: 95%)
- Average sales cycle length (Target: 45 days)
- Pipeline value by status
- Monthly revenue progress

## Support & Troubleshooting

### Login Issues
- Verify email and password are correct
- Check that user was created in Supabase Auth
- Clear browser cache and try again

### Data Not Showing
- Ensure RLS policies are properly configured
- Check that user_id matches authenticated user
- Verify database connection in environment variables

### Deployment Issues
- Double-check environment variables in Vercel
- Verify Supabase project is active
- Check build logs in Vercel dashboard

## File Structure

```
ickyai-net/
├── app/
│   ├── layout.jsx          # Root layout
│   ├── page.jsx            # Login & dashboard router
│   └── globals.css         # Tailwind styles
├── components/
│   ├── LoginPage.jsx       # Login form
│   ├── Dashboard.jsx       # Main dashboard
│   ├── Sidebar.jsx         # Navigation sidebar
│   ├── PipelineOverview.jsx
│   ├── AccountsForm.jsx
│   ├── ActivitiesForm.jsx
│   ├── FollowUpReminders.jsx
│   ├── EmailTemplates.jsx
│   └── CoachingTools.jsx
├── lib/
│   └── supabaseClient.js   # Supabase initialization
├── package.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Future Enhancements

- 📱 Native mobile app (React Native)
- 📊 Advanced analytics and reporting
- 🤖 AI-powered lead scoring
- 📧 Email integration (Gmail, Outlook)
- 🔔 Real-time notifications
- 📞 Call recording integration
- 🗂️ Team collaboration features
- 📤 Import/export (CSV, Excel)
- 🎨 Custom branding
- 🔄 CRM integrations

## License

MIT

## Contact

Built for Icky Kärcher Sales Organization

---

**Happy selling! 🚀**
