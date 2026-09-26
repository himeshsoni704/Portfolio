import { useState } from 'react';
import { toast } from 'sonner';
import { PHOTOS, FILM } from '../data/photography';
import { useAero } from '../win/AeroWindow';
import { SectionHeading, MonoLabel } from '../win/ui';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// PHOTOGRAPHY & FILM — highly visual. Click a photo → a
// Windows-Photo-Viewer × Aero glass window with prev/next and
// fullscreen. Placeholders clearly marked until real photos.
// ─────────────────────────────────────────────────────────────

export default function Photography() {
  const { open } = useAero();

  const openViewer = (i: number) => {
    open({
      id: 'photo-viewer',
      title: 'Windows Photo Viewer',
      icon: 'viewer',
      width: 780,
      render: () => <PhotoViewerBody start={i} />,
    });
  };

  return (
    <section
      id="photography"
      className="relative py-24 md:py-32"
      style={{ background: 'linear-gradient(180deg, #DCEEFB 0%, #F2FAFF 50%, #E3F1FC 100%)' }}
      data-testid="photography-section"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionHeading
          index="05"
          label="PHOTOGRAPHY & FILM"
          title="The visual half."
          subtitle="I'm interested in photography, filmmaking and experimenting with cameras — mostly through the Reflexions Photography & Videography Club at BITS Dubai. Frames below are placeholders until my real photographs land here."
        />

        <MonoLabel>GALLERY · CLICK FOR THE PHOTO VIEWER</MonoLabel>
        <div className="mt-4 columns-2 gap-4 md:columns-3 [&>*]:mb-4" data-testid="photography-grid">
          {PHOTOS.map((p, i) => (
            <button
              key={p.src}
              data-testid={`photo-thumb-${i}`}
              onClick={() => openViewer(i)}
              className="group relative block w-full overflow-hidden rounded-2xl border border-white/80 shadow-[0_12px_30px_rgba(30,100,170,0.12)]"
              aria-label={`Open photo ${i + 1} in the photo viewer`}
            >
              <img
                src={p.src}
                alt={p.alt}
                loading={i < 4 ? 'eager' : 'lazy'}
                className="w-full transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A2C4E]/70 to-transparent px-3 pb-2.5 pt-10 text-left font-mono text-[8.5px] tracking-[0.2em] text-white/90">
                {p.caption}
              </span>
            </button>
          ))}
        </div>

        {/* film */}
        <div className="mt-16 rounded-3xl border border-white/80 bg-white/60 p-6 shadow-[0_18px_50px_rgba(30,100,170,0.10)] backdrop-blur md:p-8" data-testid="film-block">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-2xl font-bold tracking-tight text-[#122B45]">Film</h3>
            <MonoLabel>FILMMAKING · CINEMATOGRAPHY · EXPERIMENTS</MonoLabel>
          </div>
          <p className="mt-4 max-w-2xl text-[13.5px] leading-relaxed text-[#3D6285]">{FILM.intro}</p>

          <div className="mt-6 grid gap-5 sm:grid-cols-[220px_1fr]">
            <div className="relative overflow-hidden rounded-2xl border border-white/80 shadow-sm">
              <img src={FILM.poster.src} alt={FILM.poster.alt} className="w-full" loading="lazy" />
              <span className="absolute left-2.5 top-2.5 rounded-full bg-[#0A2C4E]/80 px-2.5 py-1 font-mono text-[8.5px] tracking-[0.2em] text-amber-300">
                {FILM.poster.caption}
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <button
                data-testid="film-video-placeholder"
                onClick={() => toast('No video yet — [ADD VIDEO] placeholder.')}
                className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-[#9CC8E8] bg-gradient-to-b from-[#173A5E] to-[#0A2C4E]"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full border-2 border-white/70 bg-gradient-to-b from-[#F59E0B] to-[#B45309] shadow-lg transition-transform group-hover:scale-110">
                  <span className="ml-1 h-0 w-0 border-y-8 border-l-[14px] border-y-transparent border-l-white" />
                </span>
                <span className="absolute bottom-3 left-3 font-mono text-[9px] tracking-[0.22em] text-white/80">
                  [ADD VIDEO]
                </span>
              </button>
              <div className="grid grid-cols-2 gap-3">
                {FILM.bts.map((b) => (
                  <div key={b.src} className="relative overflow-hidden rounded-xl border border-white/80 shadow-sm">
                    <img src={b.src} alt={b.alt} className="aspect-video w-full object-cover" loading="lazy" />
                    <span className="absolute left-2 top-2 rounded-full bg-[#0A2C4E]/80 px-2 py-0.5 font-mono text-[8px] tracking-[0.2em] text-white/90">
                      {b.caption}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {FILM.gear.map((g) => (
                  <span key={g} className="rounded-full border border-[#A9CBE8] bg-white/70 px-3 py-1 text-[11px] font-medium text-[#33608A]">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhotoViewerBody({ start }: { start: number }) {
  const [i, setI] = useState(start);
  const [full, setFull] = useState(false);
  const step = (d: number) => setI((v) => (v + d + PHOTOS.length) % PHOTOS.length);

  return (
    <div className={full ? 'fixed inset-0 z-[210] bg-[#04121E]/95 p-6' : ''} data-testid="photo-viewer-body">
      <div className={full ? 'grid h-full place-items-center' : 'p-4'}>
        <figure className="mx-auto max-w-full text-center">
          <img
            src={PHOTOS[i].src}
            alt={PHOTOS[i].alt}
            className={`mx-auto w-auto rounded-lg border border-white/50 shadow-2xl ${full ? 'max-h-[82vh]' : 'max-h-[54vh]'}`}
          />
          <figcaption className="mt-2.5 font-mono text-[9px] tracking-[0.22em] text-[#5B84A8]">
            {PHOTOS[i].caption} · {i + 1}/{PHOTOS.length}
          </figcaption>
        </figure>
        <div className="mt-4 flex items-center justify-center gap-3">
          <button data-testid="viewer-prev" onClick={() => step(-1)} aria-label="Previous photo" className="viewer-btn">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button data-testid="viewer-fullscreen" onClick={() => setFull((f) => !f)} aria-label="Toggle fullscreen" className="viewer-btn">
            <Maximize2 className="h-4 w-4" />
          </button>
          <button data-testid="viewer-next" onClick={() => step(1)} aria-label="Next photo" className="viewer-btn">
            <ChevronRight className="h-4 w-4" />
          </button>
          {full && (
            <button data-testid="viewer-exit-fullscreen" onClick={() => setFull(false)} aria-label="Exit fullscreen" className="viewer-btn">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
