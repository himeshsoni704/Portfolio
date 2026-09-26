import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { EXPERIMENTS } from '../data/experiments';
import { Reveal, SectionHeading } from './aero';

export default function Experiments() {
  return (
    <section id="lab" className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8 md:py-32">
      <SectionHeading
        index="02"
        module="EXPERIMENT LAB"
        title="Things I Made While Curious"
        subtitle="Smaller builds, prototypes and half-finished ideas. Not every experiment needs a case study."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {EXPERIMENTS.map((e, i) => {
          const inner = (
            <>
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-[10px] tracking-[0.22em] text-aero-ice">{e.category.toUpperCase()}</span>
                <ArrowUpRight className="h-4 w-4 text-mist transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-aero-ice" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-ice">{e.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{e.description}</p>
              {e.tag && (
                <span className="mt-5 inline-block rounded-full border border-aero-green/40 bg-aero-green/10 px-2.5 py-0.5 font-mono text-[9px] tracking-[0.2em] text-aero-green">
                  {e.tag}
                </span>
              )}
            </>
          );
          const cls =
            'glass group block p-6 transition-all duration-300 hover:-translate-y-1 hover:border-aero-ice/40';
          return (
            <Reveal key={e.title} delay={i * 0.06}>
              {e.link && e.link.startsWith('/') ? (
                <Link to={e.link} data-testid={`experiment-card-${i}`} className={`${cls} h-full`}>
                  {inner}
                </Link>
              ) : (
                <a
                  href={e.link ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`experiment-card-${i}`}
                  className={`${cls} h-full`}
                >
                  {inner}
                </a>
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
