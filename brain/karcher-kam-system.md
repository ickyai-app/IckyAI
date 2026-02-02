# Kärcher KAM System - Activity Tracking & Follow-Up

**Built for:** Icky - Key Account Manager  
**Purpose:** Track every activity + smart follow-ups that actually happen  
**Status:** Framework complete, ready to implement

---

## The Problem You're Solving

**Before:**
- Activities forgotten between contacts
- Unclear when/why to follow up
- Lost deals because timing slipped
- No visibility into your pipeline
- Hours wasted remembering what was said

**After:**
- Every activity logged (visit, call, quote sent)
- Automatic reminders for next actions
- Clear pipeline visibility
- Easy follow-up patterns
- Wake up knowing exactly what to do

---

## How It Works: The 3-Part System

### Part 1: ACCOUNT TRACKING
**Goal:** Know exactly where each account stands at any moment

**What to track:**
- Account name
- Contact person
- Last activity (date + type)
- Current status
- Next action needed
- Deal size / opportunity

**Why this matters:**
- When you need a quick overview: "Where are we with Facility XYZ?"
- Answer immediately from your tracker
- No guessing, no searching emails

### Part 2: ACTIVITY LOG
**Goal:** Log every interaction immediately

**What counts:**
- ✅ Phone call (5 min → log it)
- ✅ Site visit (on-site assessment)
- ✅ Quote sent (price proposal)
- ✅ Email sent (follow-up)
- ✅ Meeting scheduled
- ✅ Deal closed

**Why log immediately:**
- Memory fades fast
- Details matter for follow-ups
- Creates accountability
- Shows your daily effort

### Part 3: FOLLOW-UP RULES
**Goal:** Never miss a follow-up opportunity

**The rules:**
1. **Quote sent** → Follow up in 3 days
2. **Site visit** → Send summary + next steps within 24 hours
3. **No response for 1 week** → Gentle reminder call
4. **No response for 2 weeks** → "Checking in" email
5. **Deal stalled 1 month** → Strategy call needed
6. **Cold lead** → 1 touch per week

**Why these work:**
- 3 days: They've had time to review, perfect timing
- 24 hours: While memory fresh, shows professionalism
- 1 week: Not annoying, but active
- 2 weeks: Still interested? Gentle nudge
- 1 month: Do we keep pushing or move on?
- Weekly: Consistency = top of mind

---

## Daily Workflow

### MORNING (5 minutes)
1. **Check your calendar:** Any follow-ups due today?
2. **Check your "Action" list:** What needs doing?
3. **Priority:** Do 3 things today minimum

### DURING DAY (Ongoing)
1. **Make a call:** Log it immediately (10 seconds)
2. **Send email:** Note in tracker
3. **Visit scheduled:** Add to calendar
4. **Quote sent:** Mark date + expected follow-up date

### EVENING (5 minutes)
1. **Review day:** What did I do? (activities)
2. **Update statuses:** Where are accounts now?
3. **Tomorrow plan:** What 3 things tomorrow?

---

## The Tools

### Tool 1: Account Master List
**File:** `accounts-karcher.csv`

```
Account Name | Contact | Phone | Email | Last Activity | Last Activity Date | Status | Next Action | Deal Size | Notes
Facility ABC | John | 555-1234 | john@... | Call | 2025-01-31 | Negotiating | Send quote | €5,000 | Interested in floor cleaner
Building XYZ | Sarah | 555-5678 | sarah@... | Quote sent | 2025-01-28 | Awaiting response | Follow up call | €12,000 | Large facility, budget approved
...
```

**How to use:**
- Open in Excel/Google Sheets
- Update after each activity
- Sort by "Next Action" to see what's urgent
- Filter by "Status" for pipeline overview

### Tool 2: Activity Log
**File:** `activity-log-2025.csv`

```
Date | Time | Type | Account | Contact | Notes | Duration | Outcome | Next Step
2025-01-31 | 10:30 | Call | Facility ABC | John | Discussed floor cleaning needs | 15 min | Interested, sent quote | Follow up 2025-02-03
2025-01-31 | 14:00 | Email | Building XYZ | Sarah | Sent proposal + pricing | 5 min | Sent | Wait for response
2025-01-30 | 09:00 | Visit | Hotel DEF | Manager | Site assessment + demo | 45 min | Very interested | Send quote by 2025-02-02
...
```

**How to use:**
- Log at END of each activity (takes 1 minute)
- This becomes your evidence of work
- Shows patterns (when you're most productive, etc.)
- Great for monthly review

### Tool 3: Follow-Up Calendar
**File:** `follow-ups-due.md`

Shows ONLY what needs doing today/this week:

```
# Follow-ups Due

## TODAY (2025-02-01)
- [ ] Call Facility ABC - John (3 days after quote)
- [ ] Email Building GHI - Reminder

## THIS WEEK
- Mon: Call Facility ABC
- Wed: Email Building XYZ ("still interested?")
- Thu: Send quote to Hotel DEF
- Fri: Check on stalled deals

## NEXT WEEK
- Follow up on quote rejections
- Cold outreach (3 new accounts)
```

**How to use:**
- Check every morning
- This is your daily to-do list for sales
- Cross off as you complete
- Automatically updated by AI each night

### Tool 4: Email Templates
**File:** `email-templates.md`

Pre-written for common scenarios (saves time, improves consistency):

#### After Site Visit
```
Subject: [Account Name] - Proposal & Next Steps

Hi [Name],

Thanks for the time today to assess your facility. 

Based on what I saw, here's what I recommend:
[Key points from visit]

I'll have a formal quote to you by [DATE].

Looking forward to partnering with Kärcher.

Best,
Icky
```

#### 3-Day Quote Follow-Up
```
Subject: [Account] Quote Follow-Up

Hi [Name],

Following up on the quote I sent [DATE]. 

A few questions:
1. Do you have budget approved?
2. Timeline for implementation?
3. Any concerns I can address?

Happy to discuss by phone or in person.

Best,
Icky
```

#### The "Gentle Reminder"
```
Subject: Checking In - [Account]

Hi [Name],

Just wanted to circle back on our conversation from [DATE].

Still exploring options for [SOLUTION]?

Let me know if timing has changed or if I can help with anything.

Icky
```

### Tool 5: Call Prep Template
**File:** `call-prep.md`

Use this BEFORE every call (2 minutes of prep = better calls):

```
## Call Prep - [Account Name]

**Date/Time:** 
**Contact:** [Name, Phone, Email]
**Last Contact:** [When, what we discussed]

**Call Goals:**
1. [Primary goal]
2. [Secondary goal]
3. [Tertiary goal]

**Key Points to Cover:**
- Their need
- Our solution
- Timeline
- Budget

**Questions to Ask:**
1. 
2. 
3. 

**Decision Timeline:**
When do they need to decide by?

**Notes:**
```

### Tool 6: Account Status Legend
Clear statuses to know where every deal stands:

```
NEW - First contact made, exploring
QUALIFIED - They have a need we can solve
DEMO - Showed them what we can do
QUOTE SENT - Waiting for them to review
NEGOTIATING - Back & forth on terms/price
READY TO CLOSE - Just waiting on sign-off
CLOSED - They're a customer now
LOST - They chose someone else
STALLED - Haven't heard from them in weeks
ON HOLD - They want to wait until [date]
```

---

## Weekly Review (15 minutes)

Every Friday afternoon:

1. **How many activities this week?**
   - Calls made: [X]
   - Visits: [X]
   - Quotes sent: [X]
   - Emails: [X]
   - **Goal: 15-20 touches per week minimum**

2. **Pipeline status:**
   - How many accounts: [NEW/QUALIFIED/DEMO/QUOTE/NEGOTIATING/CLOSED]?
   - Any deals stalling?
   - Any quick wins available?

3. **Next week plan:**
   - 3 big accounts to focus on
   - 5 cold outreach calls
   - 2 follow-up meetings

4. **What worked this week?**
   - Best day for calls?
   - Best time for demos?
   - What message resonates?

---

## Monthly Review (30 minutes)

End of month:

1. **Total activities:** X visits, Y calls, Z quotes
2. **Deals closed:** €X in revenue
3. **Conversion rate:** Y% of quotes to close
4. **Average deal size:** €Z
5. **Pipeline value:** €[Total in negotiation/demo]

**Ask yourself:**
- What worked?
- What didn't?
- What's my biggest bottleneck?
- Do I need to adjust follow-up timing?

---

## Automation Opportunities

**What YOU do manually:**
- Make calls
- Visit accounts
- Send quotes
- Have conversations

**What AI can automate (11pm sessions):**
- Pull today's follow-ups → send you list
- Categorize activities → update statuses
- Send reminders for follow-ups
- Generate weekly reports
- Suggest next actions
- Identify stalled deals

**Result:** You focus on selling, AI handles tracking/organization.

---

## Quick Reference: Follow-Up Timing

Save this. Use it constantly.

```
ACTIVITY                    → FOLLOW-UP TIMING     → METHOD
Site Visit                  → 24 hours (send summary) → Email
Quote Sent                  → 3 days (check reaction) → Call
No Response (7 days)        → Gentle reminder → Call or Email
No Response (14 days)       → "Still interested?" → Email
No Response (21 days)       → Decision needed → Call
Deal Stalled (1 month)      → Strategy conversation → Phone
Lost Deal                   → "Stay in touch?" → Email
Closed Deal                 → Thank you + onboarding → Email
```

---

## Success Metrics

Track these to know if the system is working:

| Metric | Frequency | Target | Current |
|--------|-----------|--------|---------|
| Activities per week | Weekly | 15-20 | |
| Quote conversion rate | Monthly | 30-40% | |
| Average deal size | Monthly | €X | |
| Sales cycle length | Monthly | X days | |
| Follow-up adherence | Weekly | 95% | |
| Pipeline visibility | Daily | 100% (know every account) | |

---

## Getting Started

**Week 1:**
1. Create account list (all current prospects)
2. Add activity log
3. Define follow-up rules
4. Set up email templates

**Week 2:**
1. Start tracking activities daily
2. Begin following the follow-up rules
3. Weekly review every Friday

**Week 3+:**
1. System becomes automatic
2. You stop losing deals
3. You know exactly what to do each day
4. Pipeline becomes predictable

---

## Why This Works for Kärcher KAMs

✅ **Simple:** One spreadsheet + one email list  
✅ **Immediate:** No complex software needed  
✅ **Complete:** Covers the full sales cycle  
✅ **Scalable:** Works for 10 accounts or 100  
✅ **Measurable:** You can see your progress  
✅ **Automated:** AI handles tracking at night  

**Result:** You're the most organized KAM in your region. Deals don't slip. Follow-ups happen. Revenue grows. 🚀

