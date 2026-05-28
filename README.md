# Hoang Learning OS

A local-first learning operating system for a Vietnamese IT student at HUSC. The app helps plan daily study work, protect GPA goals, track competitive programming practice, organize learning resources, and run weekly reviews from one focused dashboard.

## Features

- Dashboard overview for daily priorities
- Daily planner with GPA, CP, project, and roadmap lanes
- GPA recovery tracker and curriculum roadmap
- Exam-focused review workflow
- Competitive programming tracker
- Project and resource hub
- Weekly review workflow
- JSON backup/import
- `localStorage` persistence with key `hoang_learning_os_v1`

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Vite
- lucide-react

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production build is generated in `dist`.

## Deploy

Recommended deployment target: Vercel.

- Framework preset: Vite
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

## Data Safety

The app is local-first. Use the backup/export feature before clearing browser data or moving to another machine. Importing a backup replaces the current local app state.

## Product Rule

It thao tac, nhieu gia tri. Mo app len la biet hom nay can lam gi.
