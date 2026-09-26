import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PROJECTS, type Project } from '../data/projects';
import { Chip, Label, Reveal, SectionHeading } from './aero';
import QKDDiagram from './QKDDiagram';
import { EInvDocMock, LC_STEPS, EINV_STEPS, PipelineVisual } from './PipelineVisual';
import PixelatorDemo from './PixelatorDemo';
import BottleSim from './BottleSim';

function MetaRow({ p, light = false }: { p: Project; light?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <Label className={light ? 'text-aero-blue' : ''}>
        {p.category.toUpperCase()}
      </Label>
      <span className={`font-mono text-[10px] tracking-[0.2em] ${light ? 'text-slate-500' : 'text-mist'}`}>
        {p.year}
      </span>
      {p.status === 'IN PROGRESS' && (
        <span className="flex items-center gap-2 rounded-full border border-aero-green/40 bg-aero-green/10 px-3 py-1 font-mono text-[9px] tracking-[0.2em] text-aero-green">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-aero-green" />
          IN PROGRESS
        </span>
      )}
      {p.privacyLabel && (
        <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 font-mono text-[9px] tracking-[0.2em] text-amber-300">
          {p.privacyLabel.toUpperCase()}
        </span>
      )}
    </div>
  );
}

function CaseLink({ slug, light = false }: { slug: string; light?: boolean }) {
  return (
    <Link
      to={`/work/${slug}`}
      data-testid={`project-link-${slug}`}
      className={`group/link inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] transition-colors ${
        light ? 'text-aero-blue hover:text-aero-cyan' : 'text-aero-ice hover:text-ice'
      }`}
    >
      READ CASE STUDY
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
    </Link>
  );
}

export default function FeaturedWork() {
  const [qkd, einv, lc, pixelator, bottle] = PROJECTS;

  return (
    <section id="work" className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8 md:py-32">
      <SectionHeading
        index="01"
        module="MISSION LOG"
        title="Selected Work"
        subtitle="Things I've built, researched, or spent an unreasonable amount of time experimenting with."
      />

      {/* ── 01 QKD × ML — full-width feature ── */}
      <Reveal>
        <article className="glass group overflow-hidden p-6 md:p-10" data-testid="featured-qkd">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <MetaRow p={qkd} />
              <h3 className="mt-5 text-3xl font-semibold tracking-tight text-ice sm:text-4xl">
                Quantum Key Distribution × Machine Learning
              </h3>
              <p className="mt-4 max-w-md leading-relaxed text-mist">{qkd.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {qkd.technologies.slice(0, 6).map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
                <Chip>+4 more</Chip>
              </div>
              <div className="mt-8">
                <CaseLink slug={qkd.slug} />
              </div>
            </div>
            <div className="min-h-[300px] transition-transform duration-700 group-hover:scale-[1.015]">
              <QKDDiagram />
            </div>
          </div>
        </article>
      </Reveal>

      {/* ── 02 eInvoicing — text left, system right ── */}
      <Reveal delay={0.05}>
        <article className="glass mt-8 grid gap-10 p-6 md:p-10 lg:grid-cols-[1.05fr_1fr]" data-testid="featured-einv">
          <div className="flex flex-col justify-center">
            <MetaRow p={einv} />
            <h3 className="mt-5 text-3xl font-semibold tracking-tight text-ice sm:text-4xl">
              AI-Based eInvoicing Gap Analyzer
            </h3>
            <p className="mt-4 max-w-md leading-relaxed text-mist">{einv.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {einv.technologies.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-6">
              <CaseLink slug={einv.slug} />
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <PipelineVisual steps={EINV_STEPS} />
            <EInvDocMock />
          </div>
        </article>
      </Reveal>

      {/* ── 03 LC Automation — visual left, text right ── */}
      <Reveal delay={0.05}>
        <article className="glass mt-8 grid gap-10 p-6 md:p-10 lg:grid-cols-[1fr_1.05fr]" data-testid="featured-lc">
          <div className="order-2 flex items-center lg:order-1">
            <div className="glass w-full p-6">
              <div className="mb-5 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.25em] text-aero-ice">LC DOSSIER</span>
                <span className="flex items-center gap-2 rounded-full border border-aero-green/40 bg-aero-green/10 px-2.5 py-0.5 font-mono text-[9px] tracking-[0.2em] text-aero-green">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-aero-green" />
                  IN PROGRESS
                </span>
              </div>
              <PipelineVisual steps={LC_STEPS} />
            </div>
          </div>
          <div className="order-1 flex flex-col justify-center lg:order-2">
            <MetaRow p={lc} />
            <h3 className="mt-5 text-3xl font-semibold tracking-tight text-ice sm:text-4xl">
              Letter of Credit Automation
            </h3>
            <p className="mt-4 max-w-md leading-relaxed text-mist">{lc.description}</p>
            <p className="mt-4 font-mono text-[10px] tracking-[0.2em] text-mist">
              CURRENT · EXPLORING · NEXT — tracked honestly on the case page
            </p>
            <div className="mt-8">
              <CaseLink slug={lc.slug} />
            </div>
          </div>
        </article>
      </Reveal>

      {/* ── 04 Pixelator — the light band, completely different ── */}
      <Reveal delay={0.05}>
        <article
          className="mt-8 overflow-hidden rounded-3xl p-6 md:p-10"
          style={{
            background: 'linear-gradient(135deg, #BAE3FF 0%, #E0F2FE 45%, #CFF5E7 100%)',
          }}
          data-testid="featured-pixelator"
        >
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <MetaRow p={pixelator} light />
              <h3 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Pixelator
              </h3>
              <p className="mt-4 max-w-md leading-relaxed text-slate-600">
                A small image-processing app I made simply because I wanted to experiment with
                pixelation. The demo on the right is the real thing — drag the slider.
              </p>
              <p className="mt-4 border-l-2 border-aero-blue/50 pl-4 text-sm italic text-slate-500">
                "Started with a simple question: 'What happens if I just make everything pixels?'"
              </p>
              <div className="mt-8">
                <CaseLink slug={pixelator.slug} light />
              </div>
            </div>
            <PixelatorDemo />
          </div>
        </article>
      </Reveal>

      {/* ── 05 Water Bottle — playful split ── */}
      <Reveal delay={0.05}>
        <article className="glass mt-8 grid gap-10 p-6 md:p-10 lg:grid-cols-[1fr_1fr]" data-testid="featured-bottle">
          <BottleSim />
          <div className="flex flex-col justify-center">
            <MetaRow p={bottle} />
            <h3 className="mt-5 text-3xl font-semibold tracking-tight text-ice sm:text-4xl">
              Water Bottle Simulation
            </h3>
            <p className="mt-4 max-w-md leading-relaxed text-mist">{bottle.description}</p>
            <p className="mt-4 border-l-2 border-aero-sky/50 pl-4 text-sm italic text-slate-400">
              "A small physics experiment because apparently simulating a water bottle sounded like
              a good use of time."
            </p>
            <div className="mt-8">
              <CaseLink slug={bottle.slug} />
            </div>
          </div>
        </article>
      </Reveal>
    </section>
  );
}
