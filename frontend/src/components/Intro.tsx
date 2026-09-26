import { Reveal, Label } from './aero';

export default function Intro() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-36">
      <Reveal>
        <Label>00 / INTRO</Label>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-8 max-w-3xl text-2xl font-light leading-snug text-ice sm:text-3xl md:text-4xl">
          I'm a third-year Computer Science student at{' '}
          <span className="text-aero-ice">BITS Pilani Dubai</span>, interested in AI/ML, quantum
          computing and software — but I also like making things that have absolutely nothing to do
          with my coursework.
        </p>
      </Reveal>
      <div className="mt-14 space-y-3 md:mt-20">
        {['Some serious.', 'Some experimental.', 'Some just for fun.'].map((line, i) => (
          <Reveal key={line} delay={0.15 + i * 0.12}>
            <p
              className={`text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl ${
                i === 2 ? 'text-gradient-sky' : 'text-silver/80'
              }`}
            >
              {line}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
