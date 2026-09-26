import { toast } from 'sonner';
import { Play } from 'lucide-react';
import { Reveal } from './aero';

// ─────────────────────────────────────────────────────────────
// FILM / MOTION — poster, video placeholder, BTS.
// Replace VIDEO_PLACEHOLDER_URL with the real film link later;
// swap the poster + BTS images in-place below.
// ─────────────────────────────────────────────────────────────

const POSTER = 'https://static.prod-images.emergentagent.com/jobs/19119139-9591-4021-9742-57b7af2f3269/images/3109efb58a30adbc889e5c1f9f24e0f80d0d810245244951a8ab8f912bf7db30.jpeg'; // PLACEHOLDER — replace with your film poster
const BTS_1 = 'https://static.prod-images.emergentagent.com/jobs/19119139-9591-4021-9742-57b7af2f3269/images/91c16159a84dcfe290f9e12eba6502d89fc0de5c19882362c14e29763c02b6d8.jpeg'; // PLACEHOLDER
const BTS_2 = 'https://static.prod-images.emergentagent.com/jobs/19119139-9591-4021-9742-57b7af2f3269/images/79fe2ed414643cc5edf8df24e15a2c1df7e4a0d229f48cf15960cb997df2fb56.jpeg'; // PLACEHOLDER

export default function FilmSection() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28" data-testid="film-section">
      <Reveal>
        <p className="label-mono mb-5">MOTION</p>
        <h3 className="text-3xl font-semibold tracking-tight text-ice sm:text-4xl md:text-5xl">
          Making pictures move.
        </h3>
        <p className="mt-5 max-w-xl leading-relaxed text-mist">
          Cinematography, editing, and short film experiments — mostly through the{' '}
          <span className="text-aero-ice">REFLEXIONS Photography &amp; Videography Club</span> at
          BITS Pilani Dubai. Editing happens in DaVinci Resolve. One of the experiments is a short
          cinematic horror film.
        </p>
      </Reveal>

      <div className="mt-14 grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-aero-ice/20">
            <img src={POSTER} alt="Placeholder film poster — a dark corridor still" className="w-full" loading="lazy" />
            <span className="absolute left-3 top-3 rounded-full bg-space-900/80 px-3 py-1 font-mono text-[9px] tracking-[0.2em] text-amber-300 backdrop-blur">
              POSTER PLACEHOLDER
            </span>
            <span className="absolute bottom-3 left-3 rounded-full bg-space-900/80 px-3 py-1 font-mono text-[9px] tracking-[0.2em] text-aero-ice backdrop-blur">
              SHORT FILM — HORROR
            </span>
          </div>
        </Reveal>

        <div className="flex flex-col gap-8">
          <Reveal delay={0.1}>
            <button
              data-testid="film-video-placeholder"
              onClick={() => toast('Video placeholder — drop your film link or file here later.')}
              className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-aero-ice/20 bg-space-800/60"
              aria-label="Play film (video placeholder)"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    'radial-gradient(500px 300px at 50% 45%, rgba(56,189,248,0.25), transparent 70%)',
                }}
              />
              <span className="gloss-btn relative flex h-20 w-20 items-center justify-center rounded-full">
                <Play className="h-7 w-7 text-ice" />
              </span>
              <span className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.25em] text-mist">
                VIDEO PLACEHOLDER — 16:9
              </span>
            </button>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="font-mono text-[10px] tracking-[0.25em] text-mist">BEHIND THE SCENES</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {[BTS_1, BTS_2].map((src, i) => (
                <div key={src} className="relative overflow-hidden rounded-xl border border-aero-ice/15">
                  <img src={src} alt={`Placeholder behind-the-scenes still ${i + 1}`} className="aspect-video w-full object-cover" loading="lazy" />
                  <span className="absolute left-2 top-2 rounded-full bg-space-900/80 px-2 py-0.5 font-mono text-[8px] tracking-[0.2em] text-mist backdrop-blur">
                    PLACEHOLDER
                  </span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-wrap gap-2">
              {['DAVINCI RESOLVE', 'CINEMATOGRAPHY', 'EDITING', 'SHORT FILMS'].map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-aero-ice/25 bg-aero-sky/5 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.2em] text-silver"
                >
                  {c}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
