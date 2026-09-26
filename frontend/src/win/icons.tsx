// Original glossy icon set — Aero-inspired, nothing copied.
export type IconKey =
  | 'intro'
  | 'folder'
  | 'research'
  | 'experiments'
  | 'photography'
  | 'about'
  | 'rocky'
  | 'media'
  | 'file'
  | 'viewer'
  | 'bottle'
  | 'pixelator'
  | 'calendar';

export function AppIcon({ name, className = 'h-12 w-12' }: { name: IconKey; className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`t-${name}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EAF6FF" />
          <stop offset="55%" stopColor="#BFE3FB" />
          <stop offset="100%" stopColor="#7CC4EF" />
        </linearGradient>
        <linearGradient id={`b-${name}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4FB6F5" />
          <stop offset="100%" stopColor="#1668B8" />
        </linearGradient>
        <linearGradient id={`s-${name}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <radialGradient id={`o-${name}`} cx="0.35" cy="0.3" r="1">
          <stop offset="0%" stopColor="#FFD9A8" />
          <stop offset="55%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </radialGradient>
        <radialGradient id={`r-${name}`} cx="0.35" cy="0.3" r="1">
          <stop offset="0%" stopColor="#EDF4FB" />
          <stop offset="55%" stopColor="#B9CBDD" />
          <stop offset="100%" stopColor="#6C86A3" />
        </radialGradient>
      </defs>

      {name === 'folder' && (
        <g>
          <path d="M14 30 C14 26 17 23 21 23 L38 23 L45 31 L75 31 C79 31 82 34 82 38 L82 70 C82 74 79 77 75 77 L21 77 C17 77 14 74 14 70 Z" fill={`url(#b-${name})`} stroke="rgba(255,255,255,0.85)" strokeWidth="2" />
          <path d="M14 40 L82 40 L82 70 C82 74 79 77 75 77 L21 77 C17 77 14 74 14 70 Z" fill="#5FB8F2" opacity="0.55" />
          <path d="M14 30 C14 26 17 23 21 23 L38 23 L45 31 L75 31 C79 31 82 34 82 38 L82 44 L14 44 Z" fill={`url(#s-${name})`} opacity="0.35" />
        </g>
      )}
      {name === 'research' && (
        <g>
          <path d="M40 18 L56 18 L56 40 L70 66 C73 72 69 78 62 78 L34 78 C27 78 23 72 26 66 L40 40 Z" fill={`url(#t-${name})`} stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
          <path d="M33 58 L63 58 L70 68 C72 73 68 76 63 76 L33 76 C28 76 24 73 26 68 Z" fill={`url(#b-${name})`} opacity="0.85" />
          <rect x="38" y="16" width="20" height="5" rx="2.5" fill={`url(#b-${name})`} />
        </g>
      )}
      {name === 'experiments' && (
        <g>
          <circle cx="36" cy="58" r="20" fill={`url(#t-${name})`} stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
          <circle cx="64" cy="38" r="13" fill={`url(#t-${name})`} stroke="rgba(255,255,255,0.85)" strokeWidth="2" />
          <circle cx="31" cy="50" r="6" fill={`url(#s-${name})`} opacity="0.9" />
          <circle cx="68" cy="66" r="8" fill={`url(#b-${name})`} opacity="0.85" />
        </g>
      )}
      {name === 'photography' && (
        <g>
          <rect x="14" y="30" width="68" height="44" rx="10" fill="#2B3E52" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
          <path d="M36 30 L40 22 L56 22 L60 30 Z" fill="#3E5470" />
          <circle cx="48" cy="52" r="16" fill={`url(#b-${name})`} stroke="rgba(255,255,255,0.8)" strokeWidth="3" />
          <circle cx="42" cy="46" r="4.5" fill={`url(#s-${name})`} opacity="0.9" />
        </g>
      )}
      {name === 'about' && (
        <g>
          <rect x="18" y="20" width="60" height="56" rx="8" fill={`url(#t-${name})`} stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
          <circle cx="38" cy="40" r="9" fill={`url(#b-${name})`} />
          <path d="M26 60 C28 52 33 49 38 49 C43 49 48 52 50 60 Z" fill={`url(#b-${name})`} />
          <rect x="54" y="36" width="18" height="4" rx="2" fill="#2E76B8" opacity="0.75" />
          <rect x="54" y="44" width="18" height="4" rx="2" fill="#2E76B8" opacity="0.55" />
        </g>
      )}
      {name === 'rocky' && (
        <g>
          <path d="M48 16 C 64 15, 80 27, 82 45 C 84 62, 74 80, 53 84 C 34 87, 16 76, 13 57 C 10 38, 28 17, 48 16 Z" fill={`url(#r-${name})`} stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
          <path d="M30 30 C 38 22, 56 21, 66 28" fill="none" stroke={`url(#s-${name})`} strokeWidth="6" strokeLinecap="round" opacity="0.9" />
          <ellipse cx="39" cy="52" rx="6" ry="7.5" fill="#0B132B" />
          <circle cx="41" cy="49.5" r="1.9" fill="#E0F2FE" />
          <ellipse cx="60" cy="52" rx="6" ry="7.5" fill="#0B132B" />
          <circle cx="62" cy="49.5" r="1.9" fill="#E0F2FE" />
        </g>
      )}
      {name === 'media' && (
        <g>
          <circle cx="48" cy="48" r="30" fill={`url(#o-${name})`} stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" />
          <path d="M22 38 A 30 30 0 0 1 74 38 A 34 22 0 0 0 22 38" fill={`url(#s-${name})`} opacity="0.7" />
          <path d="M41 34 L64 48 L41 62 Z" fill="#FFFFFF" />
        </g>
      )}
      {name === 'file' && (
        <g>
          <path d="M26 16 L58 16 L72 30 L72 80 L26 80 Z" fill={`url(#t-${name})`} stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
          <path d="M58 16 L58 30 L72 30 Z" fill="#8FCBF3" />
          <rect x="33" y="40" width="32" height="4" rx="2" fill="#2E76B8" opacity="0.7" />
          <rect x="33" y="50" width="32" height="4" rx="2" fill="#2E76B8" opacity="0.5" />
        </g>
      )}
      {name === 'viewer' && (
        <g>
          <rect x="14" y="24" width="68" height="48" rx="8" fill={`url(#t-${name})`} stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
          <circle cx="36" cy="42" r="7" fill={`url(#o-${name})`} />
          <path d="M20 66 L40 50 L52 60 L64 46 L78 62 L78 66 C78 69 76 70 74 70 L22 70 C20 70 18 69 20 66 Z" fill={`url(#b-${name})`} opacity="0.8" />
        </g>
      )}
      {name === 'bottle' && (
        <g>
          <rect x="36" y="22" width="24" height="8" rx="4" fill="#9FB6C9" />
          <path d="M34 32 L62 32 L62 74 C62 80 56 84 48 84 C40 84 34 80 34 74 Z" fill={`url(#t-${name})`} stroke="rgba(255,255,255,0.9)" strokeWidth="2" opacity="0.92" />
          <path d="M36 54 L60 54 L60 74 C60 79 55 82 48 82 C41 82 36 79 36 74 Z" fill={`url(#b-${name})`} opacity="0.75" />
        </g>
      )}
      {name === 'pixelator' && (
        <g>
          <rect x="14" y="24" width="68" height="48" rx="8" fill={`url(#t-${name})`} stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3, 4].map((c) => (
              <rect key={`${r}-${c}`} x={24 + c * 11} y={34 + r * 8} width="9" height="6" rx="1.5" fill={(r + c) % 3 === 0 ? '#2E9BE8' : (r + c) % 3 === 1 ? '#7DD3FC' : '#34D399'} opacity="0.85" />
            ))
          )}
        </g>
      )}
      {name === 'calendar' && (
        <g>
          <rect x="18" y="24" width="60" height="54" rx="8" fill={`url(#t-${name})`} stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
          <rect x="18" y="24" width="60" height="16" rx="8" fill={`url(#b-${name})`} />
          <rect x="30" y="16" width="5" height="14" rx="2.5" fill="#2E76B8" />
          <rect x="61" y="16" width="5" height="14" rx="2.5" fill="#2E76B8" />
          <circle cx="38" cy="56" r="5" fill="#2E76B8" opacity="0.8" />
          <circle cx="52" cy="56" r="5" fill="#7DD3FC" opacity="0.9" />
        </g>
      )}
      {name === 'intro' && (
        <g>
          <rect x="10" y="10" width="76" height="76" rx="16" fill={`url(#t-${name})`} stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
          <circle cx="48" cy="38" r="13" fill={`url(#b-${name})`} />
          <path d="M24 78 C 26 62, 38 56, 48 56 C 58 56, 70 62, 72 78 Z" fill={`url(#b-${name})`} />
        </g>
      )}
    </svg>
  );
}
