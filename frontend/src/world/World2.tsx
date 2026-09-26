import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Volume2, Wifi, LogOut, Search, Settings as SettingsIcon, Monitor } from 'lucide-react';
import { WinManagerProvider, useWinMgr } from './WinManager';
import Explorer, { ProjectFileApp, ResearchLab, ExperimentApp, PhotoViewerApp, MediaPlayerApp } from './Explorer';
import { TimelineApp, SkillsApp, SettingsApp } from './apps';
import { AppIcon, type IconKey } from '../win/icons';
import RockyChat from '../win/RockyChat';
import { PHOTOS, FILM } from '../data/photography';
import PixelatorApp from '../sections/PixelatorApp';

// ─────────────────────────────────────────────────────────────
// WORLD 2 — Himesh's computer. A Windows 7 / Frutiger Aero
// desktop entered through a cinematic transition. Day / Night
// modes, working taskbar + start menu, real file system.
// ─────────────────────────────────────────────────────────────

export default function World2({ onExit }: { onExit: () => void }) {
  const [night, setNight] = useState(() => sessionStorage.getItem('himeshos-night') === '1');
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => setBooted(true), 1500);
    return () => {
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    sessionStorage.setItem('himeshos-night', night ? '1' : '0');
  }, [night]);

  const exit = () => {
    onExit();
    window.setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 60);
  };

  return (
    <div className={`fixed inset-0 z-[300] ${night ? 'night' : ''}`} data-testid="world2" data-mode={night ? 'night' : 'day'}>
      <WinManagerProvider night={night} setNight={setNight} exitToPortfolio={exit}>
        <Desktop night={night} setNight={setNight} onExit={exit} booted={booted} />
      </WinManagerProvider>
    </div>
  );
}

/* ── desktop ─────────────────────────────────────────────── */

const DESKTOP_ICONS: Array<{ id: string; label: string; icon: IconKey }> = [
  { id: 'computer', label: 'Computer', icon: 'about' },
  { id: 'built', label: "Things I've Built", icon: 'folder' },
  { id: 'investigating', label: "Things I'm Investigating", icon: 'research' },
  { id: 'experiments', label: 'Experiments', icon: 'experiments' },
  { id: 'pixelator', label: 'Pixelator', icon: 'pixelator' },
  { id: 'pictures', label: 'Pictures', icon: 'viewer' },
  { id: 'music', label: 'Music', icon: 'media' },
  { id: 'timeline', label: 'Timeline', icon: 'calendar' },
  { id: 'skills', label: 'Skills', icon: 'file' },
];

function Desktop({
  night,
  setNight,
  onExit,
  booted,
}: {
  night: boolean;
  setNight: (b: boolean) => void;
  onExit: () => void;
  booted: boolean;
}) {
  const mgr = useWinMgr();
  const [startOpen, setStartOpen] = useState(false);
  const [ctx, setCtx] = useState<{ x: number; y: number } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const mobile = window.innerWidth < 768;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setStartOpen(false);
        setCtx(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openIcon = (id: string) => {
    if (id === 'pixelator') return mgr.open({ id: 'pixelator', title: 'Pixelator', icon: 'pixelator', w: 760, h: 640, render: () => <PixelatorApp /> });
    if (id === 'timeline') return mgr.open({ id: 'timeline', title: 'Himesh Timeline', icon: 'calendar', w: 560, h: 560, render: () => <TimelineApp /> });
    if (id === 'skills') return mgr.open({ id: 'skills', title: 'Skills', icon: 'file', w: 640, h: 480, render: () => <SkillsApp /> });
    if (id === 'settings') return mgr.open({ id: 'settings', title: 'Settings', icon: 'about', w: 560, h: 540, render: () => <SettingsApp /> });
    if (id === 'computer') return mgr.open({ id: 'computer', title: "Himesh's Computer", icon: 'about', w: 780, h: 540, render: () => <Explorer startNodeId="computer" /> });
    if (id === 'pictures')
      return mgr.open({
        id: 'pictures',
        title: 'Pictures',
        icon: 'viewer',
        w: 780,
        h: 540,
        render: () => <Explorer startNodeId="pictures" />,
      });
    return mgr.open({ id, title: DESKTOP_ICONS.find((d) => d.id === id)?.label ?? id, icon: 'folder', w: 780, h: 540, render: () => <Explorer startNodeId={id} /> });
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onContextMenu={(e) => {
        e.preventDefault();
        setCtx({ x: e.clientX, y: e.clientY });
      }}
      onClick={() => {
        setStartOpen(false);
        setCtx(null);
      }}
    >
      {/* wallpaper — day / night crossfade */}
      <div className="absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: 'url(/wallpaper.jpg)', filter: 'saturate(1.05)', opacity: night ? 0 : 1 }}
          data-testid="wallpaper-day"
        />
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: 'url(/wallpaper.jpg)',
            filter: 'brightness(0.3) saturate(0.65) hue-rotate(-12deg)',
            opacity: night ? 1 : 0,
          }}
          data-testid="wallpaper-night"
        />
        {night && (
          <>
            <div className="starfield-dark pointer-events-none absolute inset-0" aria-hidden="true" />
            <div
              className="pointer-events-none absolute right-[12%] top-[10%] h-24 w-24 rounded-full"
              style={{ background: 'radial-gradient(circle at 40% 40%, rgba(230,240,255,0.9), rgba(180,200,235,0.25) 60%, transparent 75%)', boxShadow: '0 0 60px rgba(190,215,255,0.5)' }}
              aria-hidden="true"
            />
          </>
        )}
      </div>

      {/* entry flash */}
      <AnimatePresence>
        {!booted && (
          <motion.div
            className="absolute inset-0 z-[2500] bg-[#020A14]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: 'radial-gradient(60% 50% at 50% 50%, rgba(140,210,255,0.95), rgba(20,80,140,0.55) 55%, transparent 80%)' }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: [0, 1, 0.9, 0], scale: [0.4, 1.6, 2.4, 3] }}
              transition={{ duration: 1.4, times: [0, 0.45, 0.7, 1] }}
            />
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 1.4 }} className="absolute inset-0 grid place-items-center font-mono text-[11px] tracking-[0.4em] text-[#BFE3F7]">
              WELCOME TO HIMESH'S COMPUTER
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* desktop icons */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: booted ? 1 : 0, y: booted ? 0 : 14 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className={
          mobile
            ? 'absolute inset-x-0 top-5 z-[2] grid grid-cols-3 gap-1 px-3'
            : 'absolute left-4 top-5 z-[2] flex max-h-[calc(100%-130px)] flex-col flex-wrap content-start gap-1'
        }
        data-testid="world2-icons"
      >
        {DESKTOP_ICONS.map((d) => (
          <button
            key={d.id}
            data-testid={`world2-icon-${d.id}`}
            onClick={() => (mobile ? openIcon(d.id) : setSelected(d.id))}
            onDoubleClick={() => !mobile && openIcon(d.id)}
            aria-label={`Open ${d.label}`}
            className={`flex w-[96px] flex-col items-center gap-1.5 rounded-xl border p-2.5 text-center transition-all ${
              selected === d.id ? 'border-[#7DD3FC]/60 bg-[#7DD3FC]/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]' : 'border-transparent hover:border-white/40 hover:bg-white/15'
            }`}
          >
            <span className="h-12 w-12 drop-shadow-[0_6px_12px_rgba(10,50,90,0.45)] [&>svg]:h-12 [&>svg]:w-12">
              <AppIcon name={d.icon} />
            </span>
            <span className="text-shadow-os text-[11px] font-medium leading-tight text-white">{d.label}</span>
          </button>
        ))}
      </motion.div>

      {/* windows render via WinManagerProvider (absolute in this fixed container) */}

      {/* context menu */}
      <AnimatePresence>
        {ctx && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="aero-surface absolute z-[2400] w-56 overflow-hidden rounded-xl border border-white/60 py-1.5 shadow-2xl"
            style={{ left: Math.min(ctx.x, window.innerWidth - 240), top: Math.min(ctx.y, window.innerHeight - 220) }}
            data-testid="desktop-context-menu"
          >
            {[
              { label: "Open Computer", fn: () => openIcon('computer') },
              { label: night ? 'Switch to Day mode' : 'Switch to Night mode', fn: () => setNight(!night) },
              { label: 'Open Rocky AI', fn: () => document.querySelector('[data-testid=rocky-chat-trigger]')?.dispatchEvent(new MouseEvent('click', { bubbles: true })) },
              { label: 'Back to Portfolio', fn: onExit },
            ].map((m) => (
              <button
                key={m.label}
                onClick={(e) => {
                  e.stopPropagation();
                  m.fn();
                  setCtx(null);
                }}
                className="block w-full px-4 py-2 text-left text-[12.5px] text-[#25384C] transition-colors hover:bg-[#D6ECFC]"
              >
                {m.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* start menu */}
      <AnimatePresence>
        {startOpen && (
          <StartMenu
            key="start2"
            night={night}
            onClose={() => setStartOpen(false)}
            onOpenIcon={openIcon}
            onExit={onExit}
          />
        )}
      </AnimatePresence>

      {/* taskbar */}
      <motion.div
        initial={{ y: 60 }}
        animate={{ y: booted ? 0 : 60 }}
        transition={{ delay: 0.7, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`absolute inset-x-0 bottom-0 z-[1700] flex h-[54px] items-center gap-2 border-t px-2 backdrop-blur-2xl ${
          night ? 'border-[#67C3EA]/25 bg-gradient-to-b from-[#0E2440]/90 to-[#050F1E]/95' : 'border-white/40 bg-gradient-to-b from-[#1B5A8F]/65 to-[#0A2C4E]/78'
        }`}
        data-testid="world2-taskbar"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          data-testid="world2-start-button"
          aria-label="Start"
          onClick={(e) => {
            e.stopPropagation();
            setStartOpen((s) => !s);
          }}
          className={`relative ml-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 transition-all active:scale-95 ${
            startOpen ? 'border-[#9FD8FF] shadow-[0_0_18px_rgba(125,211,252,0.8)]' : 'border-white/70 shadow-[0_0_12px_rgba(56,189,248,0.45)] hover:shadow-[0_0_20px_rgba(125,211,252,0.7)]'
          }`}
          style={{ background: 'radial-gradient(circle at 35% 30%, #7DD3FC 0%, #0EA5E9 45%, #0B4A8F 100%)' }}
        >
          <span className="text-base font-extrabold text-white drop-shadow">H</span>
          {!night && <span className="pointer-events-none absolute left-1.5 right-1.5 top-1 h-3 rounded-full bg-gradient-to-b from-white/80 to-transparent" aria-hidden="true" />}
        </button>

        <div className="mx-1 h-8 w-px bg-white/20" aria-hidden="true" />

        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto" data-testid="world2-taskbar-apps">
          {mgr.windows.map((w) => {
            const active = w.key === mgr.activeKey && !w.min;
            return (
              <button
                key={w.key}
                data-testid={`taskbar-app-${w.id}`}
                onClick={() => mgr.toggleFromTaskbar(w.key)}
                className={`flex h-10 max-w-[180px] shrink-0 items-center gap-2 rounded-lg border px-3 text-left transition-all ${
                  active
                    ? night
                      ? 'border-[#67C3EA]/50 bg-[#67C3EA]/20'
                      : 'border-white/60 bg-white/30'
                    : night
                      ? 'border-white/10 bg-white/5 hover:bg-white/10'
                      : 'border-white/20 bg-white/10 hover:bg-white/20'
                }`}
              >
                <span className="h-5 w-5 shrink-0 [&>svg]:h-5 [&>svg]:w-5">
                  <AppIcon name={w.icon} />
                </span>
                {!mobile && <span className="truncate text-[12px] font-medium text-white/95">{w.title}</span>}
              </button>
            );
          })}
        </div>

        {/* tray */}
        <div className="flex shrink-0 items-center gap-3 border-l border-white/20 pl-3 pr-2" data-testid="world2-tray">
          <Volume2 className="h-4 w-4 text-white/85" aria-label="Volume" />
          <Wifi className="h-4 w-4 text-white/85" aria-label="Network" />
          <button
            data-testid="night-toggle"
            aria-label={night ? 'Switch to day mode' : 'Switch to night mode'}
            onClick={(e) => {
              e.stopPropagation();
              setNight(!night);
            }}
            className={`grid h-8 w-8 place-items-center rounded-full border transition-all active:scale-90 ${
              night ? 'border-[#67C3EA]/40 bg-[#16304F]/80 text-[#BBDFF7]' : 'border-white/50 bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            {night ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
          </button>
          <Clock2 night={night} />
          <button
            onClick={onExit}
            aria-label="Back to portfolio"
            data-testid="world2-exit"
            className="grid h-8 w-8 place-items-center rounded-md border border-white/30 bg-white/10 text-white transition-all hover:bg-white/25 active:scale-95"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>

      {/* Rocky — floating above the desktop, bottom-right */}
      <RockyChat />
    </div>
  );
}

function Clock2({ night }: { night: boolean }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="flex flex-col items-end leading-tight">
      <span className="text-[12px] font-medium tabular-nums text-white/95">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      <span className="text-[9px] tabular-nums text-white/60">{now.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
    </div>
  );
}

/* ── start menu ──────────────────────────────────────────── */

const START_APPS: Array<{ id: string; label: string; icon: IconKey }> = [
  { id: 'computer', label: "Himesh's Computer", icon: 'about' },
  { id: 'built', label: "Things I've Built", icon: 'folder' },
  { id: 'investigating', label: "Things I'm Investigating", icon: 'research' },
  { id: 'experiments', label: 'Experiments', icon: 'experiments' },
  { id: 'pixelator', label: 'Pixelator', icon: 'pixelator' },
  { id: 'pictures', label: 'Pictures', icon: 'viewer' },
  { id: 'music', label: 'Music', icon: 'media' },
  { id: 'timeline', label: 'Himesh Timeline', icon: 'calendar' },
  { id: 'skills', label: 'Skills', icon: 'file' },
];

function StartMenu({
  night,
  onClose,
  onOpenIcon,
  onExit,
}: {
  night: boolean;
  onClose: () => void;
  onOpenIcon: (id: string) => void;
  onExit: () => void;
}) {
  const [q, setQ] = useState('');
  const apps = START_APPS.filter((a) => a.label.toLowerCase().includes(q.toLowerCase()));

  const launch = (id: string) => {
    onOpenIcon(id);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute bottom-[66px] left-2 z-[1800] w-[min(92vw,380px)] origin-bottom-left overflow-hidden rounded-2xl border shadow-[0_30px_80px_rgba(4,25,55,0.6)] ${
        night ? 'border-[#67C3EA]/30' : 'border-white/70'
      }`}
      style={{
        background: night
          ? 'linear-gradient(170deg, rgba(14,32,56,0.97), rgba(8,20,38,0.97))'
          : 'linear-gradient(165deg, rgba(240,250,255,0.96), rgba(214,236,252,0.93))',
        backdropFilter: 'blur(26px)',
      }}
      data-testid="world2-start-menu"
      onClick={(e) => e.stopPropagation()}
    >
      <div className={`flex items-center gap-3 border-b px-4 py-3 ${night ? 'border-[#67C3EA]/20' : 'border-white/70'}`}>
        <span className={`grid h-10 w-10 place-items-center rounded-xl border shadow-inner ${night ? 'border-[#67C3EA]/30 bg-[#16304F]' : 'border-white/80 bg-gradient-to-b from-[#D6ECFC] to-[#8FC8F0]'}`}>
          <AppIcon name="intro" className="h-7 w-7" />
        </span>
        <div>
          <p className={`text-sm font-bold ${night ? 'text-[#D8EAF8]' : 'text-[#173A5E]'}`}>Himesh Soni</p>
          <p className="font-mono text-[9px] tracking-[0.25em] text-[#7FA5C4]">HIMESHOS · AERO EDITION</p>
        </div>
        {night && <Moon className="ml-auto h-4 w-4 text-[#9FDBFA]" />}
      </div>

      <div className="px-3 pt-3">
        <div className={`flex items-center gap-2 rounded-full border px-4 py-2 shadow-inner ${night ? 'border-[#67C3EA]/25 bg-[#0A1B2E]/80' : 'border-[#9CC8E8] bg-white/85'}`}>
          <Search className="h-3.5 w-3.5 text-[#7FA5C4]" />
          <input
            data-testid="world2-start-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && apps[0]) launch(apps[0].id);
            }}
            placeholder="Search..."
            aria-label="Search applications"
            className={`w-full bg-transparent text-[13px] outline-none ${night ? 'text-[#D8EAF8] placeholder:text-[#5E8FAD]' : 'text-[#173A5E] placeholder:text-[#9FB9CE]'}`}
          />
        </div>
      </div>

      <div className="max-h-[40vh] overflow-y-auto p-2">
        {apps.map((a) => (
          <button
            key={a.id}
            data-testid={`world2-start-${a.id}`}
            onClick={() => launch(a.id)}
            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${night ? 'hover:bg-white/8 hover:bg-white/10' : 'hover:bg-white/70'}`}
          >
            <span className="h-8 w-8 shrink-0 transition-transform group-hover:scale-110 [&>svg]:h-8 [&>svg]:w-8">
              <AppIcon name={a.icon} />
            </span>
            <span className={`text-[13px] font-semibold ${night ? 'text-[#D8EAF8]' : 'text-[#173A5E]'}`}>{a.label}</span>
          </button>
        ))}
        <button
          data-testid="world2-start-settings"
          onClick={() => {
            onOpenIcon('settings');
            onClose();
          }}
          className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${night ? 'hover:bg-white/10' : 'hover:bg-white/70'}`}
        >
          <span className={`grid h-8 w-8 place-items-center rounded-lg border ${night ? 'border-[#67C3EA]/30 bg-[#16304F] text-[#BBDFF7]' : 'border-white/80 bg-white/70 text-[#33608A]'}`}>
            <SettingsIcon className="h-4 w-4" />
          </span>
          <span className={`text-[13px] font-semibold ${night ? 'text-[#D8EAF8]' : 'text-[#173A5E]'}`}>Settings</span>
        </button>
        {apps.length === 0 && (
          <p className={`px-4 py-5 text-center text-[12px] ${night ? 'text-[#6E93B5]' : 'text-[#7FA5C4]'}`}>No results found.</p>
        )}
      </div>

      <div className={`flex items-center justify-between border-t px-4 py-2.5 ${night ? 'border-[#67C3EA]/20' : 'border-white/70'}`}>
        <span className="font-mono text-[8.5px] tracking-[0.25em] text-[#7FA5C4]">AERO · FRUTIGER EDITION</span>
        <button
          data-testid="world2-back-to-portfolio"
          onClick={onExit}
          className="flex items-center gap-2 rounded-lg border border-white/60 bg-white/70 px-3 py-1.5 text-[12px] font-medium text-[#173A5E] shadow-sm transition-all hover:bg-white active:scale-95"
        >
          <LogOut className="h-3.5 w-3.5" /> Back to Portfolio
        </button>
      </div>
    </motion.div>
  );
}
