import { useEffect, useRef, useState } from 'react';

// ─────────────────────────────────────────────────────────────
// PIXELATOR — live canvas pixelation demo. Drag the slider,
// everything becomes pixels. (Sample image: replace with your own.)
// ─────────────────────────────────────────────────────────────

const SAMPLE_IMAGE =
  'https://static.prod-images.emergentagent.com/jobs/19119139-9591-4021-9742-57b7af2f3269/images/4c8d9fa9562c4385b2dd5370b13d6bdf6885d913d2d84da9fce882b558656be6.jpeg'; // PLACEHOLDER — swap for your sample

export default function PixelatorDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [block, setBlock] = useState(14);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = SAMPLE_IMAGE;
    img.onload = () => {
      imgRef.current = img;
      setReady(true);
    };
    img.onerror = () => setReady(false);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !ready) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = 512;
    canvas.width = W;
    canvas.height = W;

    // pixelate by drawing small, then upscaling with smoothing off —
    // no pixel reads, so it works with any image source.
    const small = document.createElement('canvas');
    const n = Math.max(2, Math.round(64 - (block / 48) * 60)); // 64 blocks → 4 blocks
    small.width = n;
    small.height = n;
    const sctx = small.getContext('2d');
    if (!sctx) return;
    sctx.drawImage(img, 0, 0, n, n);

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, W, W);
    ctx.drawImage(small, 0, 0, W, W);
  }, [block, ready]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5" data-testid="pixelator-demo">
      <div className="relative w-full max-w-[380px] overflow-hidden rounded-2xl border border-white/50 bg-white/40 shadow-[0_18px_45px_rgba(37,99,235,0.18)]">
        <canvas ref={canvasRef} className="block h-auto w-full" data-testid="pixelator-canvas" aria-label="Pixelated sample image" />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-200/80 font-mono text-xs text-slate-500">
            loading sample…
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-space-900/70 px-2.5 py-1 font-mono text-[9px] tracking-[0.2em] text-aero-ice">
          {ready ? `${64 - Math.round((block / 48) * 60)}× BLOCKS` : '—'}
        </span>
      </div>
      <div className="flex w-full max-w-[380px] items-center gap-4">
        <span className="font-mono text-[10px] tracking-[0.2em] text-slate-600">CLEAN</span>
        <input
          type="range"
          min={2}
          max={48}
          value={block}
          data-testid="pixelator-slider-input"
          aria-label="Pixelation amount"
          onChange={(e) => setBlock(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-aero-blue/30 accent-blue-600"
        />
        <span className="font-mono text-[10px] tracking-[0.2em] text-slate-600">PIXELS</span>
      </div>
    </div>
  );
}
