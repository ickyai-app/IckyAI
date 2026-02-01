# IckyAI - Sales Organization Dashboard

A modern, interactive sales dashboard built with Next.js, React, and Tailwind CSS. Designed to help organize leads, accounts, and follow-up activities with an integrated calendar system.

## Features

- 📅 **Interactive Calendar** - Daily, Weekly, and Monthly views with real-time tracking
- 👤 **Lead Management** - Add, edit, and track leads through your sales pipeline
- 🏢 **Account Management** - Manage client accounts and contact information
- 🎯 **Activity Tracking** - Schedule and track calls, emails, visits, quotes, and follow-ups
- 💾 **Local Storage** - All data persists in your browser
- 🎨 **Modern UI** - Built with Tailwind CSS and designed for productivity

## Tech Stack

- **Framework:** Next.js 14
- **UI:** React 18 + Tailwind CSS
- **Date Handling:** date-fns
- **Styling:** Tailwind CSS

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/yourusername/ickyai-net.git
cd ickyai-net
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Demo

**Demo Login:** Use any email and password to access the dashboard.

All data is stored locally in your browser's local storage.

## Project Structure

```
app/
├── components/
│   ├── Calendar.tsx          # Main calendar component with 3 view modes
│   ├── ActivityModal.tsx     # Modal for adding new activities
│   ├── Dashboard.tsx         # Main dashboard layout
│   ├── LeadsSection.tsx      # Leads management UI
│   ├── LeadModal.tsx         # Modal for adding/editing leads
│   ├── AccountsSection.tsx   # Accounts management UI
│   └── AccountModal.tsx      # Modal for adding/editing accounts
├── layout.tsx                # Root layout
├── page.tsx                  # Home page
└── globals.css              # Global styles
```

## Features Breakdown

### Calendar Views

- **Daily:** Hour-by-hour view with current time indicator
- **Weekly:** 7-day grid with hourly slots
- **Monthly:** Full month calendar with activity indicators

### Lead Pipeline

- **New** → **Contacted** → **Qualified** → **Proposal** → **Won/Lost**
- Color-coded status badges
- Quick edit/delete actions

### Activity Types

- ☎️ Call
- 📧 Email
- 👤 Visit
- 📄 Quote
- 🔔 Follow-up

## Future Enhancements

- [ ] Supabase integration for cloud sync
- [ ] User authentication
- [ ] Email notifications
- [ ] Activity analytics
- [ ] Export to CSV/PDF
- [ ] Mobile app
- [ ] Slack/Teams integration

## License

MIT

## Contact

For questions or feedback, reach out to your sales team.
