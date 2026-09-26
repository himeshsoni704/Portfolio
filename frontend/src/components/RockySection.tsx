import RockyCharacter from './RockyCharacter';
import { Reveal, SectionHeading } from './aero';
import { useRocky } from './RockyProvider';

const CHIPS = [
  'Who is Himesh?',
  'What has he built?',
  'Tell me about the quantum project',
  "What's Pixelator?",
  'Why does he like photography?',
  'What is he working on?',
];

export default function RockySection() {
  const { ask, setOpen } = useRocky();
  return (
    <section id="rocky" className="relative scroll-mt-24 overflow-hidden py-24 md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(700px 500px at 25% 50%, rgba(37,99,235,0.18), transparent 65%), radial-gradient(500px 400px at 80% 30%, rgba(52,211,153,0.08), transparent 60%)',
        }}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <Reveal>
            <div className="relative">
              <RockyCharacter className="h-44 w-44 md:h-56 md:w-56" float />
              <span className="absolute -right-2 top-2 rounded-full border border-aero-green/40 bg-space-800/80 px-3 py-1 font-mono text-[9px] tracking-[0.25em] text-aero-green backdrop-blur">
                HS·AI / 001
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="glass mt-10 max-w-sm p-5 text-left">
              <p className="text-sm leading-relaxed text-ice/90">
                "Hey, I'm Rocky. I know a few things about Himesh. Ask me."
              </p>
              <p className="mt-3 font-mono text-[9px] tracking-[0.25em] text-mist">ROCKY — ONLINE · AMEZE PROTOCOL ACTIVE</p>
            </div>
          </Reveal>
        </div>

        <div>
          <SectionHeading
            index="03"
            module="ROCKY AI"
            title="The rock who knows too much. (He doesn't.)"
          />
          <Reveal delay={0.1}>
            <p className="-mt-8 max-w-lg leading-relaxed text-mist">
              Rocky is a small AI companion who lives on this website. He's curious, enthusiastic,
              occasionally sarcastic, and inspired by a certain rock from Project Hail Mary. He
              genuinely enjoys explaining what Himesh builds — especially the weird stuff.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {CHIPS.map((c) => (
                <button
                  key={c}
                  data-testid={`rocky-section-chip-${c.slice(0, 12).toLowerCase().replace(/[^a-z]+/g, '-')}`}
                  onClick={() => ask(c)}
                  className="rounded-full border border-aero-ice/25 bg-aero-sky/5 px-4 py-2 text-xs text-silver transition-all hover:-translate-y-0.5 hover:border-aero-ice/60 hover:text-ice"
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.26}>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <button
                data-testid="rocky-section-open"
                onClick={() => setOpen(true)}
                className="gloss-btn px-7 py-3 font-mono text-xs tracking-[0.2em] text-ice"
              >
                TALK TO ROCKY
              </button>
              <p className="max-w-xs font-mono text-[9px] leading-relaxed tracking-[0.15em] text-mist/80">
                PRIVACY: ROCKY ONLY KNOWS WHAT HIMESH PUT IN HIS PUBLIC KNOWLEDGE BASE. NO PRIVATE
                DATA. NO BROWSING HISTORY. PROMISE.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
