import { useAero } from '../win/AeroWindow';
import { Chip, MonoLabel } from '../win/ui';

export default function About() {
  const { open } = useAero();

  const openMore = () =>
    open({
      id: 'about-more',
      title: 'About Himesh Soni',
      icon: 'about',
      width: 620,
      render: () => (
        <div className="p-6">
          <h3 className="text-[17px] font-bold text-[#173A5E]">Himesh Soni</h3>
          <p className="text-[13px] text-[#4E7BA3]">
            3rd-year Computer Science student · BITS Pilani Dubai Campus
          </p>
          <p className="mt-4 text-[13.5px] leading-relaxed text-[#3D6285]">
            I build things I'm curious about. That covers AI and quantum experiments, fintech
            systems, a terminal bot, an RF simulator — and a pixelator that exists for no reason at
            all.
          </p>
          <div className="mt-5">
            <MonoLabel>CURRENTLY EXPLORING</MonoLabel>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                'AI / ML experiments',
                'Letter of Credit automation',
                'Quantum communication + ML',
                'Scheduling research',
                'Reliability-aware vision research',
                'Efficient vision research',
                'Creative coding',
                'Photography / filmmaking',
              ].map((c) => (
                <Chip key={c}>{c}</Chip>
              ))}
            </div>
          </div>
        </div>
      ),
    });

  return (
    <section
      id="about"
      className="relative py-24 md:py-32"
      style={{ background: 'linear-gradient(180deg, #CFE7F9 0%, #E9F4FC 100%)' }}
      data-testid="about-section"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <MonoLabel>01 / ABOUT</MonoLabel>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#122B45] sm:text-5xl">About Me</h2>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-[#3D6285]">
              3rd-year Computer Science student at BITS Pilani Dubai Campus. I enjoy moving between
              serious technical projects and completely random experiments — some things become
              projects, some become research, some are just weird ideas I wanted to try. That's
              intentional.
            </p>
            <p className="mt-5 border-l-2 border-[#38BDF8] pl-4 text-[17px] font-medium italic text-[#173A5E]">
              I build things I'm curious about.
            </p>
            <button
              data-testid="about-know-more"
              onClick={openMore}
              className="gloss-btn mt-9 px-6 py-2.5 text-[12.5px] font-medium tracking-[0.1em] text-white"
            >
              KNOW MORE →
            </button>
          </div>
          <div className="rounded-3xl border border-white/80 bg-white/60 p-6 shadow-[0_18px_50px_rgba(30,100,170,0.10)] backdrop-blur">
            <MonoLabel>AREAS I'M EXPLORING</MonoLabel>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                'AI / Machine Learning',
                'Deep Learning',
                'Computer Vision',
                'Quantum Computing',
                'Software Engineering',
                'Creative Coding',
                'Photography',
                'Filmmaking',
              ].map((i) => (
                <Chip key={i}>{i}</Chip>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
