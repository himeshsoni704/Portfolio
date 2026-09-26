import { RESEARCH } from '../data/research';
import { useAero } from '../win/AeroWindow';
import { SectionHeading, StatusBadge, Chip, MonoLabel } from '../win/ui';
import QKDDiagram from '../components/QKDDiagram';

// ─────────────────────────────────────────────────────────────
// RESEARCH — ongoing questions. No fabricated results.
// Cards open the same Aero windows.
// ─────────────────────────────────────────────────────────────

export default function Research() {
  const { open } = useAero();

  return (
    <section
      id="research"
      className="starfield-dark relative py-24 md:py-32"
      style={{ background: 'linear-gradient(180deg, #04101F 0%, #0A1B2E 100%)' }}
      data-testid="research-section"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionHeading
          index="03"
          label="RESEARCH"
          title="Things I'm investigating."
          subtitle="Open questions, honest status: everything here is ongoing. No final results claimed."
          dark
        />
        <div className="grid gap-4 md:grid-cols-2">
          {RESEARCH.map((r) => (
            <button
              key={r.id}
              data-testid={`research-card-${r.id}`}
              onClick={() =>
                open({
                  id: `research-${r.id}`,
                  title: r.title,
                  icon: 'research',
                  width: 700,
                  render: () => <ResearchDetail id={r.id} />,
                })
              }
              className="glass-dark group rounded-2xl p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#67C3EA]/50"
            >
              <div className="flex items-start justify-between gap-3">
                <StatusBadge status={r.status} dark />
                <span className="font-mono text-[9px] tracking-[0.22em] text-[#6E93B5]">NOTEBOOK</span>
              </div>
              <h3 className="mt-4 text-[16px] font-bold leading-snug text-[#E8F4FF]">{r.title}</h3>
              <p className="mt-3 line-clamp-2 text-[12.5px] leading-relaxed text-[#8FB4D4]">
                {r.researchQuestion}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {r.topics.slice(0, 4).map((t) => (
                  <Chip key={t} dark>
                    {t}
                  </Chip>
                ))}
                {r.topics.length > 4 && (
                  <Chip dark>+{r.topics.length - 4}</Chip>
                )}
              </div>
              <span className="mt-4 inline-block font-mono text-[9px] tracking-[0.22em] text-[#7DD3FC] opacity-0 transition-opacity group-hover:opacity-100">
                → OPEN RESEARCH NOTE
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ResearchDetail({ id }: { id: string }) {
  const r = RESEARCH.find((x) => x.id === id)!;
  return (
    <div className="p-6">
      <StatusBadge status={r.status} />
      <h2 className="mt-3 text-[18px] font-bold leading-snug tracking-tight text-[#173A5E]">{r.title}</h2>

      <div className="mt-5 rounded-2xl border border-[#A9CBE8] bg-white/70 p-4">
        <MonoLabel>RESEARCH QUESTION</MonoLabel>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[#2E5A82]">{r.researchQuestion}</p>
      </div>

      <p className="mt-5 text-[13.5px] leading-relaxed text-[#3D6285]">{r.description}</p>

      <div className="mt-5">
        <MonoLabel>TOPICS</MonoLabel>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {r.topics.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
      </div>

      {r.visual === 'qkd' && (
        <div className="mt-5 overflow-hidden rounded-2xl">
          <QKDDiagram />
        </div>
      )}

      {r.notes && (
        <div className="mt-5 border-t border-[#D3E4F4] pt-4">
          <MonoLabel>NOTES</MonoLabel>
          <ul className="mt-3 space-y-2">
            {r.notes.map((n) => (
              <li key={n} className="flex gap-2 text-[12.5px] leading-relaxed text-[#5B84A8]">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#5FB8F2]" />
                {n}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-5 font-mono text-[9px] tracking-[0.22em] text-[#7FA5C4]">
        ONGOING RESEARCH — NO PUBLICATIONS · NO FINAL RESULTS
      </p>
    </div>
  );
}
