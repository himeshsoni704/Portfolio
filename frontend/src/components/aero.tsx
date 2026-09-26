import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// ───────────────────────────────────────────────────────────
// Reusable Aero primitives + scroll-reveal helper
// ───────────────────────────────────────────────────────────

export function Label({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`label-mono ${className}`}>{children}</p>;
}

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  index,
  module,
  title,
  subtitle,
  light = false,
}: {
  index: string;
  module: string;
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <div className="mb-14 md:mb-20">
      <Reveal>
        <Label className={`mb-5 ${light ? 'text-aero-blue' : ''}`}>
          {index} / {module}
        </Label>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={`text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.02] ${
            light ? 'text-slate-900' : 'text-ice'
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.16}>
          <p
            className={`mt-5 max-w-xl text-base md:text-lg leading-relaxed ${
              light ? 'text-slate-600' : 'text-mist'
            }`}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}

export function Chip({ children, tone = 'dark' }: { children: ReactNode; tone?: 'dark' | 'light' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 font-mono text-[11px] tracking-wider uppercase border transition-colors ${
        tone === 'dark'
          ? 'border-aero-ice/30 bg-aero-sky/10 text-aero-ice hover:bg-aero-sky/25'
          : 'border-aero-blue/30 bg-white/70 text-aero-blue hover:bg-aero-blue/10'
      }`}
    >
      {children}
    </span>
  );
}

export function useClock() {
  const [now, setNow] = useState('');
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'UTC',
        })
      );
    tick();
    ref.current = setInterval(tick, 1000);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, []);
  return now;
}
