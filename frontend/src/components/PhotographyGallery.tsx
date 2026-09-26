import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { PHOTOS } from '../data/photography';
import { Reveal } from './aero';

export default function PhotographyGallery() {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (dir: number) => {
      setActive((a) => (a === null ? a : (a + dir + PHOTOS.length) % PHOTOS.length));
    },
    []
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, close, step]);

  return (
    <div data-testid="photography-gallery">
      <Reveal>
        <p className="mb-6 font-mono text-[10px] tracking-[0.2em] text-slate-500">
          FRAMES BELOW ARE PLACEHOLDERS — THE REAL PHOTOGRAPHS LAND HERE SOON. MEANWHILE, SAY HI ON
          INSTAGRAM.
        </p>
      </Reveal>
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {PHOTOS.map((p, i) => (
          <Reveal key={p.src} delay={(i % 3) * 0.06}>
            <button
              data-testid={`photo-thumb-${i}`}
              onClick={() => setActive(i)}
              className="group relative block w-full overflow-hidden rounded-2xl border border-white/60 bg-white/50 text-left shadow-[0_14px_40px_rgba(37,99,235,0.12)]"
              aria-label={`Open photo ${i + 1} in lightbox`}
            >
              <img
                src={p.src}
                alt={p.alt}
                loading={i < 3 ? 'eager' : 'lazy'}
                className="w-full transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-space-900/70 to-transparent px-4 pb-3 pt-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="font-mono text-[9px] tracking-[0.2em] text-ice">{p.caption}</span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-space-950/92 p-4 backdrop-blur-md"
            data-testid="photo-lightbox-modal"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Photo lightbox"
          >
            <button
              className="absolute right-5 top-5 rounded-full border border-aero-ice/30 p-2.5 text-ice transition-colors hover:bg-white/10"
              onClick={close}
              aria-label="Close lightbox"
              data-testid="lightbox-close"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-aero-ice/30 p-2.5 text-ice transition-colors hover:bg-white/10 md:left-8"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <motion.figure
              key={active}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="max-h-[88vh] max-w-[88vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={PHOTOS[active].src}
                alt={PHOTOS[active].alt}
                className="max-h-[80vh] w-auto rounded-2xl border border-aero-ice/20 object-contain"
              />
              <figcaption className="mt-3 text-center font-mono text-[10px] tracking-[0.2em] text-mist">
                {PHOTOS[active].caption}
              </figcaption>
            </motion.figure>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-aero-ice/30 p-2.5 text-ice transition-colors hover:bg-white/10 md:right-8"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
