const ITEMS = [
  'QUANTUM COMPUTING',
  'MACHINE LEARNING',
  'COMPUTER VISION',
  'CREATIVE CODING',
  'PHOTOGRAPHY',
  'FILMMAKING',
  'SIMULATIONS',
  'RAG SYSTEMS',
  'QISKIT',
  'DAVINCI RESOLVE',
];

export default function Marquee() {
  return (
    <div
      className="relative overflow-hidden border-y hairline bg-space-850/60 py-5"
      aria-label="Interests ticker"
    >
      <div
        className="flex w-max items-center gap-10 pr-10"
        style={{ animation: 'marquee 48s linear infinite' }}
      >
        {[0, 1].map((copy) => (
          <div className="flex items-center gap-10" key={copy} aria-hidden={copy === 1}>
            {ITEMS.map((item) => (
              <span key={`${copy}-${item}`} className="flex items-center gap-10">
                <span className="font-mono text-xs tracking-[0.3em] text-silver">{item}</span>
                <span className="inline-block h-1.5 w-1.5 rotate-45 bg-aero-sky/70" />
              </span>
            ))}
          </div>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
