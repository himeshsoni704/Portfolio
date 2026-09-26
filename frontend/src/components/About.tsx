import { Chip, Reveal, SectionHeading } from './aero';

const INTERESTED = ['AI / ML', 'Quantum Computing', 'Computer Vision', 'Creative Technology'];

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8 md:py-32">
      <SectionHeading index="07" module="ABOUT" title="I'm Himesh." />
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6 text-lg leading-relaxed text-mist">
          <Reveal>
            <p>
              Third-year Computer Science student at BITS Pilani Dubai.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <p>
              I like working on problems involving AI, machine learning, quantum computing and
              software — and then occasionally abandoning all of that to make a Pixelator or
              simulate a water bottle.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="text-ice">
              That contrast is intentional. I like learning by building.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.2}>
          <div className="glass h-full p-7">
            <p className="label-mono">CURRENTLY INTERESTED IN</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {INTERESTED.map((i) => (
                <Chip key={i}>{i}</Chip>
              ))}
            </div>
            <p className="mt-8 font-mono text-[10px] leading-relaxed tracking-[0.15em] text-mist/80">
              THIS SITE IS A LIVING LAB — PROJECTS GET ADDED, ROCKY GETS SMARTER, AND THE DESIGN
              WILL KEEP EVOLVING.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
