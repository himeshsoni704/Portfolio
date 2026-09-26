import { SITE } from '../lib/site';
import { Mail, Github, Linkedin, Camera } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// CONTACT + ENDING — the journey calms back down.
// Real links only (supplied by Himesh).
// ─────────────────────────────────────────────────────────────

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden py-28 md:py-40"
      style={{ background: 'linear-gradient(180deg, #F4FAFF 0%, #E9F4FC 70%, #DCEEFB 100%)' }}
      data-testid="contact-section"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(700px 420px at 50% 110%, rgba(56,189,248,0.16), transparent 65%)',
        }}
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-10">
        <p className="font-mono text-[10px] tracking-[0.35em] text-[#2E76B8]">07 / LET'S CONNECT</p>
        <h2 className="mt-6 text-[clamp(2rem,5vw,3.6rem)] font-bold leading-tight tracking-tight text-[#0E2A44]">
          Have something interesting
          <br />
          <span className="text-gradient-sky">to build?</span>
        </h2>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a data-testid="contact-email" href={`mailto:${SITE.email}`} className="gloss-btn flex items-center gap-2.5 px-6 py-3 text-[12.5px] font-medium tracking-[0.1em] text-white">
            <Mail className="h-4 w-4" /> EMAIL
          </a>
          <a
            data-testid="contact-github"
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-full border border-[#9CC8E8] bg-white/80 px-6 py-3 text-[12.5px] font-medium tracking-[0.1em] text-[#173A5E] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <Github className="h-4 w-4" /> GITHUB
          </a>
          <a
            data-testid="contact-linkedin"
            href={SITE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-full border border-[#9CC8E8] bg-white/80 px-6 py-3 text-[12.5px] font-medium tracking-[0.1em] text-[#173A5E] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <Linkedin className="h-4 w-4" /> LINKEDIN
          </a>
          <a
            data-testid="contact-instagram"
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-full border border-[#9CC8E8] bg-white/80 px-6 py-3 text-[12.5px] font-medium tracking-[0.1em] text-[#173A5E] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <Camera className="h-4 w-4" /> PHOTOGRAPHY
          </a>
        </div>
      </div>

      {/* ending */}
      <div className="relative mt-32 text-center md:mt-44" data-testid="ending">
        <p className="font-display text-2xl font-bold tracking-[0.2em] text-[#173A5E]">HIMESH SONI</p>
        <p className="mt-3 text-[14px] text-[#5B84A8]">Still building things I'm curious about.</p>
        <div className="mx-auto mt-12 flex max-w-md flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-[#CFE3F4] pt-6">
          <a data-testid="footer-github" href={SITE.github} target="_blank" rel="noopener noreferrer" className="text-[12px] font-medium text-[#4E7BA3] transition-colors hover:text-[#173A5E]">GitHub</a>
          <a data-testid="footer-linkedin" href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="text-[12px] font-medium text-[#4E7BA3] transition-colors hover:text-[#173A5E]">LinkedIn</a>
          <a data-testid="footer-email" href={`mailto:${SITE.email}`} className="text-[12px] font-medium text-[#4E7BA3] transition-colors hover:text-[#173A5E]">Email</a>
          <span className="font-mono text-[10px] text-[#9FB9CE]">© 2026</span>
        </div>
      </div>
    </section>
  );
}
