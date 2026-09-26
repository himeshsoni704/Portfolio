import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Power } from 'lucide-react';
import SpaceScene from './SpaceScene';

// ─────────────────────────────────────────────────────────────
// SPACE TRANSITION — the cinematic act between the personal
// world and the computer. Scroll-driven: the ship flies, ROCKY
// appears and leads the way, the computer reveals itself, and
// the desktop boots. After exiting the computer, this act stays
// blocked until the user scrolls fully above it again.
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
    const onScroll = () => {
      const el = ref.current;
      if (!el || fired.current) return;
      const rect = el.getBoundingClientRect();
      // re-arm once the whole act is back below the viewport
      if (blocked.current && rect.top > window.innerHeight) blocked.current = false;
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

  const fade = (from: number, to: number) => {
    if (p < from) return { opacity: 0, transform: 'translateY(24px)' };
    if (p > to) return { opacity: 0, transform: 'translateY(-24px)' };
    const span = to - from;
    const edge = span * 0.25;
    const o = p < from + edge ? (p - from) / edge : p > to - edge ? (to - p) / edge : 1;
    return { opacity: Math.max(0, o), transform: 'translateY(0px)' };
  };

  return (
    <section id="space" ref={ref} className="relative bg-[#02070F]" style={{ height: reduced ? '180vh' : '340vh' }} data-testid="space-transition">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* deep space base */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, #06182B 0%, #040D1C 30%, #02070F 100%)' }}
          aria-hidden="true"
        />
        {/* fade-in from the dusk section above */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40"
          style={{ background: 'linear-gradient(180deg, #0A1B2E 0%, rgba(6,24,43,0) 100%)', opacity: Math.max(0, 1 - p * 14) }}
          aria-hidden="true"
        />
        {/* dark glow toward the boot screen below */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-64"
          style={{ background: 'linear-gradient(0deg, rgba(2,10,18,1) 0%, rgba(2,7,15,0) 100%)' }}
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
              Most of what he builds lives somewhere else entirely.
            </p>
          </div>

          <div style={fade(0.48, 0.8)} className="absolute text-center" data-testid="space-stage-3">
            <p className="font-mono text-[10px] tracking-[0.4em] text-[#34D399]">COMPANION DETECTED</p>
            <p className="mt-4 max-w-md text-2xl font-light text-[#DCEFFC] sm:text-3xl">“Oh, you made it this far.”</p>
            <p className="mt-3 font-mono text-[9px] tracking-[0.3em] text-[#7DD3FC]/80">— ROCKY · HE'LL LEAD YOU FROM HERE</p>
          </div>

          <div style={fade(0.86, 0.99)} className="absolute text-center" data-testid="space-stage-4">
            <p className="font-mono text-[10px] tracking-[0.4em] text-[#7DD3FC]/90">ROCKY AT THE COMPUTER</p>
            <p className="mt-4 max-w-lg text-3xl font-medium text-[#E8F4FF] sm:text-4xl">“Let's see what I've been building.”</p>
            <button
              data-testid="computer-boot-button"
              onClick={onEnterComputer}
              className="pointer-events-auto mt-8 inline-flex items-center gap-2.5 rounded-full border border-[#7DD3FC]/60 bg-[#0E2A44]/80 px-7 py-3 text-[12px] font-semibold tracking-[0.2em] text-[#BFE3F7] shadow-[0_0_30px_rgba(56,189,248,0.35)] backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-[#123052] hover:shadow-[0_0_44px_rgba(56,189,248,0.55)] active:scale-95"
            >
              <Power className="h-4 w-4" />
              BOOT THE COMPUTER
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}