import { useState } from 'react';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────
// QKD DIAGRAM — ALICE → QUANTUM CHANNEL → BOB, with EVE.
// A living illustration for the QKD research entry (simulated
// values are illustrative, not research results).
// ─────────────────────────────────────────────────────────────

export default function QKDDiagram() {
  const [eve, setEve] = useState(false);

  return (
    <div
      className="relative flex w-full flex-col justify-between rounded-2xl border border-white/25 bg-gradient-to-b from-[#0E2438]/95 to-[#0A2C4E]/95 p-5"
      data-testid="qkd-diagram"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-[0.25em] text-[#7FA5C4]">SIMULATED CHANNEL · BB84 / BKM07</span>
        <span className={`font-mono text-[9px] tracking-[0.25em] ${eve ? 'text-red-400' : 'text-emerald-300'}`}>
          {eve ? '● ATTACK' : '● NOMINAL'}
        </span>
      </div>

      <svg viewBox="0 0 640 260" className="w-full" role="img" aria-label="Quantum key distribution diagram: Alice, quantum channel, Bob, and Eve">
        <defs>
          <linearGradient id="chan" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <line x1="110" y1="110" x2="530" y2="110" stroke="url(#chan)" strokeWidth={eve ? 2 : 3} />
        <line
          x1="110" y1="110" x2="530" y2="110"
          stroke={eve ? '#F87171' : '#38BDF8'}
          strokeWidth="1"
          strokeDasharray="4 10"
          opacity="0.5"
        />

        <g>
          <rect x="20" y="82" width="88" height="56" rx="14" fill="rgba(56,189,248,0.08)" stroke="rgba(125,211,252,0.4)" />
          <text x="64" y="115" textAnchor="middle" fill="#F4FAFF" fontFamily="JetBrains Mono, monospace" fontSize="15" letterSpacing="2">ALICE</text>
        </g>
        <g>
          <rect x="532" y="82" width="88" height="56" rx="14" fill="rgba(56,189,248,0.08)" stroke="rgba(125,211,252,0.4)" />
          <text x="576" y="115" textAnchor="middle" fill="#F4FAFF" fontFamily="JetBrains Mono, monospace" fontSize="15" letterSpacing="2">BOB</text>
        </g>

        {[0, 1, 2, 3, 4].map((i) => (
          <motion.circle
            key={i}
            r="5"
            cy="110"
            cx="0"
            fill={eve && i % 2 === 0 ? '#F87171' : '#7DD3FC'}
            initial={{ x: 118 }}
            animate={
              eve
                ? { x: [118, 240, 300, 380, 522], y: [0, -7, 6, -5, 0] }
                : { x: [118, 522], y: [0, 0, 0] }
            }
            transition={{ duration: eve ? 2.6 : 3.2, repeat: Infinity, delay: i * 0.55, ease: 'linear' }}
          />
        ))}

        <g>
          <motion.line
            x1="320" y1="182" x2="320" y2="113"
            stroke={eve ? '#F87171' : '#64748B'}
            strokeWidth="1.5"
            strokeDasharray={eve ? '0' : '3 5'}
            animate={eve ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.6 }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <motion.g animate={eve ? { y: [0, -3, 0] } : { y: 0 }} transition={{ duration: 0.9, repeat: Infinity }}>
            <rect x="286" y="184" width="68" height="42" rx="12" fill={eve ? 'rgba(248,113,113,0.12)' : 'rgba(100,116,139,0.12)'} stroke={eve ? '#F87171' : '#64748B'} />
            <text x="320" y="211" textAnchor="middle" fill={eve ? '#F87171' : '#94A3B8'} fontFamily="JetBrains Mono, monospace" fontSize="14" letterSpacing="2">EVE</text>
          </motion.g>
        </g>
      </svg>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#7FA5C4]">
            QBER ≈ {eve ? '11.2% ▲' : '0.4%'} · TEMPORAL BEHAVIOUR MONITORED
          </span>
          <span
            data-testid="qkd-ml-verdict"
            className={`font-mono text-[10px] tracking-[0.2em] ${eve ? 'text-red-400' : 'text-emerald-300'}`}
          >
            ML DETECTOR: {eve ? 'ATTACK DETECTED — ANOMALY FLAG' : 'SCANNING · NO ANOMALY'}
          </span>
        </div>
        <button
          data-testid="qkd-eve-toggle-button"
          onClick={() => setEve(!eve)}
          className={`rounded-full border px-4 py-1.5 font-mono text-[10px] tracking-[0.2em] transition-all ${
            eve
              ? 'border-red-400/60 bg-red-400/10 text-red-300 hover:bg-red-400/20'
              : 'border-[#67C3EA]/60 bg-[#38BDF8]/10 text-[#7DD3FC] hover:bg-[#38BDF8]/25'
          }`}
        >
          {eve ? 'STOP ATTACK' : 'SIMULATE EAVESDROP'}
        </button>
      </div>

      <p className="mt-3 font-mono text-[9px] leading-relaxed tracking-[0.15em] text-[#7FA5C4]/70">
        ILLUSTRATIVE DEMO VALUES — NOT RESEARCH RESULTS
      </p>
    </div>
  );
}
