import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, ArrowUp, LayoutGrid, List, Image as ImageIcon, Play } from 'lucide-react';
import { useWinMgr } from './WinManager';
import { FS_ROOT, findNode, pathTo, imagesOf, type FSNode } from './fs';
import { AppIcon } from '../win/icons';
import { StatusBadge, MonoLabel, Chip } from '../win/ui';
import { PROJECTS } from '../data/projects';
import { RESEARCH } from '../data/research';
import { EXPERIMENTS } from '../data/experiments';
import PixelatorApp from '../sections/PixelatorApp';
import BottleSim from '../components/BottleSim';
import QKDDiagram from '../components/QKDDiagram';

// ─────────────────────────────────────────────────────────────
// EXPLORER — a working file-system explorer: back / forward /
// up, breadcrumb, view switcher, double-click to open.
// ─────────────────────────────────────────────────────────────

type View = 'icons' | 'details' | 'thumbs';

export default function Explorer({ startNodeId }: { startNodeId: string }) {
  const mgr = useWinMgr();
  const [stack, setStack] = useState<string[]>([startNodeId]);
  const [idx, setIdx] = useState(0);
  const [view, setView] = useState<View>(startNodeId === 'pictures' ? 'thumbs' : 'icons');
  const [selected, setSelected] = useState<string | null>(null);

  const node = findNode(FS_ROOT, stack[idx]) ?? FS_ROOT;
  const path = pathTo(FS_ROOT, stack[idx]);
  const items = node.children ?? [];

  const navigate = (id: string) => {
    const next = [...stack.slice(0, idx + 1), id];
    setStack(next);
    setIdx(next.length - 1);
    setSelected(null);
  };

  const openNode = (n: FSNode) => {
    if (n.type === 'folder') return navigate(n.id);
    if (n.type === 'project') {
      const p = PROJECTS.find((x) => x.id === n.projectId)!;
      return mgr.open({
        id: `app-${n.projectId}`,
        title: p.title,
        icon: p.special === 'pixelator' ? 'pixelator' : 'file',
        w: 640,
        h: 540,
        render: () => <ProjectFileApp projectId={n.projectId!} />,
      });
    }
    if (n.type === 'research')
      return mgr.open({ id: 'research-lab', title: 'Research Lab', icon: 'research', w: 800, h: 570, render: () => <ResearchLab initialId={n.researchId} /> });
    if (n.type === 'experiment')
      return mgr.open({
        id: `exp-${n.experimentId}`,
        title: n.name,
        icon: n.experimentId === 'pixelator' ? 'pixelator' : n.experimentId === 'water-bottle-simulation' ? 'bottle' : 'file',
        w: n.experimentId === 'water-bottle-simulation' ? 540 : n.experimentId === 'pixelator' ? 760 : 560,
        h: n.experimentId === 'water-bottle-simulation' ? 660 : n.experimentId === 'pixelator' ? 640 : 480,
        render: () => <ExperimentApp experimentId={n.experimentId!} />,
      });
    if (n.type === 'image') {
      const imgs = imagesOf(node);
      const start = Math.max(imgs.findIndex((x) => x.id === n.id), 0);
      return mgr.open({ id: 'photo-viewer', title: 'Windows Photo Viewer', icon: 'viewer', w: 820, h: 620, render: () => <PhotoViewerApp images={imgs} startIdx={start} /> });
    }
  };

  const iconFor = (n: FSNode) =>
    n.type === 'folder'
      ? 'folder'
      : n.kind === 'Application'
        ? 'pixelator'
        : n.type === 'research'
          ? 'research'
          : n.type === 'experiment'
            ? 'experiments'
            : n.kind === 'Simulation'
              ? 'bottle'
              : n.type === 'image'
                ? 'viewer'
                : 'file';

  return (
    <div className="flex h-full flex-col" data-testid={`explorer-${startNodeId}`}>
      {/* nav bar */}
      <div className={`flex items-center gap-1.5 border-b px-2.5 py-2 ${mgr.night ? 'border-[#67C3EA]/20 bg-[#0E2238]/70' : 'border-[#CFE3F4] bg-gradient-to-b from-[#F0F7FE] to-[#DDEDFB]'}`}>
        <NavBtn label="Back" testid={`explorer-back-${startNodeId}`} disabled={idx === 0} onClick={() => setIdx(idx - 1)} night={mgr.night}>
          <ArrowLeft className="h-4 w-4" />
        </NavBtn>
        <NavBtn label="Forward" testid={`explorer-forward-${startNodeId}`} disabled={idx >= stack.length - 1} onClick={() => setIdx(idx + 1)} night={mgr.night}>
          <ArrowRight className="h-4 w-4" />
        </NavBtn>
        <NavBtn
          label="Up one level"
          testid={`explorer-up-${startNodeId}`}
          disabled={path.length <= 2}
          onClick={() => {
            const parent = path[path.length - 2];
            if (parent) navigate(parent.id);
          }}
          night={mgr.night}
        >
          <ArrowUp className="h-4 w-4" />
        </NavBtn>
        <div className={`ml-2 flex h-8 min-w-0 flex-1 items-center gap-2 rounded-md border px-3 ${mgr.night ? 'border-[#67C3EA]/25 bg-[#0A1B2E]/80 text-[#D8EAF8]' : 'border-[#B7D5EC] bg-white/90 text-[#173A5E]'}`}>
          <AppIcon name="folder" className="h-4 w-4" />
          <span className="truncate text-[12px] font-medium">{node.name}</span>
          {path.length > 2 && (
            <span className={`hidden truncate font-mono text-[9px] sm:block ${mgr.night ? 'text-[#6E93B5]' : 'text-[#7FA5C4]'}`}>
              {path.slice(1, -1).map((n) => n.name).join(' › ')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <ViewBtn active={view === 'icons'} onClick={() => setView('icons')} label="Icons view" night={mgr.night}>
            <LayoutGrid className="h-3.5 w-3.5" />
          </ViewBtn>
          <ViewBtn active={view === 'details'} onClick={() => setView('details')} label="Details view" night={mgr.night}>
            <List className="h-3.5 w-3.5" />
          </ViewBtn>
          <ViewBtn active={view === 'thumbs'} onClick={() => setView('thumbs')} label="Thumbnails view" night={mgr.night}>
            <ImageIcon className="h-3.5 w-3.5" />
          </ViewBtn>
        </div>
      </div>

      {/* items */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {items.length === 0 && (
          <div className="grid h-full place-items-center text-center">
            <div>
              <p className={`text-[14px] font-medium ${mgr.night ? 'text-[#D8EAF8]' : 'text-[#3D6285]'}`}>This folder is empty.</p>
              <p className="mt-1 font-mono text-[9px] tracking-[0.25em] text-[#7FA5C4]">NO TRACK LOADED — [ADD MUSIC]</p>
              <button
                data-testid="explorer-open-media-player"
                onClick={() => mgr.open({ id: 'media-player', title: 'Himesh Media Player', icon: 'media', w: 580, h: 460, render: () => <MediaPlayerApp /> })}
                className="gloss-btn mt-5 flex items-center gap-2 px-5 py-2 text-[12px] font-medium text-white"
              >
                <Play className="h-3.5 w-3.5" /> Open Media Player
              </button>
            </div>
          </div>
        )}

        {items.length > 0 && view !== 'details' && (
          <div className={`grid gap-2.5 ${view === 'thumbs' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5'}`}>
            {items.map((n) => (
              <button
                key={n.id}
                data-testid={`explorer-item-${n.id}`}
                onClick={() => {
                  // touch devices have no double-click
                  if (window.innerWidth < 768) openNode(n);
                  else setSelected(n.id);
                }}
                onDoubleClick={() => openNode(n)}
                className={`group flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                  selected === n.id
                    ? mgr.night
                      ? 'border-[#67C3EA]/60 bg-[#67C3EA]/15'
                      : 'border-[#5FB8F2] bg-[#D6ECFC]/90'
                    : mgr.night
                      ? 'border-transparent hover:border-[#67C3EA]/30 hover:bg-white/5'
                      : 'border-transparent hover:border-[#B7D5EC] hover:bg-white/60'
                }`}
              >
                {n.type === 'image' && n.src ? (
                  <img src={n.src} alt={n.alt} loading="lazy" className={`w-full rounded-md object-cover shadow-sm ${view === 'thumbs' ? 'aspect-[4/3]' : 'aspect-square'}`} />
                ) : (
                  <AppIcon name={iconFor(n)} className={view === 'thumbs' ? 'h-20 w-20' : 'h-14 w-14'} />
                )}
                <span className={`line-clamp-2 text-[11.5px] font-medium leading-tight ${mgr.night ? 'text-[#D8EAF8]' : 'text-[#25384C]'}`}>{n.name}</span>
                <span className="font-mono text-[8px] tracking-[0.15em] text-[#7FA5C4]">{(n.kind ?? 'Folder').toUpperCase()}</span>
              </button>
            ))}
          </div>
        )}

        {items.length > 0 && view === 'details' && (
          <div className="overflow-hidden rounded-lg border border-[#CFE3F4]" data-testid={`explorer-details-${startNodeId}`}>
            <table className="w-full text-left text-[12px]">
              <thead className={mgr.night ? 'bg-[#0E2238]/80 text-[#9FDBFA]' : 'bg-[#D6ECFC]/80 text-[#33608A]'}>
                <tr>
                  <th className="px-3 py-2 font-semibold">Name</th>
                  <th className="px-3 py-2 font-semibold">Type</th>
                </tr>
              </thead>
              <tbody>
                {items.map((n) => (
                  <tr
                    key={n.id}
                    data-testid={`explorer-row-${n.id}`}
                    onClick={() => setSelected(n.id)}
                    onDoubleClick={() => openNode(n)}
                    className={`cursor-default ${selected === n.id ? (mgr.night ? 'bg-[#67C3EA]/15' : 'bg-[#D6ECFC]/90') : mgr.night ? 'hover:bg-white/5' : 'hover:bg-[#EAF4FD]'}`}
                  >
                    <td className={`px-3 py-2 font-medium ${mgr.night ? 'text-[#D8EAF8]' : 'text-[#25384C]'}`}>
                      <span className="flex items-center gap-2">
                        <AppIcon name={iconFor(n)} className="h-5 w-5" />
                        {n.name}
                      </span>
                    </td>
                    <td className={`px-3 py-2 font-mono text-[10px] ${mgr.night ? 'text-[#6E93B5]' : 'text-[#7FA5C4]'}`}>{(n.kind ?? 'Folder').toUpperCase()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* status bar */}
      <div className={`flex items-center justify-between border-t px-3 py-1.5 font-mono text-[9px] tracking-[0.2em] ${mgr.night ? 'border-[#67C3EA]/20 text-[#6E93B5]' : 'border-[#CFE3F4] text-[#7FA5C4]'}`}>
        <span>{items.length} ITEMS</span>
        <span>DOUBLE-CLICK TO OPEN</span>
      </div>
    </div>
  );
}

function NavBtn({ children, label, testid, disabled, onClick, night }: { children: React.ReactNode; label: string; testid: string; disabled?: boolean; onClick: () => void; night: boolean }) {
  return (
    <button
      data-testid={testid}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`grid h-8 w-8 shrink-0 place-items-center rounded-md border transition-all active:scale-95 disabled:opacity-35 ${
        night ? 'border-[#67C3EA]/25 bg-[#16304F]/80 text-[#BBDFF7] hover:bg-[#22436B]' : 'border-[#B7D5EC] bg-gradient-to-b from-white/90 to-[#D6ECFC]/70 text-[#33608A] hover:from-white'
      }`}
    >
      {children}
    </button>
  );
}

function ViewBtn({ children, active, onClick, label, night }: { children: React.ReactNode; active: boolean; onClick: () => void; label: string; night: boolean }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={`grid h-8 w-8 place-items-center rounded-md border transition-all active:scale-95 ${
        active
          ? 'border-[#5FB8F2] bg-[#D6ECFC] text-[#1668B8]'
          : night
            ? 'border-[#67C3EA]/25 bg-[#16304F]/80 text-[#BBDFF7]'
            : 'border-[#B7D5EC] bg-white/80 text-[#33608A]'
      }`}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// WORLD 2 APPLICATIONS
// ─────────────────────────────────────────────────────────────

export function ProjectFileApp({ projectId }: { projectId: string }) {
  const mgr = useWinMgr();
  const p = PROJECTS.find((x) => x.id === projectId);
  if (!p) return <div className="p-6 text-[13px] text-[#5B84A8]">File not found.</div>;
  return (
    <div className="p-6" data-testid="app-project-file">
      <div className="flex items-start gap-4">
        <AppIcon name={p.special === 'pixelator' ? 'pixelator' : 'file'} className="h-14 w-14 shrink-0" />
        <div className="min-w-0">
          <h2 className="text-[19px] font-bold tracking-tight text-[#173A5E]">{p.title}</h2>
          <p className="text-[12.5px] leading-relaxed text-[#4E7BA3]">{p.description}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <StatusBadge status={p.status} />
        <MonoLabel>{p.category.toUpperCase()}</MonoLabel>
      </div>
      {p.technologies.length > 0 && (
        <div className="mt-5">
          <MonoLabel>{p.status === 'ONGOING' ? 'TOPICS' : 'TECHNOLOGIES'}</MonoLabel>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {p.technologies.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
        </div>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#D3E4F4] pt-4">
        <button
          data-testid={`open-project-${p.id}`}
          onClick={() =>
            p.special === 'pixelator'
              ? mgr.open({ id: 'pixelator-app', title: 'Pixelator', icon: 'pixelator', w: 760, h: 640, render: () => <PixelatorApp /> })
              : p.github
                ? window.open(p.github, '_blank')
                : toast('No public link yet — [ADD PROJECT LINK]')
          }
          className="gloss-btn px-5 py-2 text-[12px] font-medium text-white"
        >
          {p.special === 'pixelator' ? 'Open Pixelator' : 'Open Project'}
        </button>
        {p.github && (
          <a href={p.github} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#9CC8E8] bg-white/80 px-5 py-2 text-[12px] font-medium text-[#173A5E] transition-all hover:bg-white active:scale-95" data-testid={`github-${p.id}`}>
            GitHub
          </a>
        )}
        {!p.github && (
          <span className="font-mono text-[9px] tracking-[0.2em] text-[#7FA5C4]">
            {p.status === 'PRIVATE' ? 'PRIVATE — NO PUBLIC LINK' : p.status === 'ONGOING' ? '[ADD PROJECT LINK] — ONGOING' : '[ADD PROJECT LINK]'}
          </span>
        )}
      </div>
    </div>
  );
}

export function ResearchLab({ initialId }: { initialId?: string }) {
  const mgr = useWinMgr();
  const [activeId, setActiveId] = useState(initialId ?? RESEARCH[0].id);
  const entry = RESEARCH.find((r) => r.id === activeId) ?? RESEARCH[0];
  return (
    <div className="flex h-full" data-testid="app-research-lab">
      <aside className={`w-[210px] shrink-0 overflow-y-auto border-r p-3 ${mgr.night ? 'border-[#67C3EA]/20 bg-[#0E2238]/60' : 'border-[#CFE3F4] bg-gradient-to-b from-[#F0F7FE] to-[#E4F1FC]'}`}>
        <MonoLabel>RESEARCH DOCS</MonoLabel>
        <div className="mt-3 space-y-1">
          {RESEARCH.map((r) => (
            <button
              key={r.id}
              data-testid={`research-doc-${r.id}`}
              onClick={() => setActiveId(r.id)}
              className={`flex w-full items-start gap-2 rounded-lg border px-2.5 py-2 text-left text-[11.5px] font-medium leading-snug transition-all ${
                r.id === activeId
                  ? mgr.night
                    ? 'border-[#67C3EA]/50 bg-[#67C3EA]/15 text-[#D8EAF8]'
                    : 'border-[#5FB8F2] bg-[#D6ECFC] text-[#173A5E]'
                  : mgr.night
                    ? 'border-transparent text-[#BBDFF7] hover:bg-white/5'
                    : 'border-transparent text-[#33608A] hover:bg-white/70'
              }`}
            >
              <AppIcon name="research" className="mt-0.5 h-4 w-4 shrink-0" />
              {r.title}
            </button>
          ))}
        </div>
      </aside>
      <div className="min-w-0 flex-1 overflow-y-auto p-5">
        <StatusBadge status={entry.status} />
        <h2 className="mt-3 text-[16.5px] font-bold leading-snug text-[#173A5E]">{entry.title}</h2>
        <div className="mt-4 rounded-xl border border-[#A9CBE8] bg-white/70 p-3.5">
          <MonoLabel>RESEARCH QUESTION</MonoLabel>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#2E5A82]">{entry.researchQuestion}</p>
        </div>
        <p className="mt-4 text-[12.5px] leading-relaxed text-[#3D6285]">{entry.description}</p>
        <div className="mt-4">
          <MonoLabel>TOPICS</MonoLabel>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {entry.topics.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
        </div>
        {entry.visual === 'qkd' && (
          <div className="mt-4 overflow-hidden rounded-xl">
            <QKDDiagram />
          </div>
        )}
        {entry.notes && (
          <div className="mt-4 border-t border-[#D3E4F4] pt-3">
            <MonoLabel>NOTES</MonoLabel>
            <ul className="mt-2 space-y-1.5">
              {entry.notes.map((n) => (
                <li key={n} className="flex gap-2 text-[12px] leading-relaxed text-[#5B84A8]">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#5FB8F2]" />
                  {n}
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="mt-4 font-mono text-[8.5px] tracking-[0.22em] text-[#7FA5C4]">ONGOING RESEARCH — NO FINAL RESULTS CLAIMED</p>
      </div>
    </div>
  );
}

export function ExperimentApp({ experimentId }: { experimentId: string }) {
  const e = EXPERIMENTS.find((x) => x.id === experimentId);
  if (!e) return <div className="p-6 text-[13px] text-[#5B84A8]">Not found.</div>;
  if (e.opens === 'pixelator')
    return (
      <div className="p-4">
        <PixelatorApp />
      </div>
    );
  if (e.opens === 'bottle')
    return (
      <div className="p-4">
        <BottleSim />
      </div>
    );
  return (
    <div className="p-6" data-testid="app-experiment">
      <StatusBadge status={e.status} />
      <h2 className="mt-3 text-[17px] font-bold text-[#173A5E]">{e.title}</h2>
      <p className="mt-1 font-mono text-[9px] tracking-[0.24em] text-[#4E7BA3]">{e.type.toUpperCase()}</p>
      <p className="mt-4 text-[13px] leading-relaxed text-[#3D6285]">{e.description}</p>
      <p className="mt-6 font-mono text-[8.5px] tracking-[0.22em] text-[#7FA5C4]">AN EXPERIMENT — MADE OUT OF CURIOSITY</p>
    </div>
  );
}

export function PhotoViewerApp({ images, startIdx }: { images: FSNode[]; startIdx: number }) {
  const [i, setI] = useState(startIdx);
  const [zoom, setZoom] = useState(1);
  const [full, setFull] = useState(false);
  const img = images[i];
  const step = (d: number) => {
    setI((v) => (v + d + images.length) % images.length);
    setZoom(1);
  };
  return (
    <div className={`flex h-full flex-col ${full ? 'fixed inset-0 z-[220] bg-[#04121E]/95 p-4' : ''}`} data-testid="app-photo-viewer">
      <div className="grid min-h-0 flex-1 place-items-center overflow-auto p-3">
        {img?.src ? (
          <img
            src={img.src}
            alt={img.alt}
            className="max-h-full w-auto rounded-lg border border-white/50 object-contain shadow-2xl transition-transform duration-300"
            style={{ transform: `scale(${zoom})` }}
          />
        ) : (
          <p className="text-[13px] text-[#5B84A8]">No photograph loaded.</p>
        )}
      </div>
      <div className="flex items-center justify-center gap-3 border-t border-[#D3E4F4] bg-white/40 py-2.5">
        <button data-testid="viewer-prev" onClick={() => step(-1)} aria-label="Previous photo" className="viewer-btn">
          ‹
        </button>
        <button data-testid="viewer-zoom-out" onClick={() => setZoom((z) => Math.max(1, z - 0.5))} aria-label="Zoom out" className="viewer-btn text-[13px] font-bold">
          −
        </button>
        <button data-testid="viewer-fit" onClick={() => setZoom(1)} aria-label="Fit photo" className="viewer-btn text-[9px] font-bold">
          FIT
        </button>
        <button data-testid="viewer-zoom-in" onClick={() => setZoom((z) => Math.min(3, z + 0.5))} aria-label="Zoom in" className="viewer-btn text-[13px] font-bold">
          +
        </button>
        <button data-testid="viewer-fullscreen" onClick={() => setFull((f) => !f)} aria-label="Fullscreen" className="viewer-btn text-[12px]">
          ⛶
        </button>
        <button data-testid="viewer-next" onClick={() => step(1)} aria-label="Next photo" className="viewer-btn">
          ›
        </button>
        <span className="ml-3 font-mono text-[9px] tracking-[0.2em] text-[#7FA5C4]">
          {i + 1}/{images.length} · {img?.name}
        </span>
      </div>
    </div>
  );
}

export function MediaPlayerApp() {
  const nudge = () => toast('No track loaded — [ADD MUSIC]');
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#12283E]/97 to-[#0A1B2C]/97 text-white" data-testid="app-media-player">
      <div className="flex items-center gap-1 border-b border-white/12 px-3 py-2">
        {['Now Playing', 'Library', 'Queue'].map((t, i) => (
          <span key={t} className={`rounded-t-md px-3 py-1 text-[11px] ${i === 0 ? 'border border-b-0 border-white/25 bg-white/15 font-semibold' : 'text-white/50'}`}>
            {t}
          </span>
        ))}
      </div>
      <div className="grid flex-1 place-items-center p-6">
        <div className="text-center">
          <div className="relative mx-auto h-32 w-32">
            <div className="absolute inset-0 rounded-full border-4 border-white/20" style={{ background: 'radial-gradient(circle at 35% 30%, #3E6E9E, #173A5E 55%, #0A1B2C)' }} />
            <div className="absolute left-3 right-3 top-2.5 h-9 rounded-full bg-gradient-to-b from-white/35 to-transparent" aria-hidden="true" />
            <Play className="absolute inset-0 m-auto h-9 w-9 text-white/80" />
          </div>
          <p className="mt-5 text-[15px] font-semibold text-white/95">No track loaded</p>
          <p className="mt-1 text-[12px] text-white/50">[ADD MUSIC]</p>
          <p className="mt-3 font-mono text-[9px] tracking-[0.25em] text-white/40">—:— / —:—</p>
        </div>
      </div>
      <div className="border-t border-white/12 bg-black/25 px-4 py-3">
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/15">
          <div className="h-full w-0 rounded-full bg-gradient-to-r from-[#38BDF8] to-[#F59E0B]" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button data-testid="wmp-prev" onClick={nudge} aria-label="Previous" className="text-white/65 hover:text-white">⏮</button>
            <button
              data-testid="wmp-play"
              onClick={nudge}
              aria-label="Play"
              className="grid h-10 w-10 place-items-center rounded-full border-2 border-white/60 shadow-[0_0_16px_rgba(56,189,248,0.4)] transition-transform hover:scale-105 active:scale-95"
              style={{ background: 'radial-gradient(circle at 35% 30%, #7DD3FC, #0EA5E9 55%, #0B4A8F)' }}
            >
              <Play className="ml-0.5 h-4 w-4 text-white" />
            </button>
            <button data-testid="wmp-next" onClick={nudge} aria-label="Next" className="text-white/65 hover:text-white">⏭</button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-white/50">VOL</span>
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/15" aria-hidden="true">
              <div className="h-full w-2/3 rounded-full bg-white/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
