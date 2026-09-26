import { motion, useReducedMotion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────
// WHAT I'M EXPLORING — sticky notes pinned to the dusk. Open
// questions, not answers. The sky darkens toward the space act.
// ─────────────────────────────────────────────────────────────

const NOTES = [
  { q: 'Can noisy quantum channels be made more reliable?', tag: 'QKD · ONGOING', r: -2.4 },
  { q: "Can AI tell when an image shouldn't be trusted?", tag: 'RELIABLE VISION · ONGOING', r: 1.8 },
  { q: 'Can ML pick schedules better than the classics?', tag: 'SCHEDULING · ONGOING', r: -1.2 },
  { q: 'Which patches should a vision model refine?', tag: 'EFFICIENT VISION · ONGOING', r: 2.6 },
  { q: 'Can a website actually feel like a place?', tag: "YOU'RE IN IT — THIS SITE", r: -2 },
];

export default function Exploring() {
  const reduced = useReducedMotion();
  return (
    <section
      id="exploring"
      className="relative overflow-hidden py-24 md:py-32"
      style={{ background: 'linear-gradient(180deg, #A8D2EF 0%, #5E93C4 34%, #1E4A75 68%, #0A1B2E 100%)' }}
      data-testid="exploring-section"
    >
      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <p className="font-mono text-[10px] tracking-[0.35em] text-[#BFE3F7]">WHAT I'M EXPLORING</p>
        <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Open questions I actually think about.
        </h2>
        <p className="mt-3 max-w-lg text-[13.5px] leading-relaxed text-[#9FC3E2]">
          Not answers — investigations. Research is ongoing, nothing is claimed, everything is
          pinned up where I can stare at it.
        </p>

        <div className="mt-12 flex flex-wrap gap-5 md:gap-7">
          {NOTES.map((n, i) => (
            <motion.div
              key={n.q}
              initial={{ opacity: 0, y: 30, rotate: n.r * 3 }}
              whileInView={{ opacity: 1, y: 0, rotate: n.r }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.1 }}
              whileHover={reduced ? undefined : { rotate: 0, scale: 1.04, zIndex: 5 }}
              data-testid={`exploring-note-${i}`}
              className="relative w-[240px] rounded-[4px] p-5 shadow-[0_18px_40px_rgba(2,15,35,0.45)] sm:w-[248px]"
              style={{
                background: 'linear-gradient(178deg, rgba(255,236,170,0.14), rgba(255,225,140,0.07))',
                border: '1px solid rgba(255,220,130,0.35)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* pin */}
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-[-7px] h-3.5 w-3.5 -translate-x-1/2 rounded-full"
                style={{ background: 'radial-gradient(circle at 35% 30%, #FFE9B0, #D99A26 70%)', boxShadow: '0 3px 6px rgba(0,10,25,0.5)' }}
              />
              <p className="text-[13.5px] font-medium leading-snug text-[#FFF3D6]">“{n.q}”</p>
              <p className="mt-4 font-mono text-[8px] tracking-[0.25em] text-[#E8CF8E]/80">{n.tag}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}