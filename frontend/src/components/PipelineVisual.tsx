import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Pipeline visuals for the fintech/document projects + the
// document mock panels shown beside them.
// ─────────────────────────────────────────────────────────────

export type Step = { label: string; note: string };

export function PipelineVisual({ steps, light = false }: { steps: Step[]; light?: boolean }) {
  return (
    <ol className="relative flex flex-col gap-0" data-testid="pipeline-visual">
      {steps.map((s, i) => (
        <li key={s.label} className="relative flex gap-4 pb-5 last:pb-0">
          {i < steps.length - 1 && (
            <span
              className={`absolute left-[11px] top-6 h-full w-px ${light ? 'bg-aero-blue/25' : 'bg-aero-ice/15'}`}
            />
          )}
          <span className={`relative mt-1 flex h-6 w-6 shrink-0 items-center justify-center`}>
            <motion.span
              className={`absolute h-6 w-6 rounded-full ${light ? 'bg-aero-blue/15' : 'bg-aero-sky/15'}`}
              animate={{ scale: [1, 1.7, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.4 }}
            />
            <span
              className={`relative h-2.5 w-2.5 rounded-full ${light ? 'bg-aero-blue' : 'bg-aero-sky'}`}
            />
          </span>
          <span className="flex flex-col">
            <span
              className={`font-mono text-[11px] tracking-[0.18em] uppercase ${
                light ? 'text-slate-800' : 'text-ice'
              }`}
            >
              {s.label}
            </span>
            <span className={`text-xs ${light ? 'text-slate-500' : 'text-mist'}`}>{s.note}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

export const EINV_STEPS: Step[] = [
  { label: 'Invoice', note: 'raw document in' },
  { label: 'Extraction', note: 'fields pulled by AI' },
  { label: 'Field Mapping', note: 'aligned to UAE schema' },
  { label: 'Validation', note: 'rules checked' },
  { label: 'Compliance Gap', note: 'what is missing' },
  { label: 'Readiness', note: 'how close to filing' },
];

export const LC_STEPS: Step[] = [
  { label: 'Documents', note: 'trade docs in' },
  { label: 'OCR / Extraction', note: 'text to data' },
  { label: 'Structured Data', note: 'fields normalized' },
  { label: 'Validation', note: 'LC terms checked' },
  { label: 'Discrepancy Detection', note: 'mismatches flagged' },
  { label: 'Workflow', note: 'human review handoff' },
];

export function EInvDocMock() {
  const rows = [
    { field: 'Seller TIN', value: '100xxxxxxxxx', ok: true },
    { field: 'Buyer VAT ID', value: 'TRN-XXXX-XXXX', ok: true },
    { field: 'Invoice Currency', value: 'AED', ok: true },
    { field: 'QR Code', value: 'not found', ok: false },
    { field: 'Timestamp Format', value: 'non-standard', ok: false },
  ];
  return (
    <div className="glass w-full p-5" data-testid="einv-doc-mock">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.25em] text-aero-ice">INVOICE #INV-20XX</span>
        <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-0.5 font-mono text-[9px] tracking-[0.2em] text-amber-300">
          GAPS FOUND
        </span>
      </div>
      <div className="space-y-2.5">
        {rows.map((r) => (
          <div
            key={r.field}
            className="flex items-center justify-between rounded-lg border border-aero-ice/10 bg-space-700/40 px-3 py-2"
          >
            <div>
              <p className="font-mono text-[10px] tracking-[0.15em] text-mist">{r.field}</p>
              <p className="text-xs text-ice">{r.value}</p>
            </div>
            {r.ok ? (
              <Check className="h-4 w-4 text-aero-green" aria-label="valid" />
            ) : (
              <X className="h-4 w-4 text-red-400" aria-label="gap" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function LCBoard({ board }: { board: { current: string[]; exploring: string[]; next: string[] } }) {
  const cols = [
    { title: 'CURRENT', items: board.current, tone: 'text-aero-green' },
    { title: 'EXPLORING', items: board.exploring, tone: 'text-aero-ice' },
    { title: 'NEXT', items: board.next, tone: 'text-silver' },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-3" data-testid="lc-board">
      {cols.map((c) => (
        <div key={c.title} className="glass p-5">
          <p className={`mb-4 font-mono text-[10px] tracking-[0.25em] ${c.tone}`}>{c.title}</p>
          <ul className="space-y-2.5">
            {c.items.map((it) => (
              <li key={it} className="flex gap-2 text-sm leading-relaxed text-mist">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-aero-sky/60" />
                {it}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
