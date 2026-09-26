# PRD — Himesh Soni Portfolio ("HimeshOS — Two Worlds Edition")

## Original Problem Statement (current, v4)
Two distinct worlds with one story:
- **World 1 — Modern cinematic portfolio (kept as designed)**: Vista-inspired boot ("Starting...") → Vista login (Himesh Soni · Welcome) → bright modern scrolling portfolio: Hero → About Me → "Things I've Built" (projects) → "Things I'm Investigating" (research). Clicking cards opens floating Aero windows.
- **The Transition**: after Research, a cinematic doorway — the page darkens, content fades, a light-bloom flash, "WELCOME TO HIMESH'S COMPUTER".
- **World 2 — Windows 7 + Frutiger Aero computer**: the viewport becomes Himesh's desktop (the supplied green-hills wallpaper). Full file-system metaphor: Desktop → Folder → File → Application. Working taskbar (Start orb, live taskbar buttons, tray: volume/network/day-night toggle/clock/exit), Start menu (Himesh Soni header, searchable apps, Settings, Back to Portfolio), desktop right-click menu, draggable/minimizable/maximizable Aero windows with z-focus.
- World 2 apps: Computer + Explorer folders (Things I've Built → AI & ML / Software / Hardware & Simulation / Creative → project files → project app windows; Things I'm Investigating → research docs → Research Lab with sidebar + document pane + QKD diagram; Experiments → Pixelator app slot / Water Bottle sim / notes; Pictures → Photography + Film folders with thumbnails/details/icons views → Windows Photo Viewer with prev/next/zoom/fullscreen; Music → honest "This folder is empty" + [ADD MUSIC] + Media Player), Timeline (horizontal slider: 2022 ICSE—95 · 2024 ISC—92.3 + B.Tech · 2025 projects · 2026 research), Skills (category folders, no percentages), Settings (functional Day/Night + Motion Full/Reduced), Windows Media Player ("No track loaded"), Rocky AI (floating bottom-right, Aero chat, live AI via /api/rocky, never invents).
- **Day/Night mode**: animated crossfade of the whole environment (wallpaper → moonlit stars, dark taskbar, dark glass via invert trick with images double-inverted), persisted in sessionStorage.
- **Exit**: "Back to Portfolio" (taskbar + start menu) → returns to the modern "Let's Connect" section.

## Architecture
- Frontend: CRA + TS + Tailwind + framer-motion + Three.js (World 1 space scene kept from v3? — removed in v4; World 2 is the highlight) — actually v4 keeps World 1 light: boot/login + Hero/About/Projects/Research sections with Aero modal windows.
- `src/BootLogin.tsx` (boot + login), `src/sections/` (Hero, About, Projects, Research, TransitionSpacer, Contact), `src/win/` (AeroWindow modal system + icons + ui + RockyChat), `src/world/` (World2 desktop, WinManager, Explorer, apps, fs.ts virtual file system), `src/data/` (projects, research, experiments, photography, timeline, skills, rockyKnowledge, site).
- Backend: `/api/rocky` — Emergent universal key → OpenAI gpt-5.4 (Rocky persona, full knowledge), demo fallback, Mongo chat logs.

## Implemented (2026-09-26)
- Two-world flow verified end-to-end in preview: boot → login → World 1 → transition flash → desktop reveal.
- Working Explorer navigation (back/forward/up, breadcrumb, 3 view modes), project/research/experiment files opening real app windows, photo viewer with zoom controls, night mode with crossfade + persistence, start menu search, right-click menu, exit → contact scroll.
- Honesty rules: CogMap "[Description coming soon]", FinTeach private (no fake repo), ONGOING statuses exact, no invented metrics/links/music/photos (all placeholders clearly marked).

## Backlog
- **P0**: Real photographs into Pictures (data/photography.ts → fs.ts images), real Spline Rocky model URL (win/RockyChat ROCKY_SPLINE_URL), Pixelator JS codebase integration (sections/PixelatorApp.tsx boundary).
- **P1**: Music files → Media Player TRACKS, [ADD PROJECT LINK] repos as published.
- **P2**: Taskbar hover previews, desktop gadget widgets, more World 2 apps.

## Next Tasks
1. Send Pixelator codebase → real app inside its window.
2. Replace placeholder photos + add music.
3. Paste Spline Rocky/scene URLs.
