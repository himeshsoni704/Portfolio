import { type ReactNode } from 'react';

// Shared UI atoms — theme-aware (light portfolio + dark space sections).

export function MonoLabel({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={`font-mono text-[9.5px] tracking-[0.28em] ${dark ? 'text-[#7DD3FC]/80' : 'text-[#4E7BA3]'}`}>
      {children}
    </p>
  );
}

export function StatusBadge({ status, dark = false }: { status: string; dark?: boolean }) {
  const light: Record<string, string> = {
    PROJECT: 'border-[#8FB6D8] bg-[#E7F2FC] text-[#33608A]',
    PUBLIC: 'border-[#7CCFA5] bg-[#E4F7EE] text-[#1E7A4E]',
    PRIVATE: 'border-[#E4C36B] bg-[#FBF3DC] text-[#8A6410]',
    ONGOING: 'border-[#67C3EA] bg-[#E2F4FD] text-[#0E6D9C]',
    'ONGOING RESEARCH': 'border-[#67C3EA] bg-[#E2F4FD] text-[#0E6D9C]',
    EXPERIMENT: 'border-[#83CBB8] bg-[#E3F6F0] text-[#136B56]',
  };
  const darkStyles: Record<string, string> = {
    PROJECT: 'border-[#67C3EA]/40 bg-[#67C3EA]/10 text-[#9FDBFA]',
    PUBLIC: 'border-[#34D399]/40 bg-[#34D399]/10 text-[#6EE7B7]',
    PRIVATE: 'border-[#FBBF24]/40 bg-[#FBBF24]/10 text-[#FCD34D]',
    ONGOING: 'border-[#38BDF8]/50 bg-[#38BDF8]/15 text-[#7DD3FC]',
    'ONGOING RESEARCH': 'border-[#38BDF8]/50 bg-[#38BDF8]/15 text-[#7DD3FC]',
    EXPERIMENT: 'border-[#2DD4BF]/40 bg-[#2DD4BF]/10 text-[#5EEAD4]',
  };
  const map = dark ? darkStyles : light;
  const pulse = status.startsWith('ONGOING');
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[9px] tracking-[0.18em] ${map[status] ?? map.PROJECT}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full bg-current ${pulse ? 'animate-pulse' : ''}`} />
      {status.toUpperCase()}
    </span>
  );
}

export function Chip({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11.5px] font-medium ${
        dark
          ? 'border-[#7DD3FC]/25 bg-[#0E2A44]/70 text-[#9FDBFA]'
          : 'border-[#A9CBE8] bg-white/70 text-[#33608A] shadow-sm'
      }`}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  index,
  label,
  title,
  subtitle,
  dark = false,
}: {
  index: string;
  label: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-12 md:mb-16">
      <MonoLabel dark={dark}>
        {index} / {label}
      </MonoLabel>
      <h2
        className={`mt-4 text-4xl font-bold tracking-tight sm:text-5xl ${dark ? 'text-[#E8F4FF]' : 'text-[#122B45]'}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 max-w-xl text-[15px] leading-relaxed ${dark ? 'text-[#8FB4D4]' : 'text-[#4E7BA3]'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
