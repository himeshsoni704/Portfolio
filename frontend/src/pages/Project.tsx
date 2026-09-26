import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { PROJECTS, getProject, type Project } from '../data/projects';
import { Chip, Label, Reveal } from '../components/aero';
import QKDDiagram from '../components/QKDDiagram';
import { EInvDocMock, EINV_STEPS, LC_STEPS, LCBoard, PipelineVisual } from '../components/PipelineVisual';
import PixelatorDemo from '../components/PixelatorDemo';
import BottleSim from '../components/BottleSim';
import { prefersReducedMotion } from '../lib/lenis';

function ProjectVisual({ p }: { p: Project }) {
  if (p.visual === 'qkd')
    return (
      <div className="glass p-5 md:p-8">
        <QKDDiagram />
      </div>
    );
  if (p.visual === 'pipeline-einv')
    return (
      <div className="grid gap-6 sm:grid-cols-2">
        <PipelineVisual steps={EINV_STEPS} />
        <EInvDocMock />
      </div>
    );
  if (p.visual === 'pipeline-lc')
    return (
      <div className="glass p-6 md:p-8">
        <PipelineVisual steps={LC_STEPS} />
      </div>
    );
  if (p.visual === 'pixelator')
    return (
      <div className="rounded-3xl p-6 md:p-10" style={{ background: 'linear-gradient(135deg, #BAE3FF 0%, #E0F2FE 45%, #CFF5E7 100%)' }}>
        <PixelatorDemo />
      </div>
    );
  return <BottleSim />;
}

export default function ProjectPage() {
  const { slug } = useParams();
  const project = getProject(slug);
  const reduced = prefersReducedMotion();

  if (!project) return <Navigate to="/" replace />;

  const idx = PROJECTS.findIndex((p) => p.slug === project.slug);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  return (
    <motion.main
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16, transition: { duration: 0.25 } }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="starfield noise min-h-screen pt-28 md:pt-36"
    >
      <article className="mx-auto max-w-5xl px-5 pb-24 md:px-8">
        <Link
          to="/"
          data-testid="case-study-back"
          className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-mist transition-colors hover:text-ice"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          MISSION LOG
        </Link>

        <div className="mt-10">
          <Reveal>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Label>{project.category.toUpperCase()}</Label>
              <span className="font-mono text-[10px] tracking-[0.2em] text-mist">{project.year}</span>
              {project.status === 'IN PROGRESS' && (
                <span className="flex items-center gap-2 rounded-full border border-aero-green/40 bg-aero-green/10 px-3 py-1 font-mono text-[9px] tracking-[0.2em] text-aero-green">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-aero-green" />
                  IN PROGRESS
                </span>
              )}
              {project.privacyLabel && (
                <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 font-mono text-[9px] tracking-[0.2em] text-amber-300">
                  {project.privacyLabel.toUpperCase()}
                </span>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.02] tracking-tight text-ice sm:text-5xl md:text-6xl">
              {project.title}
            </h1>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mist">{project.description}</p>
          </Reveal>
          {project.quote && (
            <Reveal delay={0.18}>
              <p className="mt-6 border-l-2 border-aero-sky/60 pl-5 text-base italic text-silver">
                "{project.quote}"
              </p>
            </Reveal>
          )}
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14" data-testid="case-study-visual">
            <ProjectVisual p={project} />
          </div>
        </Reveal>

        {project.board && (
          <div className="mt-16">
            <Reveal>
              <h2 className="mb-8 font-display text-2xl font-semibold text-ice sm:text-3xl">
                Where this actually is
              </h2>
              <LCBoard board={project.board} />
            </Reveal>
          </div>
        )}

        <div className="mt-20 space-y-14">
          {project.caseStudy.map((s) => (
            <Reveal key={s.no}>
              <section className="grid gap-6 md:grid-cols-[110px_1fr]">
                <span className="font-mono text-sm tracking-[0.2em] text-aero-sky/80">{s.no} —</span>
                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-ice sm:text-3xl">
                    {s.heading}
                  </h2>
                  <div className="mt-4 space-y-4">
                    {s.body.map((para, i) => (
                      <p key={i} className="max-w-2xl leading-relaxed text-mist">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </section>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <Link
            to={`/work/${next.slug}`}
            data-testid="next-project-link"
            className="glass group mt-24 flex items-center justify-between p-7 transition-all hover:border-aero-ice/40"
          >
            <div>
              <p className="label-mono">NEXT TRANSMISSION</p>
              <p className="mt-2 font-display text-xl font-semibold text-ice sm:text-2xl">{next.title}</p>
            </div>
            <ArrowUpRight className="h-7 w-7 text-mist transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-aero-ice" />
          </Link>
        </Reveal>
      </article>
    </motion.main>
  );
}
