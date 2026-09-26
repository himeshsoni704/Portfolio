// ─────────────────────────────────────────────────────────────
// PIXELATORAPP — INTEGRATION BOUNDARY.
// ─────────────────────────────────────────────────────────────
// Himesh has the REAL Pixelator JavaScript codebase and will
// provide it later. When that happens:
//   1. Import the existing code (adapt to TSX if necessary).
//   2. Preserve its actual image-processing behavior.
//   3. Render its real controls below (image input + controls
//      + canvas output), styled to match the Aero window.
//   4. Delete the "integration coming soon" panel.
// Do not replace it with a fake demo — this component is the
// single, clean entry point for the real app.
// ─────────────────────────────────────────────────────────────

export default function PixelatorApp() {
  return (
    <div className="py-4 text-center" data-testid="app-pixelator">
      <div
        className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-white/80 shadow-inner"
        style={{ background: 'linear-gradient(180deg, #D6ECFC, #8FC8F0)' }}
      >
        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              className="h-2.5 w-2.5 rounded-[2px]"
              style={{ background: i % 3 === 0 ? '#2E9BE8' : i % 3 === 1 ? '#7DD3FC' : '#34D399' }}
            />
          ))}
        </div>
      </div>
      <h3 className="mt-4 text-[16px] font-bold text-[#173A5E]">Pixelator</h3>
      <p className="mt-1 font-mono text-[9.5px] tracking-[0.25em] text-[#4E7BA3]">
        JAVASCRIPT APPLICATION · INTEGRATION COMING SOON
      </p>
      <p className="mx-auto mt-3 max-w-sm px-4 text-[12.5px] leading-relaxed text-[#3D6285]">
        The real image-processing application will run inside this window once the original
        codebase is integrated — image input, real processing, real controls.
      </p>
    </div>
  );
}
