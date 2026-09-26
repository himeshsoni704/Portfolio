import { motion, useReducedMotion } from 'framer-motion';
import SplineHero from './SplineHero';
import { Label, useClock } from './aero';
import { useRocky } from './RockyProvider';
import { scrollToId } from '../lib/lenis';

const LINES = [
  { text: 'BUILDING', accent: false },
  { text: 'THINGS', accent: false },
  { text: "I'M CURIOUS", accent: true },
  { text: 'ABOUT.', accent: false },
];

export default function Hero() {
  const clock = useClock();
  const reduced = useReducedMotion();
  const { setOpen } = useRocky();

  return (
    <section className="starfield noise relative min-h-[100svh] overflow-hidden">
      {/* soft nebula washes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(900px 600px at 78% 38%, rgba(37,99,235,0.22), transparent 65%), radial-gradient(700px 500px at 12% 85%, rgba(6,182,212,0.12), transparent 60%)',
        }}
      />

      {/* 3D scene — right half on desktop, full-bleed backdrop on mobile */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-45 lg:opacity-100">
        <div className="h-full w-full lg:absolute lg:inset-y-0 lg:right-0 lg:w-[48%]">
          <SplineHero />
        </div>
      </div>

      {/* content */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl items-center px-5 py-28 md:px-8">
        <div className="max-w-2xl">
          <motion.div initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Label>HIMESH SONI · MISSION CONTROL · DUBAI 25.2°N 55.27°E</Label>
          </motion.div>

          <h1 className="mt-6 font-display text-[clamp(2.9rem,9vw,6.2rem)] font-bold leading-[0.98] tracking-tight text-ice">
            {LINES.map((line, i) => (
              <span key={line.text} className="block overflow-hidden pb-1">
                <motion.span
                  className={`block ${line.accent ? 'text-gradient-sky' : ''}`}
                  initial={reduced ? false : { y: '112%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="mt-6 font-mono text-[11px] tracking-[0.22em] text-aero-ice sm:text-xs"
          >
            COMPUTER SCIENCE × AI/ML × QUANTUM × CREATIVE TECHNOLOGY
          </motion.p>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.78 }}
            className="mt-5 max-w-md text-base leading-relaxed text-mist sm:text-lg"
          >
            Third-year CS student at BITS Pilani Dubai. I build things I'm curious about — some
            serious, some experimental, some just to see if I can.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <button
              data-testid="hero-cta-work"
              onClick={() => scrollToId('work')}
              className="gloss-btn px-7 py-3 font-mono text-xs tracking-[0.2em] text-ice"
            >
              EXPLORE WORK
            </button>
            <button
              data-testid="hero-cta-rocky"
              onClick={() => setOpen(true)}
              className="rounded-full border border-aero-ice/30 px-7 py-3 font-mono text-xs tracking-[0.2em] text-silver transition-colors hover:border-aero-ice/70 hover:text-ice"
            >
              ASK ROCKY
            </button>
          </motion.div>

          {/* aero status widget */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.05 }}
            data-testid="hero-status-widget"
            className="glass mt-10 inline-flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3"
          >
            <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-aero-ice">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aero-green opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-aero-green" />
              </span>
              ALL SYSTEMS CURIOUS
            </span>
            <span className="hidden h-3 w-px bg-aero-ice/25 sm:block" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-mist">HS·01</span>
            <span className="hidden h-3 w-px bg-aero-ice/25 sm:block" />
            <span className="font-mono text-[10px] tabular-nums tracking-[0.2em] text-mist" data-testid="hero-utc-clock">
              {clock} UTC
            </span>
          </motion.div>
        </div>
      </div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
        aria-hidden="true"
      >
        <span className="label-mono !text-[9px]">SCROLL</span>
        <div className="h-10 w-px overflow-hidden bg-aero-ice/15">
          <motion.div
            className="h-4 w-px bg-aero-sky"
            animate={{ y: [0, 24, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
