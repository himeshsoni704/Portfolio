import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Minus, Maximize2, X } from 'lucide-react';
import { AppIcon, type IconKey } from './icons';

// ─────────────────────────────────────────────────────────────
// AERO WINDOWS — Vista/Win7-inspired glass windows that float
// above the portfolio. Used for project details, research,
// photos, timeline info, skills and more. The site itself
// stays a normal scrolling website.
// ─────────────────────────────────────────────────────────────

export type AeroContent = {
  id: string;
  title: string;
  icon?: IconKey;
  width?: number;
  render: () => ReactNode;
};

type WinCtx = { open: (w: AeroContent) => void };
const WindowContext = createContext<WinCtx>({ open: () => {} });
export const useAero = () => useContext(WindowContext);

type Instance = AeroContent & { key: number };

export function AeroProvider({ children }: { children: ReactNode }) {
  const [wins, setWins] = useState<Instance[]>([]);
  const counter = useRef(0);

  const open = useCallback((w: AeroContent) => {
    counter.current += 1;
    setWins((ws) => {
      const existing = ws.find((x) => x.id === w.id);
      if (existing) return ws; // single-instance per id
      return [...ws, { ...w, key: counter.current }];
    });
  }, []);

  const close = useCallback((key: number) => {
    setWins((ws) => ws.filter((x) => x.key !== key));
  }, []);

  return (
    <WindowContext.Provider value={{ open }}>
      {children}
      <div className="pointer-events-none fixed inset-0 z-[160]" data-testid="aero-windows-layer">
        <AnimatePresence>
          {wins.map((w, i) => (
            <AeroWindowFrame
              key={w.key}
              win={w}
              index={i}
              onClose={() => close(w.key)}
            />
          ))}
        </AnimatePresence>
      </div>
    </WindowContext.Provider>
  );
}

function AeroWindowFrame({
  win,
  index,
  onClose,
}: {
  win: Instance;
  index: number;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const width = win.width ?? 640;
  const mobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const offsets = index % 5;
  const style = maximized
    ? { left: 12, top: 12, right: 12, bottom: 12 }
    : {
        width: Math.min(width, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 24),
        maxHeight: '84vh',
      };

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, scale: 0.92, y: 26 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, scale: 0.94, y: 16 }}
      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1], delay: Math.min(offsets * 0.03, 0.1) }}
      className="aero-surface pointer-events-auto fixed overflow-hidden rounded-xl border border-white/60"
      style={{
        ...style,
        left: maximized ? 12 : `calc(50% - ${Math.min(width, window.innerWidth - 24) / 2 + offsets * 18}px)`,
        top: maximized ? 12 : `${Math.max(6, 10 + offsets * 3)}vh`,
        boxShadow: '0 40px 90px rgba(4, 30, 60, 0.45), 0 6px 24px rgba(4, 30, 60, 0.3)',
      }}
      role="dialog"
      aria-label={win.title}
      data-testid={`aero-window-${win.id}`}
    >
      {/* title bar */}
      <div
        className="relative flex h-10 items-center justify-between border-b border-white/60 bg-gradient-to-b from-[#D5ECFD]/95 to-[#ABD6F6]/85 px-2.5 select-none"
        style={{ cursor: maximized ? 'default' : 'grab' }}
        onDoubleClick={() => !mobile && setMaximized((m) => !m)}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-xl bg-gradient-to-b from-white/75 to-transparent" aria-hidden="true" />
        <div className="flex items-center gap-2 pl-1">
          {win.icon && (
            <span className="h-5 w-5 [&>svg]:h-5 [&>svg]:w-5">
              <AppIcon name={win.icon} />
            </span>
          )}
          <span className="max-w-[52vw] truncate text-[12.5px] font-semibold tracking-wide text-[#1A3A5C]">
            {win.title}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            data-testid={`aero-${win.id}-minimize`}
            aria-label={minimized ? 'Restore window' : 'Minimize window'}
            onClick={() => setMinimized((m) => !m)}
            className="grid h-7 w-8 place-items-center rounded-md border border-white/70 bg-gradient-to-b from-white/90 to-[#DCEEFC]/80 text-[#33567A] shadow-sm transition-all hover:from-white active:scale-95"
          >
            <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
          <button
            data-testid={`aero-${win.id}-maximize`}
            aria-label="Maximize window"
            onClick={() => !mobile && setMaximized((m) => !m)}
            className="grid h-7 w-8 place-items-center rounded-md border border-white/70 bg-gradient-to-b from-white/90 to-[#DCEEFC]/80 text-[#33567A] shadow-sm transition-all hover:from-white active:scale-95"
          >
            <Maximize2 className="h-3 w-3" strokeWidth={2.5} />
          </button>
          <button
            data-testid={`aero-${win.id}-close`}
            aria-label="Close window"
            onClick={onClose}
            className="group relative grid h-[22px] w-[44px] place-items-center rounded-[4px] border border-[#FF9999]/60 text-white shadow-[0_1px_2px_rgba(0,0,0,0.45)] transition-all hover:shadow-[0_0_16px_rgba(255,40,20,0.95)] active:scale-95"
            style={{
              background: 'linear-gradient(180deg, #E65A4E 0%, #D32F2F 50%, #B71C1C 100%)',
            }}
          >
            <span aria-hidden="true" className="pointer-events-none absolute inset-x-0.5 top-0 h-[8px] rounded-t-[3px] bg-gradient-to-b from-white/75 to-transparent" />
            <X className="relative z-10 h-3.5 w-3.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" strokeWidth={2.8} />
          </button>
        </div>
      </div>

      {/* body */}
      <motion.div
        animate={{ height: minimized ? 0 : 'auto', opacity: minimized ? 0 : 1 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative min-h-0 overflow-y-auto overflow-x-hidden text-[#25384C]"
        style={{ maxHeight: maximized ? 'calc(100vh - 96px)' : '74vh' }}
      >
        {win.render()}
      </motion.div>
    </motion.div>
  );
}
