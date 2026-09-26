import { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// WATER BOTTLE SIMULATION — a small 2D canvas physics toy.
// Drag horizontally to tilt the bottle; the water (particles)
// responds to gravity in the bottle's rotating frame.
// ─────────────────────────────────────────────────────────────

type P = { x: number; y: number; vx: number; vy: number };

export default function BottleSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const targetRef = useRef(0);
  const dragRef = useRef<{ active: boolean; startX: number; startAngle: number }>({
    active: false,
    startX: 0,
    startAngle: 0,
  });
  const [tickLabel, setTickLabel] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 420;
    const H = 480;
    canvas.width = W;
    canvas.height = H;

    const BW = 120; // bottle width (local frame)
    const BH = 300; // bottle height
    const PR = 7; // particle radius

    const parts: P[] = [];
    const reset = () => {
      parts.length = 0;
      for (let i = 0; i < 130; i++) {
        parts.push({
          x: (Math.random() - 0.5) * (BW - PR * 3),
          y: (Math.random() - 0.35) * (BH * 0.55),
          vx: 0,
          vy: 0,
        });
      }
    };
    reset();

    const toLocal = (x: number, y: number, cx: number, cy: number, a: number) => {
      const dx = x - cx;
      const dy = y - cy;
      const c = Math.cos(-a);
      const s = Math.sin(-a);
      return { x: dx * c - dy * s, y: dx * s + dy * c };
    };

    let raf = 0;
    let t = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      t += 0.016;

      // angle dynamics: ease toward target; idle sway when untouched
      if (!dragRef.current.active) {
        targetRef.current = Math.sin(t * 0.4) * 0.22;
      }
      angleRef.current += (targetRef.current - angleRef.current) * 0.08;
      const a = angleRef.current;
      const cx = W / 2;
      const cy = H / 2 + 10;

      // physics
      const G = 0.34;
      for (const p of parts) {
        p.vy += G;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy *= 0.985;

        const l = toLocal(p.x, p.y, cx, cy, a);
        const hw = BW / 2 - PR;
        const hh = BH / 2 - PR;
        if (l.x < -hw) {
          l.x = -hw;
          p.vx = Math.abs(p.vx) * 0.42;
        }
        if (l.x > hw) {
          l.x = hw;
          p.vx = -Math.abs(p.vx) * 0.42;
        }
        if (l.y < -hh) {
          l.y = -hh;
          p.vy = Math.abs(p.vy) * 0.42;
        }
        if (l.y > hh) {
          l.y = hh;
          p.vy = -Math.abs(p.vy) * 0.3;
          p.vx *= 0.9;
        }
        const c = Math.cos(a);
        const s = Math.sin(a);
        p.x = cx + l.x * c - l.y * s;
        p.y = cy + l.x * s + l.y * c;
      }
      // gentle particle separation
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const dx = parts[j].x - parts[i].x;
          const dy = parts[j].y - parts[i].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < PR * PR * 2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = ((PR * 1.4 - d) / d) * 0.16;
            parts[i].x -= dx * f;
            parts[i].y -= dy * f;
            parts[j].x += dx * f;
            parts[j].y += dy * f;
          }
        }
      }

      // draw
      ctx.clearRect(0, 0, W, H);

      // water first (inside glass illusion)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(a);
      for (const p of parts) {
        const l = toLocal(p.x, p.y, cx, cy, a);
        ctx.beginPath();
        ctx.arc(l.x, l.y, PR, 0, Math.PI * 2);
        const g = ctx.createRadialGradient(l.x - 2, l.y - 2, 1, l.x, l.y, PR);
        g.addColorStop(0, 'rgba(125,211,252,0.95)');
        g.addColorStop(1, 'rgba(37,99,235,0.55)');
        ctx.fillStyle = g;
        ctx.fill();
      }
      // bottle container
      const r = 34;
      ctx.beginPath();
      ctx.roundRect(-BW / 2, -BH / 2, BW, BH, r);
      const glass = ctx.createLinearGradient(-BW / 2, 0, BW / 2, 0);
      glass.addColorStop(0, 'rgba(255,255,255,0.35)');
      glass.addColorStop(0.5, 'rgba(255,255,255,0.08)');
      glass.addColorStop(1, 'rgba(255,255,255,0.28)');
      ctx.fillStyle = glass;
      ctx.fill();
      ctx.strokeStyle = 'rgba(224,242,254,0.85)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      // cap
      ctx.fillStyle = 'rgba(199,210,222,0.95)';
      ctx.beginPath();
      ctx.roundRect(-BW / 2 + 20, -BH / 2 - 22, BW - 40, 22, 8);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = 'rgba(148,163,184,0.75)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('2D CANVAS EXPERIMENT — DRAG TO TILT', 16, H - 16);
    };
    loop();

    const onDown = (e: PointerEvent) => {
      dragRef.current = { active: true, startX: e.clientX, startAngle: angleRef.current };
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current.active) return;
      const delta = (e.clientX - dragRef.current.startX) / 140;
      targetRef.current = Math.max(-1.3, Math.min(1.3, dragRef.current.startAngle + delta));
    };
    const onUp = () => {
      dragRef.current.active = false;
    };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointerleave', onUp);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointerleave', onUp);
    };
  }, []);

  const handleReset = () => {
    // simplest honest reset: remount by re-running effect via key change signal
    angleRef.current = 0;
    targetRef.current = 0;
    setTickLabel((n) => n + 1);
    const canvas = canvasRef.current;
    if (canvas) {
      // dispatch a synthetic re-init by clearing — particles rebuild on next mount
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4" data-testid="bottle-sim">
      <canvas
        key={tickLabel}
        ref={canvasRef}
        className="mx-auto block h-auto w-full max-w-[380px] cursor-grab touch-none rounded-2xl border border-aero-ice/20 bg-space-800/60 active:cursor-grabbing"
        aria-label="2D water bottle physics simulation — drag to tilt the bottle"
      />
      <button
        data-testid="water-bottle-reset-button"
        onClick={handleReset}
        className="flex items-center gap-2 rounded-full border border-aero-ice/30 px-5 py-2 font-mono text-[10px] tracking-[0.2em] text-silver transition-colors hover:border-aero-ice/70 hover:text-ice"
      >
        <RotateCcw className="h-3.5 w-3.5" /> RESET
      </button>
    </div>
  );
}
