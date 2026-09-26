import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────
// TRANSITION SPACER — the doorway between World 1 (modern
// portfolio) and World 2 (Himesh's Windows computer). Scrolling
// through it darkens the page; past the threshold, World 2 opens.
// ─────────────────────────────────────────────────────────────

export default function TransitionSpacer({ onEnter }: { onEnter: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);
  const fired = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el || fired.current) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      const v = Math.min(Math.max(-rect.top / Math.max(total, 1), 0), 1);
      setP(v);
      if (v > 0.72) {
        fired.current = true;
        onEnter();
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onEnter]);

  return (
    <section ref={ref} className="relative h-[110vh]" style={{ background: '#071527' }} data-testid="transition-spacer">
      <div className="sticky top-0 grid h-screen place-items-center px-6">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(10,27,46,${0.25 + p * 0.7}) 0%, rgba(4,13,28,${0.5 + p * 0.5}) 100%)`,
          }}
          aria-hidden="true"
        />
        <div className="relative text-center" style={{ opacity: Math.max(0.15, 1 - Math.abs(p - 0.45) * 2.2) }}>
          <p className="font-mono text-[10px] tracking-[0.4em] text-[#7DD3FC]/80">EVERYTHING ELSE</p>
          <p className="mx-auto mt-5 max-w-lg text-2xl font-light leading-snug text-[#DCEFFC] sm:text-3xl">
            ...lives somewhere else entirely.
          </p>
          <p className="mt-4 text-[13px] text-[#6E93B5]">Keep scrolling.</p>
        </div>
      </div>
    </section>
  );
}
