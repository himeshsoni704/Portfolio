import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { AppIcon } from './win/icons';

// ─────────────────────────────────────────────────────────────
// BOOT — Vista-inspired startup. Dark screen, subtle glow,
// tiny progress bar. Short and skippable.
// ─────────────────────────────────────────────────────────────

export default function BootScreen({ onDone }: { onDone: () => void }) {
  const [p, setP] = useState(0);
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(onDone, 400);
      return () => clearTimeout(t);
    }
    const iv = setInterval(() => setP((v) => Math.min(v + 3 + Math.random() * 7, 100)), 85);
    const t = setTimeout(onDone, 2100);
    return () => {
      clearInterval(iv);
      clearTimeout(t);
    };
  }, [onDone, reduced]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      onClick={onDone}
      className="fixed inset-0 z-[200] flex cursor-pointer flex-col items-center justify-center bg-[#020a12]"
      data-testid="boot-screen"
    >
      {/* soft vista glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(700px 420px at 50% 58%, rgba(14,165,233,0.16), transparent 70%), radial-gradient(900px 500px at 50% 110%, rgba(16,185,129,0.10), transparent 70%)',
        }}
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative font-display text-2xl font-light tracking-[0.35em] text-[#BFE3F7]"
      >
        Starting<span className="text-[#38BDF8]">...</span>
      </motion.p>
      <p className="relative mt-3 font-mono text-[9px] tracking-[0.4em] text-[#3E6B8A]">HIMESHOS · AERO EDITION</p>

      {/* vista-style bottom progress */}
      <div className="absolute bottom-16 flex w-56 items-center gap-3">
        <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{
              width: `${p}%`,
              background: 'linear-gradient(90deg, #34D399, #38BDF8)',
              boxShadow: '0 0 12px rgba(52,211,153,0.7)',
            }}
          />
        </div>
      </div>
      <p className="absolute bottom-9 font-mono text-[8.5px] tracking-[0.3em] text-[#33566E]">
        CLICK TO SKIP
      </p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// LOGIN — Vista-inspired welcome. One click, no password.
// ─────────────────────────────────────────────────────────────

export function LoginScreen({ onEnter }: { onEnter: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') onEnter();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onEnter]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06, filter: 'blur(8px)' }}
      transition={{ duration: 0.55 }}
      className="fixed inset-0 z-[190] flex flex-col items-center justify-center overflow-hidden bg-[#04121E]"
      data-testid="login-screen"
    >
      {/* vista aurora glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(900px 560px at 50% 62%, rgba(14,165,233,0.30), transparent 68%), radial-gradient(700px 480px at 18% 20%, rgba(16,185,129,0.16), transparent 65%), radial-gradient(800px 500px at 85% 15%, rgba(56,130,246,0.14), transparent 65%)',
        }}
      />
      {/* light streak */}
      <div
        aria-hidden="true"
        className="absolute -left-40 bottom-0 h-[420px] w-[820px] rotate-[-18deg] opacity-40"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(125,211,252,0.35), transparent)', filter: 'blur(30px)' }}
      />

      <motion.div
        initial={{ y: 26, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center"
      >
        <button data-testid="login-enter-button" onClick={onEnter} className="group flex flex-col items-center outline-none" aria-label="Welcome — enter the portfolio">
          <span className="grid h-32 w-32 place-items-center overflow-hidden rounded-2xl border-2 border-white/60 bg-gradient-to-b from-[#CFE9FC]/50 to-[#0E5A8A]/40 shadow-[0_18px_60px_rgba(2,30,55,0.8)] backdrop-blur-md transition-transform duration-300 group-hover:scale-[1.045]">
            <AppIcon name="intro" className="h-20 w-20 drop-shadow" />
          </span>
          <span className="mt-6 text-[26px] font-light tracking-wide text-white drop-shadow-[0_2px_10px_rgba(0,25,50,0.9)]">
            Himesh Soni
          </span>
        </button>

        <motion.button
          data-testid="login-welcome-button"
          onClick={onEnter}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="gloss-btn mt-8 flex items-center gap-3 px-9 py-3 text-white"
        >
          <span className="text-sm font-medium tracking-[0.18em]">WELCOME</span>
          <ArrowRight className="h-4 w-4" />
        </motion.button>

        <p className="mt-7 font-mono text-[9px] tracking-[0.3em] text-[#5E8FAD]">
          GUEST SESSION · PRESS ENTER
        </p>
      </motion.div>
    </motion.div>
  );
}
