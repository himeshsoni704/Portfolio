# PRD — Himesh Soni Portfolio ("HimeshOS — Aero cinematic edition")

## Original Problem Statement (current, v3)
A modern cinematic scrolling portfolio that opens with a Windows Vista-inspired boot + login, then becomes a normal scrolling website: Hero → About → cinematic scroll-driven SPACE transition (stars, nebulae, spaceship, Rocky 3D) → Projects → Research → Experiments → Photography & Film → My Journey timeline → Skills drawer → Media player → Contact. Windows 7 Aero styling appears ONLY inside floating windows (project details, research notes, photo viewer, timeline info, skills drawer, media player, Rocky chatbot) — ~20% Windows, 80% modern portfolio. No desktop OS simulation, no taskbar, no start menu.

## Architecture
- **Frontend**: CRA + TypeScript + Tailwind + framer-motion + Three.js.
  - `BootLogin.tsx` — Vista boot ("Starting..." + glow progress) → login (avatar, Welcome, Enter key).
  - `sections/SpaceScene.tsx` — Three.js cinematic act: parallax stars, nebula sprites, glossy toy spaceship flying across, planet + moon, floating pixels, ROCKY (glossy jittered rock, blinking eyes, waving arm, follows pointer), all driven by scroll progress. Spline slots: space scene + Rocky model can replace fallbacks via URL constants (in SpaceScene/RockyChat).
  - `sections/SpaceTransition.tsx` — 320vh sticky scroll section with 4 narrative stages.
  - `win/AeroWindow.tsx` — reusable glass window system (minimize-collapse, maximize, close, Escape, staggered open) + AeroProvider (single-instance ids).
  - `win/` — SkillsDrawer (right slide-over), MediaPlayer (compact WMP-inspired floater, honest "No track loaded" + [ADD MUSIC]), RockyChat (floating launcher + Aero chat with waving character, Spline Rocky slot).
  - Sections: Hero, About (Know More → Aero window), Projects (11 real projects, dark starfield), Research (4 honest ongoing entries; QKD window embeds animated ALICE→BOB/EVE diagram), Experiments (live Water Bottle sim + Pixelator integration boundary), Photography & Film (placeholders marked [ADD PHOTOGRAPH], Aero photo viewer with prev/next/fullscreen), Journey (2022 ICSE → 2026 research; entries open Aero info windows), Contact (Let's Connect, real links, ending line).
- **Backend**: FastAPI `/api/rocky` — provider-agnostic: Emergent universal key → OpenAI gpt-5.4 with full Rocky system prompt; demo fallback (keyword knowledge base) when key absent/failing; chats logged to Mongo `rocky_chats`.
- **Data-driven**: `data/projects.ts` (11), `research.ts` (4), `experiments.ts`, `photography.ts`, `timeline.ts`, `skills.ts`, `rockyKnowledge.ts`, `lib/site.ts`.
- **Rules honored**: no invented metrics/links/claims; CogMap = "[Description coming soon]"; FinTeach private (no fake repo); statuses exact (PROJECT/PUBLIC/PRIVATE/ONGOING/ONGOING RESEARCH); no skill percentages; no milestones section (Currently Exploring inside About window instead); LinkedIn/email real (supplied by Himesh earlier).

## Implemented (2026-09-26)
- Boot → login → site flow with satisfying zoom/blur transitions; Enter-key + skip support.
- Full scrolling story with the light → space → light arc; scroll-driven Three.js space act with Rocky.
- Aero window system serving project details, research notes, photo viewer, journey details, About-more; skills drawer; media player floater; Rocky AI chat (live AI + demo mode, never invents, occasional "Amaze.").
- Mobile: no horizontal overflow; Aero windows become near-fullscreen panels; space scene + Rocky scale down.
- Verified end-to-end: boot, login, hero, about, space scroll stages, project/research windows (readable glass), photo viewer, journey, skills drawer, Rocky chat (live AI reply), contact; desktop 1440 + mobile 390 screenshots clean.

## Backlog
- **P0**: Replace photography/film placeholders with real assets (`data/photography.ts`); paste Spline space scene + Rocky model URLs (constants in `SpaceScene` fallback note / `RockyChat`).
- **P1**: Integrate the real Pixelator JS codebase into `sections/PixelatorApp.tsx` (integration boundary documented in-file).
- **P2**: Wire real music into `win/MediaPlayer.tsx` TRACKS; expand Rocky knowledge (frontend `rockyKnowledge.ts` + backend `ROCKY_SYSTEM`); add [ADD PROJECT LINK] repos as Himesh publishes them.

## Next Tasks
1. Send the Pixelator codebase → it becomes a real app inside its Aero window.
2. Drop in Spline scene + Rocky model URLs.
3. Replace placeholder photography with real shots.
4. Add music files to the media player.
