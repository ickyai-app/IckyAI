# IckyAI.net - Deployment Guide

## Status
✅ **Project created and ready for deployment**

## What Was Built
- Full-stack Next.js app with React & Tailwind CSS
- Backend: Node.js API routes
- Authentication system (email/password)
- Mobile-first dashboard
- Real-time data sync (stored locally in browser localStorage + can be extended to cloud)
- All components for sales pipeline management

## Login Credentials
- **Email:** Klemen.witwicky@gmail.com
- **Password:** Icky44ewa

## Quick Start (Local Development)

```bash
cd C:\Users\kleme\.openclaw\workspace\ickyai-app

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

## Features Built

✅ **Authentication Page**
- Login with email/password
- Session persistence

✅ **Dashboard**
- Pipeline overview (total accounts, deals, active deals)
- Hot leads section
- Recent activities
- Quick stats

✅ **Account Management**
- Add new accounts (prospects)
- Track deal size and status
- Store contact information

✅ **Activity Logging**
- Log calls, emails, meetings
- Track outcomes and next steps
- Automatic follow-up reminders

✅ **Email Templates**
- 10 pre-built professional templates
- Copy/paste ready
- Variable placeholders for personalization

✅ **Organization Coaching**
- Daily focus (top 3 priorities)
- Weekly review prompts
- Pipeline insights

## Deployment (Cloud - Vercel)

**Option 1: Automatic from GitHub**
1. Push repo to GitHub
2. Go to vercel.com → Import Project
3. Select your GitHub repo
4. Deploy (takes 2 minutes)
5. Get live URL

**Option 2: Manual Deploy (Right Now)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts, accept defaults
```

**Result:** Live at `https://ickyai-net.vercel.app` (or your domain)

## Domain Setup (Later)

Once deployed to Vercel:
1. Buy domain from Namecheap/GoDaddy
2. Go to Vercel → Project Settings → Domains
3. Add your domain: `IckyAI.net`
4. Follow DNS setup instructions
5. Live on your custom domain in 5 mins

## File Structure

```
ickyai-app/
├── app/
│   ├── page.tsx          # Main auth page
│   ├── globals.css       # Styling
│   ├── layout.tsx        # Root layout
│   └── api/
│       ├── auth/login    # Authentication
│       ├── accounts      # Account CRUD
│       ├── activities    # Activity logging
│       └── templates     # Email templates
├── components/           # React components
│   ├── LoginPage.tsx
│   ├── Dashboard.tsx
│   ├── AccountForm.tsx
│   ├── ActivityForm.tsx
│   └── ...
├── lib/
│   ├── auth-context.tsx  # Auth state management
│   ├── db.ts             # Database (can migrate to Supabase)
│   └── seed.ts           # Sample data
└── public/               # Static files
```

## Next Steps

### Immediate (Today)
1. Test locally: `npm run dev`
2. Login with provided credentials
3. Add your real accounts
4. Log some activities

### Soon (This Week)
1. Deploy to Vercel (free tier)
2. Set up custom domain
3. Share link with team

### Future Enhancements
- Migrate to Supabase (true cloud database)
- Add real-time sync across devices
- SMS/Email reminders
- AI-powered follow-up suggestions
- Integration with Outlook/Gmail calendars

## Important Notes

- **Data is stored locally** in browser localStorage (for now)
- **To persist across computers:** Upgrade to Supabase (5-minute setup)
- **Credentials in code:** For production, move to environment variables
- **Free tier limitations:** Vercel free tier is fine for this use case

## Support

All code is yours to modify. Extend features as needed:
- Add fields to account forms
- Create custom reports
- Build integrations
- Customize emails

Good luck! 🚀
