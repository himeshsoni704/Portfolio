import { SKILL_CATEGORIES } from '../data/skills';
import { Reveal, SectionHeading } from './aero';

export default function Skills() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32" data-testid="skills-orbit-section">
      <SectionHeading
        index="06"
        module="SYSTEMS"
        title="Toolkit"
        subtitle="An honest inventory — no percentage bars, no invented proficiency. Just what gets used."
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SKILL_CATEGORIES.map((cat, i) => (
          <Reveal key={cat.id} delay={i * 0.06} className={i === 0 ? 'lg:col-span-1' : ''}>
            <div className="glass group h-full p-7">
              <p className="label-mono">{cat.title.toUpperCase()}</p>
              <p className="mt-2 text-sm text-mist">{cat.blurb}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {cat.skills.map((s, j) => (
                  <span
                    key={s}
                    className="cursor-default rounded-full border border-aero-ice/25 bg-aero-sky/5 px-3.5 py-1.5 text-xs text-silver transition-all duration-300 hover:-translate-y-0.5 hover:border-aero-sky/60 hover:text-ice hover:shadow-[0_6px_18px_rgba(56,189,248,0.25)]"
                    style={{ transitionDelay: `${j * 15}ms` }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
