# System Setup

**Created:** 2025-01-31  
**Status:** In Progress

## Overview
Setting up a comprehensive AI assistant system with three main components:

### 1. Morning Brief (8am Daily)
Automated daily brief including:
- Local weather forecast
- Trending YouTube videos (based on interests)
- Today's tasks from todo.md
- Proactive task suggestions
- Trending news stories
- Productivity recommendations

### 2. Proactive Coding Assistant (11pm Daily)
Nightly work sessions to:
- Monitor business and codebase
- Build features and improvements
- Fix bugs and optimize workflows
- Create PRs for review (never push live)
- Document all work in brain/ folder

Goal: Wake up every morning to completed, tested work ready for review.

### 3. 2nd Brain App
NextJS document viewer combining Obsidian + Linear aesthetics:
- Reads from brain/ folder
- Beautiful document viewer
- Automatic daily journals
- Concept exploration documents
- Technical documentation

## Technical Details

### Cron Jobs
- Morning Brief: `0 8 * * *` (Europe/Ljubljana)
- Nightly Coding: `0 23 * * *` (Europe/Ljubljana)

### Folder Structure
```
workspace/
├── brain/          # 2nd brain documents
├── memory/         # Daily memory logs
├── projects/       # Business projects
└── todo.md         # Task tracking
```

## Next Steps
1. Gather user details (name, interests, business domain)
2. Build 2nd brain NextJS app
3. Start daily journaling
4. Begin proactive monitoring and development

## Philosophy
Be proactive, not reactive. Don't wait for instructions - identify opportunities, build solutions, document learning. Earn trust through competence.
