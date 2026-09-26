import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import SpaceScene from './SpaceScene';

// ─────────────────────────────────────────────────────────────
// SPACE TRANSITION — a tall scroll-driven cinematic act.
// Light portfolio fades → stars appear → the ship flies past →
// Rocky floats in and waves → "now, the work."
// ─────────────────────────────────────────────────────────────

export default function SpaceTransition() {
  const ref = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [p, setP] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const v = Math.min(Math.max(-rect.top / Math.max(total, 1), 0), 1);
      progress.current = v;
      setP(v);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fade = (from: number, to: number) => {
    if (p < from) return { opacity: 0, transform: 'translateY(24px)' };
    if (p > to) return { opacity: 0, transform: 'translateY(-24px)' };
    const span = to - from;
    const edge = span * 0.25;
    const o = p < from + edge ? (p - from) / edge : p > to - edge ? (to - p) / edge : 1;
    return { opacity: Math.max(0, o), transform: 'translateY(0px)' };
  };

  return (
    <section id="space" ref={ref} className="relative bg-[#02070F]" style={{ height: reduced ? '160vh' : '320vh' }} data-testid="space-transition">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* deep space base */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, #06182B 0%, #040D1C 30%, #02070F 100%)' }}
          aria-hidden="true"
        />
        {/* fade-in from the light section above */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40"
          style={{ background: 'linear-gradient(180deg, #DCEEFB 0%, rgba(6,24,43,0) 100%)', opacity: Math.max(0, 1 - p * 14) }}
          aria-hidden="true"
        />
        {/* glow into the projects section below */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-64"
          style={{ background: 'linear-gradient(0deg, rgba(6,24,43,1) 0%, rgba(2,7,15,0) 100%)' }}
          aria-hidden="true"
        />

        <SpaceScene progress={progress} />

        {/* narrative stage overlays */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
          <div style={fade(0.02, 0.2)} className="text-center transition-none" data-testid="space-stage-1">
            <p className="font-mono text-[10px] tracking-[0.4em] text-[#7DD3FC]/90">LEAVING THE ATMOSPHERE</p>
            <p className="mt-4 text-2xl font-light text-[#DCEFFC] sm:text-3xl">The bright part is over.</p>
            <p className="mt-2 text-[13px] text-[#6E93B5]">Scroll — the ship is already moving.</p>
          </div>

          <div style={fade(0.26, 0.44)} className="absolute text-center" data-testid="space-stage-2">
            <p className="font-mono text-[10px] tracking-[0.4em] text-[#7DD3FC]/90">SOMEWHERE IN BETWEEN</p>
            <p className="mt-4 max-w-md text-2xl font-light text-[#DCEFFC] sm:text-3xl">
              Between research and curiosity, there's a lot of empty space to build in.
            </p>
          </div>

          <div style={fade(0.48, 0.8)} className="absolute text-center" data-testid="space-stage-3">
            <p className="font-mono text-[10px] tracking-[0.4em] text-[#34D399]">COMPANION DETECTED</p>
            <p className="mt-4 max-w-md text-2xl font-light text-[#DCEFFC] sm:text-3xl">
              That's Rocky. He lives here. He'll be around.
            </p>
          </div>

          <div style={fade(0.86, 0.99)} className="absolute text-center" data-testid="space-stage-4">
            <p className="font-mono text-[10px] tracking-[0.4em] text-[#7DD3FC]/90">NOW — THE WORK</p>
            <p className="mt-4 text-3xl font-medium text-[#E8F4FF] sm:text-4xl">
              Things I've built. Things I'm investigating.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
