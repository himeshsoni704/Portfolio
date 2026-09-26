import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/skills';
import { MonoLabel } from './ui';

// ─────────────────────────────────────────────────────────────
// SKILLS DRAWER — slides in from the right. Categories and
// chips. No percentage bars, ever.
// ─────────────────────────────────────────────────────────────

export default function SkillsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[170] bg-[#0A2C4E]/30 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: '105%' }}
            animate={{ x: 0 }}
            exit={{ x: '105%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[175] w-[min(94vw,440px)] overflow-y-auto border-l border-white/70 shadow-[-30px_0_80px_rgba(8,40,80,0.35)]"
            style={{ background: 'linear-gradient(170deg, rgba(246,251,255,0.97), rgba(219,238,252,0.95))', backdropFilter: 'blur(24px)' }}
            data-testid="skills-drawer"
            role="dialog"
            aria-label="Skills"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/70 bg-gradient-to-b from-[#D5ECFD]/95 to-[#C4E1F8]/90 px-5 py-3.5 backdrop-blur">
              <span className="text-[13px] font-semibold tracking-wide text-[#1A3A5C]">Skills</span>
              <button
                data-testid="skills-drawer-close"
                onClick={onClose}
                aria-label="Close skills"
                className="grid h-7 w-8 place-items-center rounded-md border border-[#E8A9A0] bg-gradient-to-b from-[#F09588] to-[#D2554A] text-white shadow-sm transition-all hover:from-[#F8A89C] active:scale-95"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.5} />
              </button>
            </div>
            <div className="space-y-6 p-5">
              {SKILL_CATEGORIES.map((cat) => (
                <div key={cat.id} data-testid={`skills-drawer-${cat.id}`}>
                  <MonoLabel>{cat.title.toUpperCase()}</MonoLabel>
                  <p className="mt-1 text-[11.5px] text-[#7FA5C4]">{cat.blurb}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {cat.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-[#A9CBE8] bg-white/85 px-3 py-1.5 text-[12px] font-medium text-[#33608A] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <p className="pb-4 font-mono text-[8.5px] tracking-[0.25em] text-[#9FB9CE]">
                NO PERCENTAGES — PROFICIENCY IS EARNED, NOT DECLARED
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function useSkillsDrawer() {
  return useState(false);
}
