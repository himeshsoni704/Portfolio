import { useState } from 'react';
import { useWinMgr } from './WinManager';
import { AppIcon } from '../win/icons';
import { MonoLabel, Chip } from '../win/ui';
import { SKILL_CATEGORIES } from '../data/skills';
import { JOURNEY } from '../data/timeline';
import Explorer from './Explorer';
import { Sun, Moon, Monitor } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Remaining World 2 applications: Timeline, Skills, Settings.
// ─────────────────────────────────────────────────────────────

export function TimelineApp() {
  const [i, setI] = useState(JOURNEY.length - 1);
  const e = JOURNEY[i];
  return (
    <div className="p-6" data-testid="app-timeline">
      <MonoLabel>HIMESH TIMELINE</MonoLabel>
      <h2 className="mt-2 text-[19px] font-bold tracking-tight text-[#173A5E]">My Journey</h2>

      {/* horizontal slider */}
      <div className="relative mt-8 px-2">
        <div className="absolute left-0 right-0 top-[7px] h-[3px] rounded-full bg-gradient-to-r from-[#BFD9EE] via-[#5FB8F2] to-[#2E76B8]" />
        <div className="relative flex justify-between">
          {JOURNEY.map((j, ji) => (
            <button
              key={`${j.year}-${ji}`}
              data-testid={`timeline-node-${j.year}-${ji}`}
              onClick={() => setI(ji)}
              aria-label={`Go to ${j.year}`}
              className="group relative flex flex-col items-center"
            >
              <span
                className={`h-4 w-4 rounded-full border-2 transition-all ${
                  ji === i ? 'scale-125 border-[#1668B8] bg-[#5FB8F2] shadow-[0_0_12px_rgba(56,189,248,0.7)]' : 'border-[#8FB6D8] bg-white group-hover:border-[#5FB8F2]'
                }`}
              />
              <span className={`mt-2 font-mono text-[10px] tracking-[0.15em] ${ji === i ? 'font-bold text-[#1668B8]' : 'text-[#7FA5C4]'}`}>{j.year}</span>
            </button>
          ))}
        </div>
        <input
          type="range"
          min={0}
          max={JOURNEY.length - 1}
          value={i}
          data-testid="timeline-slider"
          aria-label="Timeline year slider"
          onChange={(ev) => setI(Number(ev.target.value))}
          className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-transparent accent-blue-600"
        />
      </div>

      {/* year card */}
      <div className="mt-6 rounded-2xl border border-[#A9CBE8] bg-white/75 p-5" data-testid="timeline-detail">
        <p className="font-mono text-[11px] tracking-[0.25em] text-[#2E76B8]">{e.year}</p>
        <h3 className="mt-1.5 text-[16.5px] font-bold text-[#173A5E]">{e.title}</h3>
        {e.metric && <p className="mt-2 inline-block rounded-full border border-[#7CCFA5] bg-[#E4F7EE] px-3 py-1 font-mono text-[10px] tracking-[0.15em] text-[#1E7A4E]">{e.metric}</p>}
        <ul className="mt-3 space-y-1.5">
          {e.details.map((d) => (
            <li key={d} className="flex gap-2 text-[13px] leading-relaxed text-[#3D6285]">
              <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#5FB8F2]" />
              {d}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function SkillsApp() {
  const [cat, setCat] = useState(SKILL_CATEGORIES[0].id);
  const active = SKILL_CATEGORIES.find((c) => c.id === cat)!;
  return (
    <div className="flex h-full" data-testid="app-skills">
      <aside className="w-[200px] shrink-0 space-y-1 overflow-y-auto border-r border-[#CFE3F4] bg-gradient-to-b from-[#F0F7FE] to-[#E4F1FC] p-3">
        <MonoLabel>CATEGORIES</MonoLabel>
        {SKILL_CATEGORIES.map((c) => (
          <button
            key={c.id}
            data-testid={`skills-folder-${c.id}`}
            onClick={() => setCat(c.id)}
            className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-[12.5px] font-semibold transition-all ${
              c.id === cat ? 'border-[#5FB8F2] bg-[#D6ECFC] text-[#173A5E]' : 'border-transparent text-[#33608A] hover:bg-white/70'
            }`}
          >
            <AppIcon name="folder" className="h-5 w-5" />
            {c.title}
          </button>
        ))}
      </aside>
      <div className="min-w-0 flex-1 overflow-y-auto p-5" data-testid={`skills-panel-${cat}`}>
        <MonoLabel>{active.title.toUpperCase()} — {active.blurb.toUpperCase()}</MonoLabel>
        <div className="mt-4 flex flex-wrap gap-2">
          {active.skills.map((s) => (
            <span key={s} className="rounded-full border border-[#A9CBE8] bg-white/85 px-3.5 py-1.5 text-[12.5px] font-medium text-[#33608A] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              {s}
            </span>
          ))}
        </div>
        <p className="mt-6 font-mono text-[8.5px] tracking-[0.22em] text-[#9FB9CE]">NO PERCENTAGES — PROFICIENCY IS EARNED, NOT DECLARED</p>
      </div>
    </div>
  );
}

export function SettingsApp() {
  const mgr = useWinMgr();
  const [motion, setMotion] = useState<'full' | 'reduced'>(
    document.documentElement.getAttribute('data-motion') === 'reduced' ? 'reduced' : 'full'
  );

  const applyMotion = (m: 'full' | 'reduced') => {
    setMotion(m);
    document.documentElement.setAttribute('data-motion', m);
  };

  return (
    <div className="p-6" data-testid="app-settings">
      <MonoLabel>SETTINGS</MonoLabel>
      <h2 className="mt-2 text-[19px] font-bold text-[#173A5E]">Appearance</h2>

      <div className="mt-6">
        <MonoLabel>DESKTOP MODE</MonoLabel>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <ModeCard
            active={!mgr.night}
            onClick={() => mgr.setNight(false)}
            testid="settings-day"
            icon={<Sun className="h-5 w-5" />}
            title="Day"
            note="Frutiger Aero — bright skies, glass and sunlight"
          />
          <ModeCard
            active={mgr.night}
            onClick={() => mgr.setNight(true)}
            testid="settings-night"
            icon={<Moon className="h-5 w-5" />}
            title="Night"
            note="Vista at night — moonlit glass, darker Aero"
          />
        </div>
      </div>

      <div className="mt-7">
        <MonoLabel>MOTION</MonoLabel>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <ModeCard
            active={motion === 'full'}
            onClick={() => applyMotion('full')}
            testid="settings-motion-full"
            icon={<Monitor className="h-5 w-5" />}
            title="Full motion"
            note="All animations enabled"
          />
          <ModeCard
            active={motion === 'reduced'}
            onClick={() => applyMotion('reduced')}
            testid="settings-motion-reduced"
            icon={<Monitor className="h-5 w-5 opacity-60" />}
            title="Reduced"
            note="Calmer transitions"
          />
        </div>
      </div>
    </div>
  );
}

function ModeCard({ active, onClick, testid, icon, title, note }: { active: boolean; onClick: () => void; testid: string; icon: React.ReactNode; title: string; note: string }) {
  return (
    <button
      data-testid={testid}
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-2xl border p-4 text-left transition-all active:scale-[0.98] ${
        active ? 'border-[#5FB8F2] bg-[#D6ECFC]/90 shadow-[0_8px_22px_rgba(30,100,170,0.2)]' : 'border-[#CFE3F4] bg-white/70 hover:border-[#9CC8E8]'
      }`}
    >
      <span className="flex items-center gap-2 text-[13.5px] font-bold text-[#173A5E]">
        {icon} {title}
      </span>
      <span className="mt-1 block text-[11.5px] leading-relaxed text-[#5B84A8]">{note}</span>
    </button>
  );
}

export function ComputerApp() {
  return <Explorer startNodeId="computer" />;
}
