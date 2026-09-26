import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
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
// LOGIN — Windows 7 styled welcome. Blue wallpaper, avatar tile,
// Username/Password fields, blue arrow. Any password works —
// guest session. Shared by the portfolio start + the computer.
// ─────────────────────────────────────────────────────────────

export function LoginScreen({ onEnter }: { onEnter: () => void }) {
  const [name, setName] = useState('Himesh Soni');

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
      className="fixed inset-0 z-[190] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #3D8FD4 0%, #2266AC 48%, #174E88 100%)' }}
      data-testid="login-screen"
    >
      {/* soft aurora light streaks — original CSS curves */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70">
        {[
          { w: '140%', h: 300, r: -14, t: '12%', o: 0.3 },
          { w: '120%', h: 220, r: -9, t: '46%', o: 0.2 },
          { w: '150%', h: 340, r: -17, t: '70%', o: 0.26 },
        ].map((s, i) => (
          <div
            key={i}
            className="absolute left-[-20%] rounded-[100%]"
            style={{
              width: s.w,
              height: s.h,
              top: s.t,
              transform: `rotate(${s.r}deg)`,
              background: `linear-gradient(180deg, transparent, rgba(255,255,255,${s.o}), transparent)`,
              filter: 'blur(18px)',
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center px-4"
      >
        {/* avatar tile */}
        <div
          className="grid h-28 w-28 place-items-center overflow-hidden rounded-xl border-[3px] border-white/80 shadow-[0_16px_50px_rgba(2,30,60,0.55)]"
          style={{ background: 'radial-gradient(circle at 50% 62%, #FFB347 0%, #F2790F 55%, #C65A0A 100%)' }}
        >
          <div
            className="h-16 w-16 rounded-full"
            style={{ background: 'radial-gradient(circle at 45% 40%, #FFE08A, #F59E0B 70%)', boxShadow: '0 0 0 6px rgba(255,190,90,0.35)' }}
          />
        </div>
        <p className="mt-4 max-w-[260px] truncate text-[19px] font-light text-white drop-shadow-[0_2px_8px_rgba(0,25,50,0.8)]">
          {name.trim() || 'Himesh Soni'}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onEnter();
          }}
          className="mt-5 flex flex-col items-center gap-2.5"
        >
          <input
            data-testid="login-username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Username"
            aria-label="Username"
            className="w-[250px] rounded-[4px] border border-[#6E93B8] bg-white/95 px-3 py-1.5 text-[13px] text-[#1B3A5C] shadow-inner outline-none focus:border-[#4DA6E8]"
          />
          <div className="flex items-center gap-2.5">
            <input
              data-testid="login-password"
              type="password"
              placeholder="Password"
              aria-label="Password — any password works, guest session"
              className="w-[250px] rounded-[4px] border border-[#6E93B8] bg-white/95 px-3 py-1.5 text-[13px] text-[#1B3A5C] shadow-inner outline-none focus:border-[#4DA6E8]"
            />
            <button
              data-testid="login-enter-button"
              type="submit"
              aria-label="Log in"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/60 text-white shadow-[0_6px_18px_rgba(2,40,80,0.5)] transition-all hover:brightness-110 active:scale-95"
              style={{ background: 'radial-gradient(circle at 35% 30%, #7CC4F2, #2274C4 60%, #16497F)' }}
            >
              <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </div>
        </form>

        <button
          data-testid="login-create-account"
          onClick={() => toast("It's a guest session — just press the arrow.")}
          className="mt-6 text-[12px] text-[#BFE0F7] underline decoration-[#BFE0F7]/50 underline-offset-4 transition-colors hover:text-white"
        >
          Create new account
        </button>
        <p className="mt-4 font-mono text-[9px] tracking-[0.3em] text-[#8FBCE0]">GUEST SESSION · PRESS ENTER</p>
      </motion.div>
    </motion.div>
  );
}
