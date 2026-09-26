import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Minus, Maximize2, X } from 'lucide-react';
import { AppIcon, type IconKey } from '../win/icons';

// ─────────────────────────────────────────────────────────────
// WORLD 2 WINDOW MANAGER — draggable, minimizable, maximizable
// Aero windows with focus/z-order + taskbar integration.
// ─────────────────────────────────────────────────────────────

export type WinInstance = {
  key: number;
  id: string;
  title: string;
  icon: IconKey;
  w: number;
  h: number;
  x: number;
  y: number;
  min: boolean;
  max: boolean;
  z: number;
  render: () => ReactNode;
};

type WinMgr = {
  windows: WinInstance[];
  activeKey: number | null;
  open: (w: { id: string; title: string; icon: IconKey; w?: number; h?: number; render: () => ReactNode }) => void;
  close: (key: number) => void;
  minimize: (key: number) => void;
  toggleMax: (key: number) => void;
  focus: (key: number) => void;
  toggleFromTaskbar: (key: number) => void;
  night: boolean;
  setNight: (b: boolean) => void;
  exitToPortfolio: () => void;
};

const Ctx = createContext<WinMgr | null>(null);
export function useWinMgr(): WinMgr {
  const c = useContext(Ctx);
  if (!c) throw new Error('useWinMgr outside World2');
  return c;
}

export function WinManagerProvider({
  children,
  night,
  setNight,
  exitToPortfolio,
}: {
  children: ReactNode;
  night: boolean;
  setNight: (b: boolean) => void;
  exitToPortfolio: () => void;
}) {
  const [windows, setWindows] = useState<WinInstance[]>([]);
  const zCounter = useRef(100);
  const cascade = useRef(0);

  const focus = useCallback((key: number) => {
    zCounter.current += 1;
    const z = zCounter.current;
    setWindows((ws) => ws.map((w) => (w.key === key ? { ...w, z, min: false } : w)));
  }, []);

  const open: WinMgr['open'] = useCallback(
    (w) => {
      setWindows((ws) => {
        const existing = ws.find((x) => x.id === w.id);
        zCounter.current += 1;
        const z = zCounter.current;
        if (existing) return ws.map((x) => (x.key === existing.key ? { ...x, min: false, z } : x));
        const n = cascade.current++ % 6;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const ww = Math.min(w.w ?? 760, vw - 30);
        const wh = Math.min(w.h ?? 540, vh - 130);
        return [
          ...ws,
          {
            key: z,
            id: w.id,
            title: w.title,
            icon: w.icon,
            w: ww,
            h: wh,
            x: Math.max(14, Math.min(70 + n * 38, vw - ww - 20)),
            y: Math.max(12, Math.min(40 + n * 30, vh - wh - 90)),
            min: false,
            max: false,
            z,
            render: w.render,
          },
        ];
      });
    },
    []
  );

  const close = useCallback((key: number) => setWindows((ws) => ws.filter((w) => w.key !== key)), []);
  const minimize = useCallback((key: number) => setWindows((ws) => ws.map((w) => (w.key === key ? { ...w, min: true } : w))), []);
  const toggleMax = useCallback((key: number) => setWindows((ws) => ws.map((w) => (w.key === key ? { ...w, max: !w.max } : w))), []);

  const toggleFromTaskbar = useCallback(
    (key: number) => {
      setWindows((ws) => {
        const win = ws.find((w) => w.key === key);
        if (!win) return ws;
        const topZ = Math.max(...ws.map((w) => w.z));
        if (win.min) {
          zCounter.current += 1;
          return ws.map((w) => (w.key === key ? { ...w, min: false, z: zCounter.current } : w));
        }
        if (win.z === topZ) return ws.map((w) => (w.key === key ? { ...w, min: true } : w));
        zCounter.current += 1;
        return ws.map((w) => (w.key === key ? { ...w, z: zCounter.current } : w));
      });
    },
    []
  );

  const activeKey = windows.length
    ? windows.reduce((a, b) => (!b.min && b.z > a.z ? b : a), windows[0]).key
    : null;

  return (
    <Ctx.Provider value={{ windows, activeKey, open, close, minimize, toggleMax, focus, toggleFromTaskbar, night, setNight, exitToPortfolio }}>
      {children}
      <AnimatePresence>
        {windows
          .filter((w) => !w.min)
          .map((w) => (
            <AeroAppWindow key={w.key} win={w} />
          ))}
      </AnimatePresence>
    </Ctx.Provider>
  );
}

function AeroAppWindow({ win }: { win: WinInstance }) {
  const { focus, close, minimize, toggleMax, night } = useWinMgr();
  const reduced = useReducedMotion();
  const [pos, setPos] = useState({ x: win.x, y: win.y });
  const mobile = window.innerWidth < 768;
  const full = mobile || win.max;

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, scale: 0.94, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, scale: 0.95, y: 12 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      className={`aero-surface pointer-events-auto absolute flex flex-col overflow-hidden rounded-xl border shadow-[0_40px_90px_rgba(3,25,50,0.55)] ${
        night ? 'aero-surface-night border-[#67C3EA]/30' : 'border-white/60'
      }`}
      style={
        full
          ? { left: 8, top: 8, right: 8, bottom: 66, zIndex: win.z }
          : { left: pos.x, top: pos.y, width: win.w, height: win.h, zIndex: win.z }
      }
      onPointerDown={() => focus(win.key)}
      role="dialog"
      aria-label={win.title}
      data-testid={`win2-${win.id}`}
    >
      <div
        className={`aero-titlebar relative flex h-10 shrink-0 items-center justify-between border-b px-2.5 select-none ${
          night
            ? 'border-[#67C3EA]/25 bg-gradient-to-b from-[#1E3A5C]/95 to-[#122642]/92'
            : 'border-white/60 bg-gradient-to-b from-[#D5ECFD]/95 to-[#ABD6F6]/85'
        }`}
        style={{ cursor: full ? 'default' : 'grab' }}
        onPointerDown={startDrag}
        onDoubleClick={() => !mobile && toggleMax(win.key)}
      >
        {!night && <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-xl bg-gradient-to-b from-white/75 to-transparent" aria-hidden="true" />}
        <div className="relative flex items-center gap-2 pl-1">
          <span className="h-5 w-5 [&>svg]:h-5 [&>svg]:w-5">
            <AppIcon name={win.icon} />
          </span>
          <span className={`max-w-[50vw] truncate text-[12.5px] font-semibold tracking-wide ${night ? 'text-[#D8EAF8]' : 'text-[#1A3A5C]'}`}>
            {win.title}
          </span>
        </div>
        <div className="relative flex items-center gap-1.5">
          <WinBtn label="Minimize window" testid={`win2-${win.id}-min`} night={night} onClick={() => minimize(win.key)}>
            <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
          </WinBtn>
          <WinBtn label="Maximize window" testid={`win2-${win.id}-max`} night={night} onClick={() => !mobile && toggleMax(win.key)}>
            <Maximize2 className="h-3 w-3" strokeWidth={2.5} />
          </WinBtn>
          <button
            data-testid={`win2-${win.id}-close`}
            aria-label="Close window"
            onClick={(e) => {
              e.stopPropagation();
              close(win.key);
            }}
            className="grid h-7 w-8 place-items-center rounded-md border border-[#E8A9A0] bg-gradient-to-b from-[#F09588] to-[#D2554A] text-white shadow-sm transition-all hover:from-[#F8A89C] active:scale-95"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className={`aero-body relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden ${night ? 'aero-body-night' : 'text-[#25384C]'}`}>
        {win.render()}
      </div>
    </motion.div>
  );

  function startDrag(e: React.PointerEvent) {
    if (full) return;
    e.preventDefault();
    focus(win.key);
    const sx = e.clientX;
    const sy = e.clientY;
    const ox = pos.x;
    const oy = pos.y;
    const onMove = (ev: PointerEvent) => {
      setPos({
        x: Math.min(Math.max(ox + ev.clientX - sx, -win.w + 140), window.innerWidth - 80),
        y: Math.min(Math.max(oy + ev.clientY - sy, 0), window.innerHeight - 120),
      });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }
}

function WinBtn({
  children,
  label,
  testid,
  night,
  onClick,
}: {
  children: ReactNode;
  label: string;
  testid: string;
  night: boolean;
  onClick: () => void;
}) {
  return (
    <button
      data-testid={testid}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`grid h-7 w-8 place-items-center rounded-md border shadow-sm transition-all active:scale-95 ${
        night
          ? 'border-[#67C3EA]/30 bg-gradient-to-b from-[#22436B]/90 to-[#16304F]/85 text-[#BBDFF7] hover:from-[#2B5580]'
          : 'border-white/70 bg-gradient-to-b from-white/90 to-[#DCEEFC]/80 text-[#33567A] hover:from-white'
      }`}
    >
      {children}
    </button>
  );
}
