import { EXPERIMENTS, type Experiment } from '../data/experiments';
import { useAero } from '../win/AeroWindow';
import { SectionHeading, StatusBadge } from '../win/ui';
import BottleSim from '../components/BottleSim';
import PixelatorApp from './PixelatorApp';

// ─────────────────────────────────────────────────────────────
// EXPERIMENTS — playful. Light section: the space journey is
// winding back down toward daylight.
// ─────────────────────────────────────────────────────────────

export default function Experiments() {
  const { open } = useAero();

  const openExperiment = (e: Experiment) => {
    if (e.opens === 'pixelator') {
      open({ id: 'pixelator-app', title: 'Pixelator', icon: 'pixelator', width: 560, render: () => <PixelatorApp /> });
      return;
    }
    if (e.opens === 'bottle') {
      open({
        id: 'bottle-app',
        title: 'Water Bottle Simulation',
        icon: 'bottle',
        width: 520,
        render: () => (
          <div className="p-4">
            <BottleSim />
          </div>
        ),
      });
      return;
    }
    open({
      id: `experiment-${e.id}`,
      title: e.title,
      icon: 'file',
      width: 520,
      render: () => (
        <div className="p-6">
          <StatusBadge status={e.status} />
          <h2 className="mt-3 text-[18px] font-bold text-[#173A5E]">{e.title}</h2>
          <p className="mt-1 font-mono text-[9.5px] tracking-[0.24em] text-[#4E7BA3]">{e.type.toUpperCase()}</p>
          <p className="mt-4 text-[13.5px] leading-relaxed text-[#3D6285]">{e.description}</p>
          <p className="mt-6 font-mono text-[9px] tracking-[0.22em] text-[#7FA5C4]">
            AN EXPERIMENT — MADE OUT OF CURIOSITY, NOT AMBITION
          </p>
        </div>
      ),
    });
  };

  return (
    <section
      id="experiments"
      className="relative py-24 md:py-32"
      style={{ background: 'linear-gradient(180deg, #0A1B2E 0%, #10304E 30%, #BFE0F5 78%, #DCEEFB 100%)' }}
      data-testid="experiments-section"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionHeading
          index="04"
          label="EXPERIMENTS"
          title="Things I Made While Curious"
          subtitle="Not everything needs to become a startup. Sometimes I just wanted to see if I could build it."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERIMENTS.map((e) => (
            <button
              key={e.id}
              data-testid={`experiment-card-${e.id}`}
              onClick={() => openExperiment(e)}
              className="group rounded-2xl border border-white/80 bg-white/70 p-5 text-left shadow-[0_12px_30px_rgba(30,100,170,0.10)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(30,100,170,0.2)]"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-[9px] tracking-[0.22em] text-[#4E7BA3]">
                  {e.type.toUpperCase()}
                </span>
                <StatusBadge status={e.status} />
              </div>
              <h3 className="mt-4 text-[15.5px] font-bold text-[#173A5E]">{e.title}</h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-[#5B84A8]">{e.description}</p>
              <span className="mt-4 inline-block font-mono text-[9px] tracking-[0.22em] text-[#2E76B8]">
                {e.opens ? '→ OPENS A REAL APP' : '→ OPEN NOTE'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
