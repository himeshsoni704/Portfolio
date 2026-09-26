import { motion, useReducedMotion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import { SITE } from '../lib/site';
import { Label, Reveal } from './aero';
import RockyCharacter from './RockyCharacter';
import { useRocky } from './RockyProvider';

const LINES = ['HAVE SOMETHING', 'INTERESTING', 'TO BUILD?'];

export default function Contact() {
  const reduced = useReducedMotion();
  const { ask } = useRocky();

  return (
    <section id="contact" className="starfield noise relative scroll-mt-24 overflow-hidden py-28 md:py-40" data-testid="contact-section">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(800px 500px at 50% 100%, rgba(37,99,235,0.22), transparent 65%)',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <Label>08 / TRANSMIT</Label>
        </Reveal>
        <h2 className="mt-8 font-display text-[clamp(2.4rem,7vw,5.4rem)] font-bold leading-[1.02] tracking-tight text-ice">
          {LINES.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-1">
              <motion.span
                className={`block ${i === 1 ? 'text-gradient-sky' : ''}`}
                initial={reduced ? false : { y: '112%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h2>

        <div className="mt-14 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap gap-4">
            <a
              data-testid="contact-email"
              href={`mailto:${SITE.email}`}
              className="gloss-btn flex items-center gap-2.5 px-7 py-3.5 font-mono text-xs tracking-[0.2em] text-ice"
            >
              <Mail className="h-4 w-4" /> EMAIL
            </a>
            <a
              data-testid="contact-github"
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-full border border-aero-ice/30 px-7 py-3.5 font-mono text-xs tracking-[0.2em] text-silver transition-colors hover:border-aero-ice/70 hover:text-ice"
            >
              <Github className="h-4 w-4" /> GITHUB
            </a>
            <a
              data-testid="contact-linkedin"
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-full border border-aero-ice/30 px-7 py-3.5 font-mono text-xs tracking-[0.2em] text-silver transition-colors hover:border-aero-ice/70 hover:text-ice"
            >
              <Linkedin className="h-4 w-4" /> LINKEDIN
            </a>
          </div>

          <Reveal delay={0.1}>
            <button
              data-testid="contact-ask-rocky"
              onClick={() => ask("Does Himesh have anything interesting on his site?")}
              className="group flex items-center gap-4 rounded-2xl border border-aero-ice/20 bg-aero-sky/5 px-6 py-4 text-left transition-all hover:-translate-y-1 hover:border-aero-ice/50"
            >
              <RockyCharacter className="h-14 w-14 transition-transform duration-300 group-hover:rotate-6" />
              <span>
                <span className="block font-mono text-[10px] tracking-[0.25em] text-aero-ice">
                  ASK ROCKY FIRST
                </span>
                <span className="mt-1 block text-sm text-mist">
                  He knows the tour. Probably better than I do.
                </span>
              </span>
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
