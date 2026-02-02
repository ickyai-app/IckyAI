# 🧠 2nd Brain - Knowledge Hub for Icky

Your personal knowledge management system combining the beauty of Obsidian with the clean organization of Linear.

## What Is This?

A beautiful NextJS app that reads all your documents from the `brain/` folder and displays them with:
- 📚 Document list with search
- 🔍 Full-text search across all documents
- 📝 Markdown rendering with syntax highlighting
- 🏷️ Document type badges (journals, concepts, system docs, etc.)
- 🌙 Dark mode (always on for deep work)
- 📱 Responsive design
- ⚡ Real-time document updates

## Features

### Document Types
- **Journals** - Daily logs and reflections (files with "journal" in name)
- **System** - Technical docs and system design (files with "system" in name)
- **Concepts** - Deep dives into ideas (files with "concept" in name)
- **Profile** - Personal/business profiles (files with "profile" in name)
- **Other** - Any other markdown files

### Search
Simply type in the search box - it searches both document titles and content across all files.

### Auto-Discovery
The app automatically finds all `.md` files in the `brain/` folder. Drop new files there and refresh the browser.

## Getting Started

### Prerequisites
- Node.js 18+ installed
- `brain/` folder at `C:\Users\kleme\.openclaw\workspace\brain\`

### Installation
```bash
cd projects/second-brain
npm install
```

### Running Locally
```bash
npm run dev
```

Then open: **http://localhost:3000**

### Building for Production
```bash
npm run build
npm start
```

## How It Works

1. **Document Service** (`lib/documents.ts`)
   - Reads markdown files from brain/ folder
   - Extracts metadata (date, type, title)
   - Sorts by date (newest first)

2. **API Route** (`app/api/documents/route.ts`)
   - Provides `/api/documents` endpoint
   - Returns all documents as JSON

3. **UI Components**
   - `DocumentList.tsx` - Sidebar with document list and search
   - `DocumentViewer.tsx` - Main content area with markdown rendering
   - `page.tsx` - Layout and logic

4. **Styling**
   - Tailwind CSS with dark theme
   - Custom prose styling for markdown

## Document Format

Documents should be markdown files in the `brain/` folder:

```markdown
# Document Title

Your content here...

## Section

- Bullet points
- Work great

> Quotes are formatted nicely
```

### Naming Convention
- `journal-2025-01-31.md` - Daily journals
- `concept-[name].md` - Concept explorations
- `system-[name].md` - System documentation
- `profile-[name].md` - Profiles

The date in the filename helps with sorting. Format: `YYYY-MM-DD`

## Design Decisions

### Dark Mode Default
- Icky works constantly (wake to sleep)
- Dark mode reduces eye strain for long sessions
- Professional, distraction-free environment

### Sidebar + Main Layout
- Left sidebar: Quick navigation and search
- Right main area: Full focus on reading
- Similar to Obsidian and Linear UX patterns

### Auto-Discovery
- No configuration needed
- Drop files in brain/ folder
- Refresh browser to see them
- Perfect for proactive work at 11pm!

### Markdown Rendering
- Native React Markdown component
- Custom styling for code blocks, quotes, links
- Clean typography for reading

## Workflow

1. **AI creates documents** in `brain/` folder (nightly sessions)
2. **You check the app** in the morning
3. **Search and read** through your knowledge base
4. **Find insights** from daily journals and concepts
5. **Stay organized** with automatic categorization

## Future Enhancements

Possible additions (MVP doesn't need these):
- Tagging system
- Custom filtering
- Export to PDF
- Full-text index for faster search
- Dark/light mode toggle
- Backlinks between documents
- Word count analytics

## Troubleshooting

### App doesn't show any documents
- Check that files exist in `brain/` folder
- Files must have `.md` extension
- Restart the development server

### Search isn't working
- Make sure files are in `brain/` folder (not subdirectories)
- Try refreshing the browser

### Styling looks weird
- Clear browser cache: Ctrl+Shift+Delete
- Restart dev server: `npm run dev`

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Markdown:** React Markdown
- **Language:** TypeScript
- **Runtime:** Node.js (file system access)

## Deployment

To deploy this publicly:

1. Build: `npm run build`
2. Deploy to Vercel:
   ```bash
   npm install -g vercel
   vercel
   ```

Note: Public deployment needs to exclude the `brain/` folder with sensitive data.

---

**Built for Icky** - Your personal knowledge hub. 🚀
