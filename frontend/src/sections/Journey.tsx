import { JOURNEY } from '../data/timeline';
import { useAero } from '../win/AeroWindow';
import { SectionHeading, MonoLabel } from '../win/ui';
import { AppIcon } from '../win/icons';

// ─────────────────────────────────────────────────────────────
// MY JOURNEY — an interactive timeline. Clicking an entry
// opens a small Aero information window.
// ─────────────────────────────────────────────────────────────

export default function Journey({ onOpenSkills }: { onOpenSkills: () => void }) {
  const { open } = useAero();

  return (
    <section
      id="journey"
      className="relative py-24 md:py-32"
      style={{ background: 'linear-gradient(180deg, #E3F1FC 0%, #F4FAFF 100%)' }}
      data-testid="journey-section"
    >
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <SectionHeading
          index="06"
          label="TIMELINE"
          title="My Journey"
          subtitle="Short, factual, still being written. Click a year for the details."
        />

        <div className="relative border-l-2 border-[#BFD9EE] pl-6 md:pl-10" data-testid="timeline">
          {JOURNEY.map((j, i) => (
            <div key={`${j.year}-${i}`} className="relative pb-10 last:pb-0">
              <span className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 border-[#5FB8F2] bg-white shadow-sm md:-left-[47px]" />
              <button
                data-testid={`timeline-${j.year}-${i}`}
                onClick={() =>
                  open({
                    id: `journey-${i}`,
                    title: j.year,
                    icon: 'calendar',
                    width: 460,
                    render: () => (
                      <div className="p-6">
                        <p className="font-mono text-[10px] tracking-[0.28em] text-[#4E7BA3]">{j.year}</p>
                        <h3 className="mt-2 text-[17px] font-bold text-[#173A5E]">{j.title}</h3>
                        <ul className="mt-4 space-y-2">
                          {j.details.map((d) => (
                            <li key={d} className="flex gap-2 text-[13.5px] leading-relaxed text-[#3D6285]">
                              <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#5FB8F2]" />
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ),
                  })
                }
                className="group w-full rounded-2xl border border-transparent p-4 text-left transition-all hover:border-[#BFD9EE] hover:bg-white/70 hover:shadow-sm"
              >
                <span className="flex items-center gap-3">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-[#2E76B8]">{j.year}</span>
                  <span className="h-px flex-1 bg-[#D3E4F4] transition-colors group-hover:bg-[#9CC8E8]" />
                  <span className="font-mono text-[8.5px] tracking-[0.2em] text-[#7FA5C4] opacity-0 transition-opacity group-hover:opacity-100">
                    DETAILS →
                  </span>
                </span>
                <span className="mt-2 block text-[16px] font-bold text-[#173A5E]">{j.title}</span>
                <span className="mt-1 block text-[13px] leading-relaxed text-[#5B84A8]">{j.short}</span>
              </button>
            </div>
          ))}
        </div>

        {/* skills drawer trigger */}
        <div className="mt-16 flex justify-center">
          <button
            data-testid="skills-drawer-trigger"
            onClick={onOpenSkills}
            className="gloss-btn flex items-center gap-3 px-7 py-3 text-[12.5px] font-medium tracking-[0.12em] text-white"
          >
            <span className="h-5 w-5 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:brightness-0 [&>svg]:invert">
              <AppIcon name="file" />
            </span>
            SKILLS →
          </button>
        </div>
        <p className="mt-4 text-center">
          <MonoLabel>CATEGORIES, NOT PERCENTAGES</MonoLabel>
        </p>
      </div>
    </section>
  );
}
