# PRD — Himesh Soni Portfolio ("Aero Orbital Lab")

## Original Problem Statement
Build a premium interactive creative-tech portfolio from scratch for Himesh Soni, a 3rd-year CS student at BITS Pilani Dubai (AI/ML, quantum computing, software, creative coding, photography, filmmaking). Central idea: "I build things I'm curious about." Serious research projects must coexist with experiments made for fun. Must NOT look like a generic student portfolio. User later specified the art direction: **Frutiger Aero × Windows 7 UX × modern space exploration** — bright, optimistic, glassy, not cyberpunk. Rocky = personal AI rock companion inspired by Project Hail Mary (curious, enthusiastic, occasional "AMAZE!", never invents info, privacy-first). Real links: GitHub github.com/himeshsoni704, LinkedIn ae.linkedin.com/in/himesh-soni-994326310, email himeshsoni704@gmail.com, Instagram @hx.cr3.

## Architecture
- **Frontend**: CRA (react-scripts 5) + TypeScript + Tailwind + framer-motion + Lenis smooth scroll + Three.js hero scene (planet, orbit ring + moon, floating pixels, transparent water bottle with sloshing water, camera lens, quantum circuit with photon, Rocky with cursor-tracking + blinking eyes). `SplineHero.tsx` has a clearly marked `SPLINE_SCENE_URL` slot — pasting a Spline URL swaps the built-in scene automatically (spline-viewer web component).
- **Backend**: FastAPI `/api/rocky` — provider-agnostic: uses `emergentintegrations` LlmChat (OpenAI gpt-5.4) when `EMERGENT_LLM_KEY` is set in backend/.env; otherwise falls back to a built-in demo knowledge responder. All Rocky chats logged to Mongo `rocky_chats` for future improvement. Status/health routes preserved.
- **Data-driven**: `src/data/projects.ts` (5 projects, full 01–08 case studies), `experiments.ts`, `photography.ts` (8 clearly-labelled placeholders), `skills.ts`, `rockyKnowledge.ts`, `rockySystemPrompt.ts`, `lib/site.ts`.
- **Pages**: Home (hero → marquee → intro → Selected Work → Experiment Lab → Rocky → Beyond Code → Currently Building → Toolkit → About → Contact), `/work/:slug` case studies with page transitions.
- **Identity**: custom orbit-mark logo/favicon (`public/favicon.svg`), Outfit + JetBrains Mono, aero glass surfaces, starfield, film grain.

## User Personas
- **Recruiter/collaborator**: scans hero, sees range of work, reads case studies, contacts.
- **Friend/community**: opens Rocky, asks playful questions, checks Instagram.
- **Himesh (owner)**: edits data files to add projects/photos; pastes Spline URL later.

## Core Requirements (static)
See the 43-section brief: honesty rules (no invented metrics/links/claims), one accent family, no skill bars, no fake testimonials, privacy-first Rocky, placeholder discipline, responsive/mobile-first adaptations, reduced-motion + a11y, SEO/OG metadata.

## Implemented (2026-09-26)
- Full hero with kinetic masked line reveal, 3D "Himesh universe" scene (cursor + scroll reactive), status widget, minimal glass navbar (compact on scroll, mobile menu), smooth scrolling (Lenis, reduced-motion aware).
- Slow editorial marquee; intro section ("Some serious. Some experimental. Some just for fun.").
- Selected Work: QKD (animated ALICE→BOB/EVE diagram with eavesdrop toggle + ML verdict), eInvoicing (pipeline + doc mock + PRIVATE/INTERNSHIP label), LC Automation (IN PROGRESS, pipeline, Current/Exploring/Next board on case page), Pixelator (live canvas + slider in a light aero band), Water Bottle (interactive 2D canvas sim with drag + reset).
- Experiments grid (6 items, links to real GitHub profile).
- Rocky: floating launcher, Aero chat window ("ROCKY — ONLINE"), suggestion chips, live LLM answers via Emergent key with demo fallback, easter eggs, privacy note, dedicated section + contact integration.
- Beyond Code: sky-gradient photography masonry (placeholders labelled, lightbox with keyboard nav, Instagram CTA) + Motion film section (poster/video/BTS placeholders, DaVinci Resolve chips).
- Currently Building (3 × IN PROGRESS), Toolkit (5 categories, no bars), About, Contact (real links + Ask Rocky), Footer. SEO/OG in index.html. data-testids throughout.
- Backend `/api/rocky` with LLM + demo modes, Mongo logging, health route.

## Prioritized Backlog
- **P0**: Replace photography placeholders with real photos (`src/data/photography.ts`); paste real Spline URL (`SplineHero.tsx`); replace film poster/video/BTS placeholders (`FilmSection.tsx`).
- **P1**: Add real repo links to projects/experiments (currently `YOUR_GITHUB_URL` or profile link); fill case-study Results/Experiments placeholders with real numbers.
- **P2**: Rocky knowledge expansion (edit `rockyKnowledge.ts` + backend `ROCKY_SYSTEM`), photography lightbox captions/EXIF, blog/"lab notes" section, analytics.

## Next Tasks
1. Swap in real Spline scene URL when ready.
2. Replace placeholder photos with @hx.cr3 work.
3. Fill QKD results + LC experiments as data lands.
4. Tune Rocky persona/knowledge as it evolves.
