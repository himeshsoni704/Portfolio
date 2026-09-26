import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { Pause, Play, SkipBack, SkipForward, Volume2, X } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// MEDIA PLAYER — compact Win7 WMP-inspired floater. Bottom-left.
// No music provided yet → honest "No track loaded".
// Wire real audio into TRACKS below when supplied.
// ─────────────────────────────────────────────────────────────

const TRACKS: { title: string; artist: string; src: string }[] = []; // [ADD MUSIC]

export default function MediaPlayer() {
  const [open, setOpen] = useState(false);
  const hasTrack = TRACKS.length > 0;
  const nudge = () => toast(hasTrack ? 'Controls activate once a track is loaded.' : 'No track loaded — [ADD MUSIC]');

  return (
    <div className="fixed bottom-5 left-5 z-[140]" data-testid="media-player">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mb-3 w-[320px] overflow-hidden rounded-2xl border border-white/50 shadow-[0_30px_70px_rgba(4,30,60,0.5)]"
            style={{ background: 'linear-gradient(180deg, rgba(17,40,64,0.94), rgba(7,22,38,0.96))', backdropFilter: 'blur(20px)' }}
            data-testid="media-player-panel"
          >
            <div className="flex items-center justify-between border-b border-white/12 px-3.5 py-2">
              <span className="font-mono text-[8.5px] tracking-[0.3em] text-white/60">HIMESH MEDIA PLAYER</span>
              <button data-testid="media-player-close" onClick={() => setOpen(false)} aria-label="Close media player" className="text-white/60 transition-colors hover:text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-4 px-4 py-4">
              <div className="relative h-16 w-16 shrink-0 rounded-xl border border-white/25" style={{ background: 'radial-gradient(circle at 35% 30%, #2E5E8E, #0A1B2C)' }}>
                <Play className="absolute inset-0 m-auto h-6 w-6 text-white/70" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-semibold text-white/95">{hasTrack ? TRACKS[0].title : 'No track loaded'}</p>
                <p className="truncate text-[11.5px] text-white/50">{hasTrack ? TRACKS[0].artist : '[ADD MUSIC]'}</p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full w-0 rounded-full bg-gradient-to-r from-[#38BDF8] to-[#F59E0B]" />
                </div>
                <p className="mt-1.5 font-mono text-[8px] tracking-[0.25em] text-white/40">—:— / —:—</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-white/12 px-4 py-2.5">
              <div className="flex items-center gap-3.5">
                <button data-testid="media-prev" onClick={nudge} aria-label="Previous track" className="text-white/65 hover:text-white">
                  <SkipBack className="h-4 w-4" />
                </button>
                <button
                  data-testid="media-play"
                  onClick={nudge}
                  aria-label="Play"
                  className="grid h-9 w-9 place-items-center rounded-full border-2 border-white/60 shadow-[0_0_14px_rgba(56,189,248,0.4)] transition-transform hover:scale-105 active:scale-95"
                  style={{ background: 'radial-gradient(circle at 35% 30%, #7DD3FC, #0EA5E9 55%, #0B4A8F)' }}
                >
                  <Play className="ml-0.5 h-4 w-4 text-white" />
                </button>
                <button data-testid="media-next" onClick={nudge} aria-label="Next track" className="text-white/65 hover:text-white">
                  <SkipForward className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="h-3.5 w-3.5 text-white/50" aria-label="Volume" />
                <div className="h-1 w-16 overflow-hidden rounded-full bg-white/15" aria-hidden="true">
                  <div className="h-full w-2/3 rounded-full bg-white/50" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        data-testid="media-player-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Hide media player' : 'Show media player'}
        className="grid h-12 w-12 place-items-center rounded-full border-2 border-white/70 shadow-[0_10px_30px_rgba(10,60,110,0.45)] transition-transform hover:scale-105 active:scale-95"
        style={{ background: 'radial-gradient(circle at 35% 30%, #FFD9A8, #F59E0B 55%, #B45309)' }}
      >
        <Play className="ml-0.5 h-5 w-5 text-white" />
      </button>
    </div>
  );
}
