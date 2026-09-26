import { PROJECTS, type Project } from '../data/projects';
import { useAero } from '../win/AeroWindow';
import { SectionHeading, StatusBadge, Chip, MonoLabel } from '../win/ui';
import PixelatorApp from './PixelatorApp';

// ─────────────────────────────────────────────────────────────
// PROJECTS — dark starfield section. Click a card → it opens
// in a floating Aero window (the Windows moment).
// ─────────────────────────────────────────────────────────────

export default function Projects() {
  const { open } = useAero();

  const openProject = (p: Project) => {
    if (p.special === 'pixelator') {
      open({
        id: 'pixelator-app',
        title: 'Pixelator',
        icon: 'pixelator',
        width: 720,
        render: () => <PixelatorApp />,
      });
      return;
    }
    open({
      id: `project-${p.id}`,
      title: p.title,
      icon: 'file',
      width: 640,
      render: () => <ProjectDetail p={p} />,
    });
  };

  return (
    <section
      id="projects"
      className="starfield-dark relative py-24 md:py-32"
      style={{ background: 'linear-gradient(180deg, rgba(6,24,43,1) 0%, #04101F 100%)' }}
      data-testid="projects-section"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionHeading
          index="02"
          label="PROJECTS"
          title="Things I've built."
          subtitle="Click any project — it opens in its own window. Old-school glass, new-school content."
          dark
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <button
              key={p.id}
              data-testid={`project-card-${p.id}`}
              onClick={() => openProject(p)}
              className="glass-dark group rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#67C3EA]/50"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-[9px] tracking-[0.22em] text-[#6E93B5]">
                  {String(i + 1).padStart(2, '0')} · {p.category.toUpperCase()}
                </span>
                <StatusBadge status={p.status} dark />
              </div>
              <h3 className="mt-4 text-[15.5px] font-bold text-[#E8F4FF]">{p.title}</h3>
              <p className="mt-2 line-clamp-2 min-h-[2.5em] text-[12.5px] leading-relaxed text-[#8FB4D4]">
                {p.description}
              </p>
              <span className="mt-4 inline-block font-mono text-[9px] tracking-[0.22em] text-[#7DD3FC] opacity-0 transition-opacity group-hover:opacity-100">
                → OPEN WINDOW
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProjectDetail({ p }: { p: Project }) {
  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={p.status} />
        <MonoLabel>{p.category.toUpperCase()}</MonoLabel>
      </div>
      <h2 className="mt-3 text-[19px] font-bold tracking-tight text-[#173A5E]">{p.title}</h2>
      <p className="mt-3 text-[13.5px] leading-relaxed text-[#3D6285]">{p.description}</p>

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

      {p.special === 'pixelator' && (
        <div className="mt-5">
          <PixelatorApp />
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#D3E4F4] pt-4">
        {p.github && (
          <a
            data-testid={`project-github-${p.id}`}
            href={p.github}
            target="_blank"
            rel="noopener noreferrer"
            className="gloss-btn px-5 py-2 text-[12px] font-medium text-white"
          >
            {p.id === 'indoor-rf-simulator' ? 'github/indoor_rf_simulator' : 'View on GitHub'}
          </a>
        )}
        {!p.github && p.status === 'PRIVATE' && (
          <MonoLabel>PRIVATE — NO PUBLIC REPOSITORY LINK</MonoLabel>
        )}
        {!p.github && p.status === 'ONGOING' && (
          <MonoLabel>[ADD PROJECT LINK] — ONGOING</MonoLabel>
        )}
        {!p.github && p.status === 'PROJECT' && <MonoLabel>[ADD PROJECT LINK]</MonoLabel>}
      </div>
    </div>
  );
}
