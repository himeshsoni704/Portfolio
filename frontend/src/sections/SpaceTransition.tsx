import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Power, ArrowDown, ChevronRight } from 'lucide-react';
import SpaceScene from './SpaceScene';

// ─────────────────────────────────────────────────────────────
// SPACE TRANSITION — 3-STAGE CINEMATIC ACT:
// 1. Rocky walks across the screen from left to right.
// 2. Rocky pauses, waves, and says: "Amaze amaze! Wanna know more about me?"
// 3. The computer illuminates and opens with a button asking to BOOT.
// ─────────────────────────────────────────────────────────────

export default function SpaceTransition({
  onEnterComputer,
  blockedInitially = false,
}: {
  onEnterComputer: () => void;
  blockedInitially?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [p, setP] = useState(0);
  const reduced = useReducedMotion();
  const fired = useRef(false);
  const blocked = useRef(blockedInitially);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const el = ref.current;
      if (!el || fired.current) return;
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      const rect = el.getBoundingClientRect();
      if (blocked.current && dy < 0 && rect.top > window.innerHeight) blocked.current = false;
      const total = rect.height - window.innerHeight;
      const v = Math.min(Math.max(-rect.top / Math.max(total, 1), 0), 1);
      progress.current = v;
      setP(v);
      if (v > 0.965 && !blocked.current) {
        fired.current = true;
        onEnterComputer();
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onEnterComputer]);

  const scrollToStage2 = () => {
    if (!ref.current) return;
    const top = ref.current.offsetTop + ref.current.clientHeight * 0.52;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const scrollToStage3 = () => {
    if (!ref.current) return;
    const top = ref.current.offsetTop + ref.current.clientHeight * 0.88;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const fade = (from: number, to: number) => {
    if (p < from) return { opacity: 0, transform: 'translateY(24px)' };
    if (p > to) return { opacity: 0, transform: 'translateY(-24px)' };
    const span = to - from;
    const edge = span * 0.22;
    const o = p < from + edge ? (p - from) / edge : p > to - edge ? (to - p) / edge : 1;
    return { opacity: Math.max(0, o), transform: 'translateY(0px)' };
  };

  return (
    <section
      id="space"
      ref={ref}
      className="relative bg-[#02070F]"
      style={{ height: reduced ? '180vh' : '320vh' }}
      data-testid="space-transition"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* deep space background */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, #06182B 0%, #040D1C 30%, #02070F 100%)' }}
          aria-hidden="true"
        />
        {/* top fade from dusk */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40"
          style={{ background: 'linear-gradient(180deg, #0A1B2E 0%, rgba(6,24,43,0) 100%)', opacity: Math.max(0, 1 - p * 14) }}
          aria-hidden="true"
        />
        {/* bottom glow */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-64"
          style={{ background: 'linear-gradient(0deg, rgba(2,10,18,1) 0%, rgba(2,7,15,0) 100%)' }}
          aria-hidden="true"
        />

        {/* 3D Scene with Walking Rocky & Computer */}
        <SpaceScene progress={progress} />

        {/* ─────────────────────────────────────────────────────────────
            CINEMATIC OVERLAY SEQUENCING
            ───────────────────────────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
          
          {/* Stage 1: Rocky Walking Across the Screen */}
          <div
            style={fade(0.02, 0.38)}
            className="text-center transition-none"
            data-testid="space-stage-1"
          >
            <span className="inline-block rounded-full border border-cyan-400/30 bg-cyan-950/60 px-4 py-1.5 font-mono text-[9px] tracking-[0.35em] text-[#7DD3FC] backdrop-blur">
              ✦ SCROLL TO WALK ROCKY ✦
            </span>
            <p className="mt-4 text-3xl font-light tracking-tight text-[#E8F4FF] sm:text-4xl">
              Scroll down to make Rocky walk!
            </p>
            <p className="mt-2 text-sm text-[#7BA6CC]">
              Rocky strides forward across the cosmos directly as you scroll.
            </p>
            <button
              onClick={scrollToStage2}
              className="pointer-events-auto mt-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-slate-900/60 px-5 py-2 text-[11px] font-semibold tracking-wider text-cyan-200 backdrop-blur transition-all hover:bg-cyan-900/40 hover:text-white"
            >
              Meet Rocky <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Stage 2: Rocky stops, waves, and speaks */}
          <div
            style={fade(0.40, 0.72)}
            className="absolute flex flex-col items-center text-center transition-none"
            data-testid="space-stage-2"
          >
            <div className="max-w-xl rounded-3xl border-2 border-cyan-400/40 bg-slate-950/85 p-8 shadow-[0_20px_60px_rgba(56,189,248,0.25)] backdrop-blur-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-950/60 px-3.5 py-1 font-mono text-[9px] tracking-[0.3em] text-[#34D399]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#34D399]" />
                ROCKY SPEAKS
              </span>
              <h2 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-4xl">
                “Amaze amaze! Wanna know more about me?”
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                “I'm Rocky — Himesh's AI companion. Let's see what he's been building inside my computer.”
              </p>
              <button
                onClick={scrollToStage3}
                className="pointer-events-auto mt-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/60 bg-cyan-500/20 px-6 py-2.5 text-xs font-semibold tracking-wider text-cyan-200 backdrop-blur transition-all hover:bg-cyan-500/35 hover:text-white hover:scale-105 active:scale-95"
              >
                Open My Computer <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Stage 3: The Computer Opens with Boot Button */}
          <div
            style={fade(0.74, 0.99)}
            className="absolute flex flex-col items-center text-center transition-none"
            data-testid="space-stage-3"
          >
            <div className="max-w-lg rounded-3xl border border-cyan-400/40 bg-slate-950/80 p-8 shadow-[0_20px_70px_rgba(56,189,248,0.35)] backdrop-blur-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-950/70 px-4 py-1 font-mono text-[9px] tracking-[0.3em] text-[#7DD3FC]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                COMPUTER READY · WORLD 2
              </span>
              <h3 className="mt-4 text-2xl font-medium tracking-tight text-[#E8F4FF] sm:text-3xl">
                Ready to explore HimeshOS?
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#94B9DA]">
                Windows Vista Aero desktop with projects, research, experiments, and photos.
              </p>
              <button
                data-testid="computer-boot-button"
                onClick={onEnterComputer}
                className="pointer-events-auto mt-7 inline-flex items-center gap-3 rounded-full border-2 border-cyan-300 bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-400 px-9 py-4 text-sm font-bold tracking-[0.2em] text-white shadow-[0_0_35px_rgba(56,189,248,0.65)] backdrop-blur transition-all hover:scale-105 hover:shadow-[0_0_55px_rgba(56,189,248,0.85)] active:scale-95"
              >
                <Power className="h-5 w-5" />
                BOOT COMPUTER
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}