# PRD — Himesh Soni Portfolio ("HimeshOS — Two Worlds Edition")

## Original Problem Statement (current, v4)
Two distinct worlds with one story:
- **World 1 — Modern cinematic portfolio (kept as designed)**: Vista-inspired boot ("Starting...") → Vista login (Himesh Soni · Welcome) → bright modern scrolling portfolio: Hero → About Me → "Things I've Built" (projects) → "Things I'm Investigating" (research). Clicking cards opens floating Aero windows.
- **The Transition**: after Research, a cinematic doorway — the page darkens, content fades, a light-bloom flash, "WELCOME TO HIMESH'S COMPUTER".
- **World 2 — Windows 7 + Frutiger Aero computer**: the viewport becomes Himesh's desktop (the supplied green-hills wallpaper). Full file-system metaphor: Desktop → Folder → File → Application. Working taskbar (Start orb, live taskbar buttons, tray: volume/network/day-night toggle/clock/exit), Start menu (Himesh Soni header, searchable apps, Settings, Back to Portfolio), desktop right-click menu, draggable/minimizable/maximizable Aero windows with z-focus.
- World 2 apps: Computer + Explorer folders (Things I've Built → AI & ML / Software / Hardware & Simulation / Creative → project files → project app windows; Things I'm Investigating → research docs → Research Lab with sidebar + document pane + QKD diagram; Experiments → Pixelator / Water Bottle sim / notes; Pictures → Photography + Film folders with thumbnails/details/icons views → Windows Photo Viewer with prev/next/zoom/fullscreen; Music → honest "This folder is empty" + [ADD MUSIC] + Media Player), Timeline (horizontal slider: 2022 ICSE—95 · 2024 ISC—92.3 + B.Tech · 2025 projects · 2026 research), Skills (category folders, no percentages), Settings (functional Day/Night + Motion Full/Reduced), Windows Media Player ("No track loaded"), Rocky AI (floating bottom-right, Aero chat, live AI via /api/rocky, never invents).
- **Pixelator (real app, integrated 2026-09-26)**: Himesh supplied his actual project source (Flask template + pixelator.py + swatch.py). UI ported faithfully into the Aero window (black/Geist-Mono terminal look: drop zone, GRID_SAMPLING / ORGANIC_SLIC select, resolution slider 1–25, AUTO_EXTRACT vs CUSTOM_PALETTE, 7 presets incl. Frutiger Aero, 16 manual swatches, EXECUTE_UPLOAD, result + swatch strip + download). Processing runs on the portfolio backend `POST /api/pixelate` with his exact logic (LANCZOS >1000px resize, SLIC shapes + KMeans-22 palette extraction, vectorized nearest-palette grid sampling, SLIC segmentation sampling). Openable from: World 2 desktop icon (double-click), Start menu, World 2 Experiments folder, Explorer project file "Open Pixelator", World 1 Projects card window.
- **Day/Night mode**: animated crossfade of the whole environment (wallpaper → moonlit stars, dark taskbar, dark glass), persisted in sessionStorage.
- **Exit**: "Back to Portfolio" (taskbar + start menu) → returns to the modern "Let's Connect" section.

## Architecture
- Frontend: CRA + TS + Tailwind + framer-motion. `src/BootLogin.tsx` (boot + login), `src/sections/` (Hero, About, Projects, Research, TransitionSpacer, Contact, PixelatorApp, Experiments — Experiments intentionally not mounted in World 1; experiments live in World 2), `src/win/` (AeroWindow modal system + icons + ui + RockyChat), `src/world/` (World2 desktop, WinManager, Explorer, apps, fs.ts virtual file system), `src/data/` (projects, research, experiments, photography, timeline, skills, rockyKnowledge, site).
- Backend: `/api/rocky` — Emergent universal key → OpenAI gpt-5.4 (Rocky persona, full knowledge), demo fallback, Mongo chat logs. `/api/pixelate` — Pixelator processing (Pillow + numpy + scikit-image SLIC + scikit-learn KMeans), deps pinned in requirements.txt.

## Implemented
- 2026-09-26 (earlier): Two-world flow verified end-to-end: boot → login → World 1 → transition flash → desktop reveal. Explorer navigation, project/research/experiment app windows, photo viewer, night mode, start menu search, right-click menu, exit → contact.
- 2026-09-26 (this session): **Real Pixelator integrated** — backend `/api/pixelate` port of Himesh's exact processing logic (10/10 pytest passed: grid+segment auto palette, exact custom palette match, pixel_size=1, error cases); frontend faithful UI in `sections/PixelatorApp.tsx`; wired into World 2 desktop + start menu + Explorer (project + experiment paths) and World 1 Projects window; Rocky knowledge updated (Pixelator is now live, "coming soon" removed everywhere).
- Honesty rules: CogMap "[Description coming soon]", FinTeach private (no fake repo), ONGOING statuses exact, no invented metrics/links/music/photos (all placeholders clearly marked).

## Backlog
- **P0**: Real photographs into Pictures (data/photography.ts → fs.ts images), real Spline Rocky model URL (win/RockyChat ROCKY_SPLINE_URL).
- **P1**: Music files → Media Player TRACKS, [ADD PROJECT LINK] repos as published.
- **P2**: Taskbar hover previews, desktop gadget widgets, more World 2 apps.

## Next Tasks
1. Replace placeholder photos with real assets.
2. Add music files for Media Player.
3. Paste Spline Rocky/scene URLs.
