import { Reveal, SectionHeading } from './aero';

const MISSIONS = [
  {
    no: '01',
    name: 'Letter of Credit Automation',
    note: 'Document intelligence for trade finance — evolving in public, honestly unfinished.',
  },
  {
    no: '02',
    name: 'AI / ML Experiments',
    note: 'Local models, RAG pipelines, computer vision — whatever the next question is.',
  },
  {
    no: '03',
    name: 'Creative Coding / Visual Experiments',
    note: 'Canvas toys and visual experiments. Currently: this website.',
  },
];

export default function CurrentlyBuilding() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <SectionHeading
        index="05"
        module="CURRENT MISSIONS"
        title="Currently Building"
        subtitle="The lab is never idle. No 'coming soon' — everything here is already moving."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {MISSIONS.map((m, i) => (
          <Reveal key={m.no} delay={i * 0.08}>
            <div className="glass group h-full p-7 transition-all duration-300 hover:-translate-y-1 hover:border-aero-ice/40" data-testid={`currently-building-${i}`}>
              <div className="flex items-start justify-between">
                <span className="font-mono text-4xl font-light text-aero-ice/40 transition-colors group-hover:text-aero-ice">
                  {m.no}
                </span>
                <span className="flex items-center gap-2 rounded-full border border-aero-green/40 bg-aero-green/10 px-3 py-1 font-mono text-[9px] tracking-[0.2em] text-aero-green">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-aero-green" />
                  IN PROGRESS
                </span>
              </div>
              <h3 className="mt-8 text-xl font-semibold text-ice">{m.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">{m.note}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
