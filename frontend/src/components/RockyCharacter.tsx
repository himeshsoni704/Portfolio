// ───────────────────────────────────────────────────────────
// ROCKY CHARACTER — a small stylized rock with subtle eyes.
// Pure SVG (also mirrored as a 3D mesh inside the hero scene).
// ───────────────────────────────────────────────────────────

export default function RockyCharacter({
  className = '',
  float = false,
}: {
  className?: string;
  float?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} ${float ? 'animate-float' : ''}`}
      role="img"
      aria-label="Rocky — a small glossy rock AI"
    >
      <defs>
        <radialGradient id="rockBody" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0%" stopColor="#E8F1FA" />
          <stop offset="45%" stopColor="#AFC4DB" />
          <stop offset="100%" stopColor="#5E7898" />
        </radialGradient>
        <linearGradient id="rockShine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      {/* soft ground shadow */}
      <ellipse cx="50" cy="90" rx="26" ry="5" fill="rgba(56,189,248,0.18)" />

      {/* rocky body — slightly irregular, glossy */}
      <path
        d="M50 16
           C 66 15, 82 27, 84 45
           C 86 62, 76 80, 55 84
           C 36 87, 18 76, 15 57
           C 12 38, 30 18, 50 16 Z"
        fill="url(#rockBody)"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1"
      />
      {/* top shine */}
      <path
        d="M32 30 C 40 22, 58 21, 68 28"
        fill="none"
        stroke="url(#rockShine)"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* eyes — subtle, glossy, blinking */}
      <g>
        <ellipse cx="40" cy="52" rx="6" ry="7.5" fill="#0B132B">
          <animate attributeName="ry" values="7.5;7.5;0.6;7.5" keyTimes="0;0.9;0.95;1" dur="4.5s" repeatCount="indefinite" />
        </ellipse>
        <circle cx="42" cy="49.5" r="1.8" fill="#E0F2FE">
          <animate attributeName="ry" values="1.8;1.8;0.2;1.8" keyTimes="0;0.9;0.95;1" dur="4.5s" repeatCount="indefinite" />
        </circle>
        <ellipse cx="61" cy="52" rx="6" ry="7.5" fill="#0B132B">
          <animate attributeName="ry" values="7.5;7.5;0.6;7.5" keyTimes="0;0.9;0.95;1" dur="4.5s" repeatCount="indefinite" />
        </ellipse>
        <circle cx="63" cy="49.5" r="1.8" fill="#E0F2FE">
          <animate attributeName="ry" values="1.8;1.8;0.2;1.8" keyTimes="0;0.9;0.95;1" dur="4.5s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );
}
