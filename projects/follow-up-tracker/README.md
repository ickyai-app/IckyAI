# Kärcher Sales Follow-Up Tracker

**Purpose:** Automated system to track activities, manage follow-ups, and monitor your sales pipeline.

**How it works:**
1. Log activities in `accounts.csv` and `activities.csv`
2. Run the tracker script → get today's follow-ups
3. Use the dashboard to see your pipeline status
4. Follow-up rules automatically tell you what to do next

## Quick Start

### 1. Add Your Accounts
Edit `accounts.csv` and add all your current prospects:
```
Account Name, Contact, Phone, Email, Last Activity, Last Activity Date, Status, Next Action, Deal Size, Notes
```

### 2. Log Your Activities
After each activity (call, visit, email), add one line to `activities.csv`:
```
Date, Time, Type, Account, Contact, Notes, Duration, Outcome, Next Step, Follow-up Date
```

### 3. Get Today's Follow-ups
Run the tracker:
```bash
node follow-up-tracker.js
```

Output shows:
- ✅ Today's due follow-ups
- 📅 This week's follow-ups
- 🎯 Your pipeline summary

### 4. View Your Dashboard
Open `dashboard.html` in your browser:
```bash
# Windows
start dashboard.html

# Mac
open dashboard.html

# Linux
xdg-open dashboard.html
```

Dashboard shows:
- 📊 Pipeline breakdown (by status)
- 📞 Activities this week
- 🔥 Hot leads requiring action
- ⏰ Follow-up schedule

## Files

- `accounts.csv` - Master list of all accounts + status
- `activities.csv` - Log of every call, email, visit
- `follow-up-rules.json` - When/how to follow up
- `follow-up-tracker.js` - Script to find today's follow-ups
- `dashboard.html` - Visual pipeline tracker
- `email-templates.txt` - Copy-paste ready templates

## Daily Routine (5 minutes)

### Morning
1. Run `node follow-up-tracker.js`
2. See today's follow-ups
3. Add to your calendar
4. Do them! (most important part)

### After Each Activity
1. Open `activities.csv`
2. Add one line with what you did
3. Update the account status in `accounts.csv`
4. Takes ~30 seconds

### Evening
1. Review what you did
2. Plan tomorrow

## Success Metrics

The system tracks:
- How many activities per week
- Quote-to-close conversion rate
- Average deal size
- Sales cycle length
- How well you follow up

Check `dashboard.html` to see your progress.

## Why It Works

✅ **Simple** - Just CSV files, no complex software  
✅ **Immediate** - Use it today  
✅ **Automatic** - Tracker finds what needs doing  
✅ **Visible** - Dashboard shows progress  
✅ **Scalable** - Works for 10 or 100 accounts  

## Tips

- **Consistency is key** - Log activities immediately, don't wait
- **Be specific** - Details in notes help with follow-ups
- **Trust the rules** - Follow the automatic suggestions
- **Weekly review** - Check dashboard Friday afternoon
- **Monthly analysis** - See what's working, adjust if needed

---

**Created:** January 31, 2025  
**For:** Icky (Kärcher Key Account Manager)  
**System:** Automated Sales Organization + AI Follow-up Intelligence
