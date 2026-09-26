import { motion, useReducedMotion } from 'framer-motion';
import { Brain, Camera, Clapperboard, Code2, Cpu, Atom } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// WHAT I'M INTO — floating aero-glass panels. Interests, not
// expertise claims. No skill bars, no percentages — ever.
// ─────────────────────────────────────────────────────────────

const AREAS = [
  { id: 'cs', icon: Code2, title: 'Computer Science', note: 'The toolkit. Languages, systems, and the craft of making software do what you imagined.' },
  { id: 'ai-ml', icon: Brain, title: 'AI / Machine Learning', note: 'Models that see, read and decide — and the messy data that trains them.' },
  { id: 'systems', icon: Cpu, title: 'Systems & Architecture', note: "What is a computer actually doing under all that abstraction? Always digging." },
  { id: 'quantum', icon: Atom, title: 'Quantum Computing', note: "Qubits, interference, and algorithms that shouldn't work — but do." },
  { id: 'photography', icon: Camera, title: 'Photography', note: 'Cameras, light and timing. The hobby that teaches patience.' },
  { id: 'filmmaking', icon: Clapperboard, title: 'Filmmaking', note: 'DaVinci Resolve timelines, storyboards, and shots that never quite make the cut.' },
];

export default function Interests() {
  const reduced = useReducedMotion();
  return (
    <section
      id="into"
      className="relative py-24 md:py-32"
      style={{ background: 'linear-gradient(180deg, #CFE7F9 0%, #C2E0F6 55%, #A8D2EF 100%)' }}
      data-testid="interests-section"
    >
      {/* soft aero glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(800px 500px at 85% 20%, rgba(56,189,248,0.14), transparent 65%)' }}
      />
      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <p className="font-mono text-[10px] tracking-[0.35em] text-[#2E76B8]">WHAT I'M INTO</p>
        <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-[#0E2A44] sm:text-4xl">
          Six things I keep coming back to.
        </h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.09 }}
              className="h-full"
            >
              <motion.div
                animate={reduced ? undefined : { y: [0, -7, 0] }}
                transition={{ duration: 4.5 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                className="h-full"
              >
                <div
                  data-testid={`interest-card-${a.id}`}
                  className="aero-panel group flex h-full flex-col rounded-xl border border-white/70 p-1.5 shadow-[0_14px_38px_rgba(30,100,170,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(30,100,170,0.24)]"
                >
                  {/* mini titlebar */}
                  <div className="flex items-center gap-1.5 px-2.5 pb-1.5 pt-1">
                    <span className="h-2 w-2 rounded-full bg-[#F26D5C]/80" />
                    <span className="h-2 w-2 rounded-full bg-[#F2C94C]/80" />
                    <span className="h-2 w-2 rounded-full bg-[#5FC98E]/80" />
                    <span className="ml-auto font-mono text-[7.5px] tracking-[0.25em] text-[#7FA5C4]">INTEREST_{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="rounded-lg border border-[#E4F0FA] bg-gradient-to-b from-white/90 to-[#EDF6FD]/90 p-5">
                    <span className="grid h-10 w-10 place-items-center rounded-lg border border-[#BFDFF5] bg-gradient-to-b from-[#D6ECFC] to-[#ABD6F6] text-[#1668B8] shadow-inner">
                      <a.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-[15.5px] font-bold text-[#173A5E]">{a.title}</h3>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-[#3D6285]">{a.note}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 font-mono text-[8.5px] tracking-[0.25em] text-[#5B84A8]">
          INTERESTS — NOT EXPERTISE CLAIMS. THE EXCITEMENT IS REAL; THE PERCENTAGES DON'T EXIST.
        </p>
      </div>
    </section>
  );
}