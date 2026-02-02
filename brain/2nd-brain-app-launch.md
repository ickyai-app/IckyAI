# 2nd Brain App - Launch Document

**Built:** 2025-01-31 (Evening)  
**For:** Icky - Sales professional in Kranjska Gora  
**Status:** ✅ Ready to Use

## What Is It?

A beautiful, distraction-free knowledge management app for your daily journals, business concepts, and system documentation. Think Obsidian meets Linear - clean, dark, focused.

## Key Features

✨ **Beautiful UI**
- Dark theme optimized for long work sessions
- Sidebar navigation with instant search
- Responsive design (works on any screen)

📚 **Auto-Discovery**
- Reads all `.md` files from `brain/` folder
- No configuration needed
- Automatic date sorting (newest first)

🔍 **Powerful Search**
- Search by title or content
- Real-time filtering as you type
- Find anything instantly

📖 **Markdown Support**
- Syntax highlighting for code
- Formatted quotes and lists
- Clean typography for reading

🏷️ **Document Types**
- **Journals** - Daily logs (journal-YYYY-MM-DD.md)
- **Concepts** - Deep dives into ideas
- **System** - Technical documentation
- **Profiles** - Business/personal profiles
- Color-coded badges for quick scanning

## Quick Start

### 1. Install Dependencies
```bash
cd projects/second-brain
npm install
```
(Already done - just npm is ready)

### 2. Run Locally
```bash
npm run dev
```

### 3. Open Browser
Go to: **http://localhost:3000**

That's it! You should see your brain/ documents instantly.

## How It Works

1. **You (or AI) create documents** in `brain/` folder
2. **App discovers them automatically** (just `.md` files)
3. **Search or browse** in the sidebar
4. **Read with focus** in the main area
5. **Everything syncs** automatically (refresh to see new files)

## File Structure

```
workspace/
├── brain/
│   ├── journal-2025-01-31.md
│   ├── system-setup.md
│   ├── sales-organization-system.md
│   ├── icky-profile.md
│   ├── proactive-rules.md
│   └── [more files auto-discovered]
└── projects/
    └── second-brain/
        ├── app/
        │   ├── page.tsx (main UI)
        │   ├── layout.tsx (layout)
        │   ├── components/
        │   │   ├── DocumentList.tsx
        │   │   └── DocumentViewer.tsx
        │   └── api/
        │       └── documents/route.ts
        ├── lib/
        │   └── documents.ts (document service)
        └── package.json
```

## Design Philosophy

### Why Dark Mode?
- You work constantly (wake to sleep)
- Reduces eye strain
- Distraction-free focus environment
- Professional aesthetic

### Why Auto-Discovery?
- Perfect for proactive AI work at 11pm
- Drop files, they appear instantly
- Zero configuration overhead
- You just refresh the browser

### Why This Layout?
- **Sidebar (left):** Navigation and search
- **Main (right):** Reading focus
- Inspired by Obsidian + Linear
- Proven UX patterns

## Content Types

### Daily Journals
```markdown
# Daily Journal - January 31, 2025

## Overview
What happened today

## Accomplishments
- Thing 1
- Thing 2

## Learnings
- Insight 1
- Insight 2
```

### Concepts
```markdown
# Concept - Sales Organization

## The Idea
Core insight

## How It Works
Explanation

## Key Takeaways
- Point 1
- Point 2
```

### System Docs
```markdown
# System - Follow-up Tracking

## Overview
What this system does

## How to Use
Instructions

## Benefits
- Benefit 1
- Benefit 2
```

## Next Steps

1. **Try it out:** Run `npm run dev` and open http://localhost:3000
2. **Add documents:** Drop `.md` files in `brain/` folder
3. **Refresh browser:** New files appear instantly
4. **Explore:** Search, browse, get inspired

## Deployment (Optional)

When you want to share or deploy:
```bash
npm run build
```

Can deploy to Vercel, Netlify, or any static host.

## Tips & Tricks

### Naming for Better Organization
- Start with type: `journal-`, `concept-`, `system-`, `profile-`
- Add dates: `YYYY-MM-DD` format
- Use hyphens: `my-doc-name.md`

Example: `journal-2025-01-31.md`

### Search Tips
- Search entire content (not just titles)
- Case-insensitive matching
- As you type filtering

### Refresh When...
- You add new files to brain/ folder
- You want to see latest changes
- You switch windows

## Troubleshooting

**App shows "Loading..." forever**
- Restart dev server: Ctrl+C, then `npm run dev`
- Check brain/ folder exists

**No documents showing**
- Verify files are in `brain/` folder
- Check they end with `.md`
- Files in subfolders won't be found (yet)

**Search not working**
- Refresh browser (F5)
- Make sure files have content

## Built With ❤️

- **Next.js 16** - Modern React framework
- **Tailwind CSS** - Utility-first styling
- **React Markdown** - Markdown rendering
- **TypeScript** - Type safety

---

**You're now running the most beautiful personal knowledge base for a sales professional. 🚀**

Use it to:
- Track daily progress
- Store business insights
- Explore important concepts
- Stay organized and inspired

Everything is yours. No cloud. No tracking. Just clean, focused knowledge management.

Enjoy! 🧠✨
