import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    <section
      className="relative flex min-h-[92vh] items-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #F4FAFF 0%, #E3F1FC 55%, #CFE7F9 100%)' }}
      data-testid="hero"
    >
      {/* frutiger bubbles + soft glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(700px 460px at 82% 18%, rgba(56,189,248,0.18), transparent 65%), radial-gradient(560px 400px at 8% 88%, rgba(52,211,153,0.12), transparent 60%)',
        }}
      />
      {[
        ['12%', '18%', 54], ['76%', '12%', 30], ['88%', '58%', 66], ['6%', '66%', 40], ['58%', '78%', 26],
      ].map(([l, t, s], i) => (
        <motion.span
          key={i}
          className="absolute rounded-full border border-white/70"
          style={{
            left: l as string,
            top: t as string,
            width: s as number,
            height: s as number,
            background: 'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.9), rgba(190,230,255,0.25) 55%, rgba(120,190,240,0.12))',
            boxShadow: 'inset 0 2px 6px rgba(255,255,255,0.9), 0 8px 20px rgba(30,110,180,0.12)',
          }}
          animate={{ y: [0, -14 - i * 3, 0] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <div className="relative mx-auto w-full max-w-6xl px-6 py-24 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-[10px] tracking-[0.35em] text-[#2E76B8]"
        >
          HIMESH SONI
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="mt-5 max-w-3xl text-[clamp(2.2rem,5.4vw,4.3rem)] font-bold leading-[1.04] tracking-tight text-[#0E2A44]"
        >
          Computer Science{' '}
          <span className="font-light text-[#4E7BA3]">•</span> AI/ML{' '}
          <span className="font-light text-[#4E7BA3]">•</span> Quantum{' '}
          <span className="font-light text-[#4E7BA3]">•</span> Photography
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24 }}
          className="mt-7 max-w-xl text-[16px] leading-relaxed text-[#3D6285]"
        >
          I'm Himesh, a 3rd-year Computer Science student at BITS Pilani Dubai Campus. I like
          building things I'm curious about — from AI and quantum experiments to weird little
          simulations and photography.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          className="mt-10"
        >
          <a
            data-testid="hero-know-more"
            href="#about"
            className="group inline-flex items-center gap-2.5 rounded-full border border-[#9CC8E8] bg-white/80 px-6 py-3 text-[12.5px] font-semibold tracking-[0.14em] text-[#173A5E] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            KNOW MORE
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
