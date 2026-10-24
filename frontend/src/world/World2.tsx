import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Volume2, VolumeX, Wifi, LogOut, Search, Settings as SettingsIcon, Monitor, Power, Lock } from 'lucide-react';
import { WinManagerProvider, useWinMgr } from './WinManager';
import { isSoundOn, setSoundOn, playStartup, playLogout } from '../win/sounds';
import Explorer, { ProjectFileApp, ResearchLab, ExperimentApp, PhotoViewerApp, MediaPlayerApp } from './Explorer';
import { TimelineApp, SkillsApp, SettingsApp } from './apps';
import { ResumeApp, ContactApp } from './apps';
import { AppIcon, type IconKey } from '../win/icons';
import RockyChat from '../win/RockyChat';
import BootScreen, { LoginScreen } from '../BootLogin';
import { PHOTOS, FILM } from '../data/photography';
import PixelatorApp from '../sections/PixelatorApp';

// ─────────────────────────────────────────────────────────────
// WORLD 2 — Himesh's computer. A Windows 7 / Frutiger Aero
// desktop entered through a cinematic transition. Day / Night
// modes, working taskbar + start menu, real file system.
// ─────────────────────────────────────────────────────────────

type Phase = 'boot' | 'login' | 'desktop' | 'logout';

export default function World2({ onExit }: { onExit: () => void }) {
  const [night, setNight] = useState(() => sessionStorage.getItem('himeshos-night') === '1');
  const [phase, setPhase] = useState<Phase>('boot');

  useEffect(() => {
    playStartup(); // Vista-style startup chime (respects the sound toggle)
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    sessionStorage.setItem('himeshos-night', night ? '1' : '0');
  }, [night]);

  // Back to Portfolio: show the Vista logout screen first, then return to
  // the world's end — Himesh's real contact details. The jump is instant
  // so the scroll never re-crosses the space act (no auto re-entry).
  const exit = () => {
    if (phase === 'logout') return;
    playLogout(); // Vista-style logout chime (respects the sound toggle)
    setPhase('logout');
    window.setTimeout(() => {
      onExit();
      window.setTimeout(() => document.getElementById('site-end')?.scrollIntoView({ behavior: 'auto' }), 60);
    }, 2000);
  };

  return (
    <div
      className={`fixed inset-0 z-[300] ${night ? 'night' : ''}`}
      data-testid="world2"
      data-mode={night ? 'night' : 'day'}
      data-phase={phase}
    >
      {phase === 'boot' && <BootScreen onDone={() => setPhase('login')} />}
      {phase === 'login' && <LoginScreen onEnter={() => setPhase('desktop')} />}
      {phase === 'desktop' && (
        <WinManagerProvider night={night} setNight={setNight} exitToPortfolio={exit}>
          <Desktop night={night} setNight={setNight} onExit={exit} />
        </WinManagerProvider>
      )}
      {phase === 'logout' && <LoggingOutScreen />}
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
  { id: 'resume', label: 'Resume', icon: 'file' },
  { id: 'contact', label: 'Contact', icon: 'about' },
];

const PORTFOLIO_TABS: Array<{ id: string; label: string; filter?: string[] }> = [
  { id: 'all', label: '✦ All Work' },
  { id: 'built', label: '🚀 Built Projects', filter: ['computer', 'built', 'pixelator', 'experiments'] },
  { id: 'research', label: '🔬 Research & Lab', filter: ['investigating', 'computer'] },
  { id: 'career', label: '💼 Career & Skills', filter: ['timeline', 'skills', 'resume', 'contact'] },
  { id: 'media', label: '🎨 Media & Art', filter: ['pictures', 'music'] },
];

const DEFAULT_ICON_POSITIONS: Record<string, { x: number; y: number }> = {
  computer: { x: 20, y: 76 },
  built: { x: 20, y: 202 },
  investigating: { x: 20, y: 328 },
  experiments: { x: 20, y: 454 },
  pixelator: { x: 20, y: 580 },
  pictures: { x: 154, y: 76 },
  music: { x: 154, y: 202 },
  timeline: { x: 154, y: 328 },
  skills: { x: 154, y: 454 },
  resume: { x: 154, y: 580 },
  contact: { x: 288, y: 76 },
};

function Desktop({
  night,
  setNight,
  onExit,
}: {
  night: boolean;
  setNight: (b: boolean) => void;
  onExit: () => void;
}) {
  const mgr = useWinMgr();
  const [startOpen, setStartOpen] = useState(false);
  const [ctx, setCtx] = useState<{ x: number; y: number } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [sound, setSound] = useState<boolean>(isSoundOn());
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const visibleIcons = useMemo(() => {
    const tab = PORTFOLIO_TABS.find((t) => t.id === activeTab);
    if (!tab || !tab.filter) return DESKTOP_ICONS;
    return DESKTOP_ICONS.filter((i) => tab.filter!.includes(i.id));
  }, [activeTab]);

  useEffect(() => {
    const sync = () => setSound(isSoundOn());
    window.addEventListener('himeshos-sound-change', sync);
    return () => window.removeEventListener('himeshos-sound-change', sync);
  }, []);

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
    if (id === 'resume') return mgr.open({ id: 'resume', title: 'Resume — Himesh Soni', icon: 'file', w: 680, h: 600, render: () => <ResumeApp /> });
    if (id === 'contact') return mgr.open({ id: 'contact-app', title: 'Contact', icon: 'about', w: 620, h: 560, render: () => <ContactApp /> });
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
      ref={desktopRef}
      className="absolute inset-0 overflow-hidden"
      onContextMenu={(e) => {
        e.preventDefault();
        setCtx({ x: e.clientX, y: e.clientY });
      }}
      onClick={() => {
        setStartOpen(false);
        setCtx(null);
        setSelected(null);
      }}
    >
      {/* wallpaper — Windows Vista Aurora day / night crossfade */}
      <div className="absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: 'url(/wallpaper.jpg)', filter: 'saturate(1.08)', opacity: night ? 0 : 1 }}
          data-testid="wallpaper-day"
        />
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: 'url(/wallpaper.jpg)',
            filter: 'brightness(0.32) saturate(0.7) hue-rotate(-15deg)',
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

      {/* Windows Vista Aero Portfolio Tabs Header */}
      <div className="pointer-events-auto absolute top-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 rounded-full border border-white/60 bg-gradient-to-b from-white/35 via-white/20 to-white/10 p-1 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <span className="hidden sm:inline-block px-3 text-[11px] font-bold tracking-wider text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            PORTFOLIO
          </span>
          {PORTFOLIO_TABS.map((t) => {
            const active = activeTab === t.id;
            const count = t.filter
              ? DESKTOP_ICONS.filter((i) => t.filter!.includes(i.id)).length
              : DESKTOP_ICONS.length;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTab(t.id);
                  setSelected(null);
                }}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-semibold transition-all ${
                  active
                    ? 'border border-cyan-300/90 bg-gradient-to-b from-[#64B5F6] to-[#1976D2] text-white shadow-[0_0_14px_rgba(33,150,243,0.7),inset_0_1px_0_rgba(255,255,255,0.8)]'
                    : 'border border-transparent text-white/85 hover:border-white/50 hover:bg-white/20 hover:text-white'
                }`}
              >
                <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{t.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                    active ? 'bg-white/30 text-white' : 'bg-black/35 text-white/80'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-2 rounded-full border border-white/40 bg-black/30 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md">
          <span>💡 Movable Vista Icons — drag anywhere</span>
        </div>
      </div>

      {/* Windows Vista Movable & Bigger Desktop Icons Arranged by Portfolio Tab */}
      <div className="pointer-events-auto absolute inset-0 z-[2]" data-testid="world2-icons">
        <AnimatePresence>
          {visibleIcons.map((d, idx) => {
            const initPos =
              activeTab === 'all'
                ? DEFAULT_ICON_POSITIONS[d.id] ?? { x: 20, y: 76 }
                : { x: 28 + (idx % 5) * 138, y: 76 + Math.floor(idx / 5) * 136 };

            return (
              <motion.div
                key={`${activeTab}-${d.id}`}
                initial={{ opacity: 0, scale: 0.88, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.88 }}
                transition={{ duration: 0.2 }}
                drag={!mobile}
                dragMomentum={false}
                dragElastic={0.06}
                dragConstraints={desktopRef}
                whileDrag={{ scale: 1.08, zIndex: 120, filter: 'drop-shadow(0 18px 25px rgba(0,0,0,0.7))' }}
                style={{
                  position: 'absolute',
                  left: initPos.x,
                  top: initPos.y,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(d.id);
                  if (mobile) openIcon(d.id);
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (!mobile) openIcon(d.id);
                }}
                data-testid={`world2-icon-${d.id}`}
                aria-label={`Open ${d.label}`}
                className={`group flex w-[116px] cursor-pointer flex-col items-center gap-1.5 rounded-xl border p-2.5 text-center select-none transition-colors ${
                  selected === d.id
                    ? 'border-[#70C5F5]/90 bg-[#42A5F5]/30 shadow-[inset_0_0_12px_rgba(125,211,252,0.5),0_0_16px_rgba(66,165,245,0.4)] backdrop-blur-[4px]'
                    : 'border-transparent hover:border-white/50 hover:bg-white/20 hover:backdrop-blur-[2px]'
                }`}
              >
                {/* Bigger Icon: 64x64px with Vista 3D drop-shadow */}
                <span className="h-16 w-16 drop-shadow-[0_8px_16px_rgba(0,0,0,0.65)] transition-transform group-hover:scale-105 [&>svg]:h-16 [&>svg]:w-16">
                  <AppIcon name={d.icon} />
                </span>
                <span className="text-[12px] font-semibold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)] max-w-[108px] line-clamp-2 leading-tight">
                  {d.label}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

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

      {/* Windows Vista 2-Pane Start Menu */}
      <AnimatePresence>
        {startOpen && (
          <VistaStartMenu
            night={night}
            onClose={() => setStartOpen(false)}
            onOpenIcon={openIcon}
            onExit={onExit}
          />
        )}
      </AnimatePresence>

      {/* Windows Vista Aero Taskbar */}
      <motion.div
        initial={{ y: 60 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`absolute inset-x-0 bottom-0 z-[1700] flex h-[48px] items-center gap-2 border-t px-2 backdrop-blur-2xl ${
          night
            ? 'border-white/20 bg-gradient-to-b from-black/80 to-[#040A14]/95 shadow-[0_-2px_15px_rgba(0,0,0,0.7)]'
            : 'border-white/35 bg-gradient-to-b from-[#0F1D2C]/85 via-black/85 to-[#06101C]/95 shadow-[0_-2px_20px_rgba(0,0,0,0.6)]'
        }`}
        data-testid="world2-taskbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top 1px Vista Specular Highlight Line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" aria-hidden="true" />

        {/* Iconic Windows Vista 3D Start Orb (protrudes above taskbar) */}
        <VistaStartOrb
          isOpen={startOpen}
          onClick={(e) => {
            e.stopPropagation();
            setStartOpen((s) => !s);
          }}
        />

        <div className="mx-1 h-7 w-px bg-white/20" aria-hidden="true" />

        {/* Windows Vista Running Taskbar Tabs */}
        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto" data-testid="world2-taskbar-apps">
          {mgr.windows.map((w) => {
            const active = w.key === mgr.activeKey && !w.min;
            return (
              <button
                key={w.key}
                data-testid={`taskbar-app-${w.id}`}
                onClick={() => mgr.toggleFromTaskbar(w.key)}
                className={`group relative flex h-[34px] max-w-[190px] shrink-0 items-center gap-2 rounded-[5px] border px-2.5 text-left transition-all ${
                  active
                    ? 'border-[#9FE0FF]/80 bg-gradient-to-b from-[#2B7CBD]/60 to-[#124E82]/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_0_12px_rgba(56,189,248,0.5)]'
                    : 'border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/20 hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]'
                }`}
              >
                {/* Top specular highlight on tab */}
                <span aria-hidden="true" className="pointer-events-none absolute inset-x-1 top-0 h-[8px] rounded-t-[4px] bg-gradient-to-b from-white/60 to-transparent" />
                <span className="relative z-10 h-4.5 w-4.5 shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] [&>svg]:h-4.5 [&>svg]:w-4.5">
                  <AppIcon name={w.icon} />
                </span>
                {!mobile && (
                  <span className="relative z-10 truncate text-[12px] font-medium text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                    {w.title}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Windows Vista System Tray */}
        <div className="flex shrink-0 items-center gap-2.5 border-l border-white/20 pl-2.5 pr-1.5" data-testid="world2-tray">
          <button
            data-testid="sound-toggle"
            aria-label={sound ? 'Mute system sounds' : 'Unmute system sounds'}
            title={sound ? 'Mute system sounds' : 'Unmute system sounds'}
            onClick={(e) => {
              e.stopPropagation();
              const n = !sound;
              setSound(n);
              setSoundOn(n);
            }}
            className={`grid h-7 w-7 place-items-center rounded-md border transition-all active:scale-90 ${
              sound ? 'border-white/40 bg-white/15 text-white hover:bg-white/25' : 'border-[#E8A9A0]/60 bg-[#3A1D1D]/60 text-[#F0B5AC]'
            }`}
          >
            {sound ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          </button>
          
          <Wifi className="h-3.5 w-3.5 text-white/85" aria-label="Network" />
          
          <button
            data-testid="night-toggle"
            aria-label={night ? 'Switch to day mode' : 'Switch to night mode'}
            onClick={(e) => {
              e.stopPropagation();
              setNight(!night);
            }}
            className={`grid h-7 w-7 place-items-center rounded-md border transition-all active:scale-90 ${
              night ? 'border-[#67C3EA]/40 bg-[#16304F]/80 text-[#BBDFF7]' : 'border-white/40 bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            {night ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
          </button>
          
          <Clock2 night={night} />

          <button
            onClick={onExit}
            aria-label="Back to portfolio"
            title="Log off & Back to Portfolio"
            data-testid="world2-exit"
            className="grid h-7 w-7 place-items-center rounded-md border border-white/30 bg-white/10 text-white transition-all hover:bg-white/25 active:scale-95"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>

          {/* Vista Show Desktop vertical bar at far right */}
          <div
            title="Show Desktop"
            onClick={() => {
              mgr.windows.forEach((w) => {
                if (!w.min) mgr.minimize(w.key);
              });
            }}
            className="ml-1 h-8 w-2 cursor-pointer rounded-r-sm border-l border-white/40 bg-white/15 hover:bg-white/35"
          />
        </div>
      </motion.div>

      {/* Rocky — floating above the desktop, bottom-right */}
      <RockyChat />
    </div>
  );
}

// ── Windows Vista 3D Start Orb ──────────────────────────────

function VistaStartOrb({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      data-testid="world2-start-button"
      aria-label="Start"
      onClick={onClick}
      className={`group relative -top-2 ml-0.5 h-[50px] w-[50px] shrink-0 rounded-full transition-all active:scale-95 ${
        isOpen
          ? 'shadow-[0_0_28px_rgba(0,195,255,0.95)]'
          : 'shadow-[0_3px_14px_rgba(0,0,0,0.85),0_0_18px_rgba(56,189,248,0.5)] hover:shadow-[0_0_28px_rgba(56,189,248,0.95)]'
      }`}
      style={{
        background: 'radial-gradient(circle at 40% 32%, #42A5F5 0%, #1565C0 46%, #0A2E63 85%, #051A3B 100%)',
        border: '2px solid rgba(220, 240, 255, 0.85)',
      }}
    >
      {/* 3D Glass Specular Highlight top hemisphere */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-1.5 top-0.5 h-[21px] rounded-full bg-gradient-to-b from-white/90 via-white/25 to-transparent"
      />

      {/* Windows Vista 4-colored glass pearl emblem */}
      <div className="relative mx-auto flex h-5 w-5 rotate-[-8deg] flex-wrap items-center justify-center gap-[2.5px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
        {/* Red: top-left */}
        <span className="h-[8.5px] w-[8.5px] rounded-tl-[4px] rounded-br-[1px] bg-gradient-to-br from-[#FF6B6B] to-[#D32F2F] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]" />
        {/* Green: top-right */}
        <span className="h-[8.5px] w-[8.5px] rounded-tr-[4px] rounded-bl-[1px] bg-gradient-to-br from-[#81C784] to-[#388E3C] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]" />
        {/* Blue: bottom-left */}
        <span className="h-[8.5px] w-[8.5px] rounded-bl-[4px] rounded-tr-[1px] bg-gradient-to-br from-[#64B5F6] to-[#1976D2] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]" />
        {/* Yellow: bottom-right */}
        <span className="h-[8.5px] w-[8.5px] rounded-br-[4px] rounded-tl-[1px] bg-gradient-to-br from-[#FFD54F] to-[#FFA000] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]" />
      </div>

      {/* Bottom rim reflection */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-2.5 bottom-1 h-1.5 rounded-full bg-gradient-to-t from-white/40 to-transparent blur-[1px]"
      />
    </button>
  );
}




// ── logout screen ───────────────────────────────────────────

function LoggingOutScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#020a12]"
      data-testid="logout-screen"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(14, 55, 95, 0.6) 0%, rgba(2, 10, 18, 0.98) 75%)',
        }}
      />
      <div className="relative z-10 flex flex-col items-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-cyan-400/20 border-t-cyan-400" />
        <p className="mt-6 font-display text-2xl font-light tracking-wide text-white">Logging off...</p>
        <p className="mt-2 text-sm text-[#7BA6CC]">Returning to portfolio</p>
      </div>
    </motion.div>
  );
}

function Clock2({ night }: { night: boolean }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="flex flex-col items-end leading-tight select-none">
      <span className="text-[12px] font-semibold tabular-nums text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
      <span className="text-[9px] tabular-nums text-white/70">
        {now.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' })}
      </span>
    </div>
  );
}

/* ── Windows Vista 2-Pane Start Menu ─────────────────────── */

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
  { id: 'resume', label: 'Resume', icon: 'file' },
  { id: 'contact', label: 'Contact', icon: 'about' },
];

function VistaStartMenu({
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
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute bottom-[54px] left-2 z-[1800] flex w-[min(94vw,440px)] origin-bottom-left overflow-hidden rounded-[8px] border shadow-[0_25px_80px_rgba(0,0,0,0.85)] ${
        night ? 'border-[#67C3EA]/35' : 'border-white/70'
      }`}
      style={{
        boxShadow: '0 30px 90px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.7)',
        backdropFilter: 'blur(30px) saturate(1.8)',
      }}
      data-testid="world2-start-menu"
      onClick={(e) => e.stopPropagation()}
    >
      {/* LEFT PANE: White/Pearl with Pinned Applications & Search Bar */}
      <div className="flex flex-1 flex-col justify-between bg-gradient-to-b from-white/95 via-white/90 to-[#EBF3FA]/95 p-2.5">
        <div className="max-h-[380px] overflow-y-auto pr-1">
          {apps.map((a) => (
            <button
              key={a.id}
              data-testid={`world2-start-${a.id}`}
              onClick={() => launch(a.id)}
              className="group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-all hover:bg-[#D4E8F8] hover:shadow-sm"
            >
              <span className="h-8 w-8 shrink-0 transition-transform group-hover:scale-110 drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] [&>svg]:h-8 [&>svg]:w-8">
                <AppIcon name={a.icon} />
              </span>
              <span className="text-[13px] font-semibold text-[#183B5E]">{a.label}</span>
            </button>
          ))}
          {apps.length === 0 && (
            <p className="px-4 py-8 text-center text-[12px] text-slate-500">No programs found.</p>
          )}
        </div>

        {/* Windows Vista Iconic Search Box with Round Blue Magnifier */}
        <div className="mt-2 pt-2 border-t border-slate-200">
          <div className="flex items-center gap-2 rounded-full border border-[#85B8DE] bg-white px-3 py-1.5 shadow-inner">
            <input
              data-testid="world2-start-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && apps[0]) launch(apps[0].id);
              }}
              placeholder="Start Search"
              aria-label="Start Search"
              className="w-full bg-transparent text-[12.5px] italic text-[#183B5E] placeholder:text-slate-400 outline-none"
            />
            <button
              className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-[#38BDF8] to-[#0284C7] text-white shadow-sm"
              aria-label="Search"
            >
              <Search className="h-3 w-3" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANE: Dark Vista Aero Glass with User Profile & System Shortcuts */}
      <div
        className="flex w-[160px] shrink-0 flex-col justify-between border-l border-white/25 p-3 text-white"
        style={{
          background: night
            ? 'linear-gradient(180deg, rgba(8,20,38,0.92) 0%, rgba(4,10,20,0.98) 100%)'
            : 'linear-gradient(180deg, rgba(16,42,70,0.88) 0%, rgba(8,24,44,0.95) 100%)',
        }}
      >
        <div>
          {/* User Profile Picture Box */}
          <div className="flex flex-col items-center border-b border-white/15 pb-3">
            <div className="relative grid h-12 w-12 place-items-center rounded-lg border-2 border-white/80 bg-gradient-to-br from-[#60A5FA] to-[#1E40AF] shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.8)]">
              <span className="text-xl font-bold text-white drop-shadow">H</span>
            </div>
            <p className="mt-2 text-xs font-bold text-white drop-shadow">Himesh Soni</p>
            <p className="font-mono text-[8px] text-cyan-200 tracking-wider">VISTA EDITION</p>
          </div>

          {/* Quick Folder Links */}
          <div className="mt-2.5 flex flex-col gap-1 text-[11.5px] text-white/90">
            {[
              { id: 'computer', label: 'Computer' },
              { id: 'built', label: 'Documents' },
              { id: 'pictures', label: 'Pictures' },
              { id: 'music', label: 'Music' },
              { id: 'settings', label: 'Control Panel' },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => launch(link.id)}
                className="w-full rounded px-2 py-1.5 text-left font-medium transition-colors hover:bg-white/15"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Shut Down & Lock Buttons */}
        <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-2.5">
          <button
            data-testid="world2-back-to-portfolio"
            onClick={onExit}
            title="Shut Down / Back to Portfolio"
            className="flex items-center gap-1.5 rounded-md border border-red-400/50 bg-gradient-to-b from-red-500/80 to-red-700/90 px-2.5 py-1 text-[11px] font-semibold text-white shadow transition-all hover:brightness-110 active:scale-95"
          >
            <Power className="h-3 w-3" strokeWidth={2.5} />
            Shut Down
          </button>
          <button
            onClick={onClose}
            title="Lock"
            className="grid h-7 w-7 place-items-center rounded-md border border-white/30 bg-white/15 text-white transition-all hover:bg-white/25 active:scale-95"
          >
            <Lock className="h-3 w-3" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
