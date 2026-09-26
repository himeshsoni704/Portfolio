import { motion } from 'framer-motion';
import { Mail, Phone, Github, Linkedin, Instagram } from 'lucide-react';
import { SITE } from '../lib/site';

// ─────────────────────────────────────────────────────────────
// THE END — the site ends with Himesh's real details. Reachable
// by scrolling past the computer entrance, or by logging out of
// the computer (exit scrolls here).
// ─────────────────────────────────────────────────────────────

const CARDS = [
  { id: 'email', icon: Mail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
  { id: 'phone', icon: Phone, label: 'Phone', value: SITE.phone, href: `tel:${SITE.phoneIntl}` },
  { id: 'github', icon: Github, label: 'GitHub', value: 'github.com/himeshsoni704', href: SITE.github },
  { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', value: 'Himesh Soni', href: SITE.linkedin },
  { id: 'instagram', icon: Instagram, label: 'Instagram — Photography', value: '@hx.cr3', href: SITE.instagram },
];

export default function EndSection({ onReopen }: { onReopen?: () => void }) {
  return (
    <section
      id="site-end"
      className="relative overflow-hidden py-24 md:py-28"
      style={{ background: 'linear-gradient(180deg, #02070F 0%, #051523 55%, #083049 100%)' }}
      data-testid="site-end-section"
    >
      {/* deep-space glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(720px 420px at 50% 115%, rgba(56,189,248,0.18), transparent 70%)' }}
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-10">
        <p className="font-mono text-[10px] tracking-[0.4em] text-[#7DD3FC]/90">THE END OF THE WORLD</p>
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mt-4 text-3xl font-bold tracking-tight text-[#E8F4FF] sm:text-4xl"
        >
          Thanks for scrolling.
        </motion.h2>
        <p className="mx-auto mt-3 max-w-lg text-[13.5px] leading-relaxed text-[#9FC3E2]">
          Everything above lives inside the computer — everything below is really me. Find my work,
          my photos, or just say hi.
        </p>

        <div className="mt-10 grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c, i) => (
            <motion.a
              key={c.id}
              data-testid={`end-${c.id}`}
              href={c.href}
              target={c.id === 'email' || c.id === 'phone' ? undefined : '_blank'}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className={`flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-[#7DD3FC]/60 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(56,189,248,0.25)] ${
                c.id === 'instagram' ? 'lg:col-span-1' : ''
              }`}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#7DD3FC]/40 bg-[#0E2A44] text-[#7DD3FC]">
                <c.icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[12.5px] font-bold text-[#E8F4FF]">{c.label}</span>
                <span className="block truncate font-mono text-[10.5px] text-[#9FC3E2]">{c.value}</span>
              </span>
            </motion.a>
          ))}
        </div>

        <p className="mt-12 font-mono text-[8.5px] tracking-[0.3em] text-[#4E7BA3]">
          © 2026 HIMESH SONI · BITS PILANI DUBAI · THIS SITE IS HIS OWN LITTLE OS
        </p>
        {onReopen && (
          <button
            data-testid="end-reopen-computer"
            onClick={onReopen}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#7DD3FC]/40 px-6 py-2.5 font-mono text-[9.5px] tracking-[0.3em] text-[#7DD3FC]/90 transition-all hover:-translate-y-0.5 hover:border-[#7DD3FC] hover:text-[#BFE3F7] active:scale-95"
          >
            ↺ REOPEN THE COMPUTER
          </button>
        )}
      </div>
    </section>
  );
}