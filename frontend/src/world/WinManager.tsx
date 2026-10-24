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

// authentic Windows Vista Aero window frame — translucent glass border + blur + specular reflection
function frameStyle(night: boolean): React.CSSProperties {
  return {
    background: night
      ? 'linear-gradient(180deg, rgba(90,140,190,0.28) 0%, rgba(28,54,90,0.38) 10%, rgba(10,24,48,0.58) 60%, rgba(5,14,30,0.72) 100%)'
      : 'linear-gradient(180deg, rgba(235,246,255,0.55) 0%, rgba(185,220,248,0.42) 10%, rgba(145,195,235,0.48) 60%, rgba(125,180,225,0.60) 100%)',
    boxShadow: night
      ? 'inset 0 1px 0 rgba(255,255,255,0.65), inset 0 0 0 1px rgba(125,211,252,0.35), 0 35px 90px rgba(0,0,0,0.75)'
      : 'inset 0 1px 0 rgba(255,255,255,0.9), inset 0 0 0 1px rgba(255,255,255,0.55), 0 30px 80px rgba(5,25,55,0.55)',
    backdropFilter: 'blur(24px) saturate(1.8)',
    WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
  } as React.CSSProperties;
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
      className={`pointer-events-auto absolute flex flex-col overflow-hidden rounded-[10px] border shadow-[0_35px_90px_rgba(0,0,0,0.65)] ${
        night ? 'border-[#67C3EA]/35' : 'border-white/70'
      }`}
      style={
        full
          ? { left: 8, top: 8, right: 8, bottom: 62, zIndex: win.z, ...frameStyle(night) }
          : { left: pos.x, top: pos.y, width: win.w + 14, height: win.h + 14, zIndex: win.z, ...frameStyle(night) }
      }
      onPointerDown={() => focus(win.key)}
      role="dialog"
      aria-label={win.title}
      data-testid={`win2-${win.id}`}
    >
      {/* Vista diagonal Aero reflection sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.1) 25%, transparent 55%)',
        }}
      />

      {/* Windows Vista Aero Titlebar */}
      <div
        className={`relative z-10 flex h-9 shrink-0 items-center justify-between border-b px-2 select-none ${
          night ? 'border-[#67C3EA]/25 bg-black/15' : 'border-white/50 bg-white/20'
        }`}
        style={{ cursor: full ? 'default' : 'grab' }}
        onPointerDown={startDrag}
        onDoubleClick={() => !mobile && toggleMax(win.key)}
      >
        {/* Vista specular top light glare */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[14px] bg-gradient-to-b from-white/70 to-transparent opacity-80" aria-hidden="true" />
        
        <div className="relative flex items-center gap-2 pl-1">
          <span className="h-4.5 w-4.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] [&>svg]:h-4.5 [&>svg]:w-4.5">
            <AppIcon name={win.icon} />
          </span>
          <span className={`max-w-[50vw] truncate text-[12.5px] font-semibold tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] ${night ? 'text-[#EAF4FC]' : 'text-[#0E2842]'}`}>
            {win.title}
          </span>
        </div>

        {/* Windows Vista Window Controls Cluster */}
        <div className="relative flex items-center gap-1">
          <WinBtn label="Minimize window" testid={`win2-${win.id}-min`} night={night} onClick={() => minimize(win.key)}>
            <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
          </WinBtn>
          <WinBtn label="Maximize window" testid={`win2-${win.id}-max`} night={night} onClick={() => !mobile && toggleMax(win.key)}>
            <Maximize2 className="h-3 w-3" strokeWidth={2.5} />
          </WinBtn>
          
          {/* Iconic Windows Vista Glowing Red Close Button */}
          <button
            data-testid={`win2-${win.id}-close`}
            aria-label="Close window"
            onClick={(e) => {
              e.stopPropagation();
              close(win.key);
            }}
            className="group relative grid h-[22px] w-[44px] place-items-center rounded-[4px] border border-[#FF9999]/60 text-white shadow-[0_1px_2px_rgba(0,0,0,0.45)] transition-all hover:shadow-[0_0_16px_rgba(255,40,20,0.95)] active:scale-95"
            style={{
              background: 'linear-gradient(180deg, #E65A4E 0%, #D32F2F 50%, #B71C1C 100%)',
            }}
          >
            {/* Top glass highlight */}
            <span aria-hidden="true" className="pointer-events-none absolute inset-x-0.5 top-0 h-[8px] rounded-t-[3px] bg-gradient-to-b from-white/75 to-transparent" />
            <X className="relative z-10 h-3.5 w-3.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" strokeWidth={2.8} />
          </button>
        </div>
      </div>

      {/* Windows Vista Explorer Navigation & Command Bar */}
      <div
        className={`relative z-10 flex flex-wrap items-center justify-between gap-1.5 border-b px-2.5 py-1 text-[11px] select-none ${
          night
            ? 'border-[#67C3EA]/20 bg-gradient-to-b from-[#10243E]/90 to-[#0A182A]/90 text-[#CBE3F5]'
            : 'border-white/70 bg-gradient-to-b from-[#F2F8FE]/95 to-[#E1EFFC]/90 text-[#1E3B5C]'
        }`}
      >
        {/* Vista Back/Forward buttons and Breadcrumb bar */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[220px]">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              title="Back"
              className="grid h-[22px] w-[22px] place-items-center rounded-full border border-sky-300/70 bg-gradient-to-b from-[#56B8FF] to-[#1E88E5] text-white shadow-sm hover:brightness-110 active:scale-95"
            >
              <span className="text-[10px] font-bold">◀</span>
            </button>
            <button
              type="button"
              title="Forward"
              className="grid h-[22px] w-[22px] place-items-center rounded-full border border-sky-300/40 bg-gradient-to-b from-sky-400/50 to-sky-600/50 text-white/60 shadow-sm"
              disabled
            >
              <span className="text-[10px] font-bold">▶</span>
            </button>
          </div>

          {/* Breadcrumb address bar */}
          <div
            className={`flex items-center gap-1.5 flex-1 rounded-[4px] border px-2 py-0.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] ${
              night
                ? 'border-sky-500/30 bg-black/45 text-sky-200'
                : 'border-sky-300/70 bg-white/95 text-slate-800'
            }`}
          >
            <span className="h-3.5 w-3.5 [&>svg]:h-3.5 [&>svg]:w-3.5 opacity-80">
              <AppIcon name={win.icon} />
            </span>
            <span className="opacity-60 text-[10px]">Computer</span>
            <span className="opacity-40 text-[9px]">▸</span>
            <span className="font-semibold text-[11px] truncate">{win.title}</span>
          </div>
        </div>

        {/* Vista Command Bar Actions */}
        <div className="flex items-center gap-2.5 px-1 font-medium opacity-85">
          <span className="cursor-pointer hover:underline hover:text-sky-500 transition-colors">Organize ▾</span>
          <span className="cursor-pointer hover:underline hover:text-sky-500 transition-colors">Views ▾</span>
          <span className="hidden sm:inline cursor-pointer hover:underline hover:text-sky-500 transition-colors">Properties</span>
        </div>
      </div>

      <div
        className={`aero-body relative z-10 mx-1.5 mb-1.5 min-h-0 flex-1 overflow-y-auto overflow-x-hidden rounded-[6px] border ${
          night ? 'aero-body-night border-[#67C3EA]/25' : 'border-white/85 bg-[#F7FBFF] text-[#25384C]'
        }`}
      >
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
      className={`relative grid h-[22px] w-[30px] place-items-center rounded-[4px] border shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-all active:scale-95 ${
        night
          ? 'border-[#67C3EA]/40 bg-gradient-to-b from-[#2E5B8E]/85 to-[#16365C]/85 text-[#BBDFF7] hover:from-[#3D74B4] hover:shadow-[0_0_10px_rgba(100,185,255,0.6)]'
          : 'border-white/80 bg-gradient-to-b from-white/95 to-[#D3E8F8]/90 text-[#254A6E] hover:from-white hover:shadow-[0_0_10px_rgba(255,255,255,0.8)]'
      }`}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0.5 top-0 h-[8px] rounded-t-[3px] bg-gradient-to-b from-white/80 to-transparent" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
