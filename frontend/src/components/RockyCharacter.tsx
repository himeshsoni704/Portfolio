import { useId } from 'react';

// ───────────────────────────────────────────────────────────
// ROCKY CHARACTER — Rigged & Animated
// Features articulated moving hands, walking legs, bobbing body,
// and interactive wave on hover.
// ───────────────────────────────────────────────────────────

export default function RockyCharacter({
  className = '',
  float = false,
  mode = 'walk',
  facing = 'center',
  waving = false,
  interactive = true,
}: {
  className?: string;
  float?: boolean;
  mode?: 'walk' | 'wave' | 'idle';
  facing?: 'left' | 'right' | 'center';
  waving?: boolean;
  interactive?: boolean;
}) {
  const uid = useId().replace(/:/g, '');
  const isWave = waving || mode === 'wave';
  const isWalk = mode === 'walk' && !isWave;

  // Horizontal flip for directional walking
  const flipStyle =
    facing === 'right'
      ? { transform: 'scaleX(-1)', transformOrigin: '50px 50px' }
      : facing === 'left'
      ? { transform: 'scaleX(1)', transformOrigin: '50px 50px' }
      : undefined;

  return (
    <svg
      viewBox="0 0 100 102"
      className={`rocky-rigged-character ${className} ${float ? 'animate-float' : ''} ${
        interactive ? 'cursor-pointer' : ''
      }`}
      role="img"
      aria-label="Rocky — a rigged animated rock AI"
      style={flipStyle}
    >
      <defs>
        <radialGradient id={`rockBody-${uid}`} cx="0.36" cy="0.28" r="0.85">
          <stop offset="0%" stopColor="#F5FAFF" />
          <stop offset="38%" stopColor="#CFE2F5" />
          <stop offset="76%" stopColor="#87A5C7" />
          <stop offset="100%" stopColor="#4A6582" />
        </radialGradient>
        <radialGradient id={`rockLimb-${uid}`} cx="0.38" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#EBF4FD" />
          <stop offset="50%" stopColor="#A8C7E4" />
          <stop offset="100%" stopColor="#587595" />
        </radialGradient>
        <radialGradient id={`rockFoot-${uid}`} cx="0.4" cy="0.28" r="0.75">
          <stop offset="0%" stopColor="#E2F0FD" />
          <stop offset="55%" stopColor="#96BBDC" />
          <stop offset="100%" stopColor="#4B6888" />
        </radialGradient>
        <linearGradient id={`rockShine-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.92)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        <style>{`
          /* Rigged Limb Joints & Walk Cycle Keyframes */
          @keyframes rockyWalkLegL-${uid} {
            0% { transform: rotate(-22deg); }
            25% { transform: rotate(-4deg) translateY(-3.5px); }
            50% { transform: rotate(20deg); }
            75% { transform: rotate(2deg) translateY(-1px); }
            100% { transform: rotate(-22deg); }
          }
          @keyframes rockyWalkLegR-${uid} {
            0% { transform: rotate(20deg); }
            25% { transform: rotate(2deg) translateY(-1px); }
            50% { transform: rotate(-22deg); }
            75% { transform: rotate(-4deg) translateY(-3.5px); }
            100% { transform: rotate(20deg); }
          }
          @keyframes rockyWalkArmL-${uid} {
            0% { transform: rotate(24deg); }
            25% { transform: rotate(8deg); }
            50% { transform: rotate(-22deg); }
            75% { transform: rotate(-6deg); }
            100% { transform: rotate(24deg); }
          }
          @keyframes rockyWalkArmR-${uid} {
            0% { transform: rotate(-24deg); }
            25% { transform: rotate(-8deg); }
            50% { transform: rotate(22deg); }
            75% { transform: rotate(6deg); }
            100% { transform: rotate(-24deg); }
          }
          @keyframes rockyWaveArm-${uid} {
            0% { transform: rotate(-65deg); }
            50% { transform: rotate(-35deg); }
            100% { transform: rotate(-65deg); }
          }
          @keyframes rockyBodyBob-${uid} {
            0% { transform: translateY(0px) rotate(-1.5deg); }
            25% { transform: translateY(-3px) rotate(0deg); }
            50% { transform: translateY(0px) rotate(1.5deg); }
            75% { transform: translateY(-3px) rotate(0deg); }
            100% { transform: translateY(0px) rotate(-1.5deg); }
          }
          @keyframes rockyIdleBob-${uid} {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-2px); }
          }
          @keyframes rockyIdleArmL-${uid} {
            0%, 100% { transform: rotate(3deg); }
            50% { transform: rotate(-5deg); }
          }
          @keyframes rockyIdleArmR-${uid} {
            0%, 100% { transform: rotate(-3deg); }
            50% { transform: rotate(5deg); }
          }
          @keyframes rockyShadowPulse-${uid} {
            0%, 50%, 100% { transform: scale(1); opacity: 0.22; }
            25%, 75% { transform: scale(0.92, 0.85); opacity: 0.16; }
          }
          @keyframes rockyEyeBlink-${uid} {
            0%, 90%, 100% { transform: scaleY(1); }
            95% { transform: scaleY(0.12); }
          }

          /* Rigged Limb Classes */
          .leg-l-${uid} {
            transform-origin: 38px 77px;
            animation: ${isWalk ? `rockyWalkLegL-${uid} 0.72s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite` : 'none'};
          }
          .leg-r-${uid} {
            transform-origin: 62px 77px;
            animation: ${isWalk ? `rockyWalkLegR-${uid} 0.72s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite` : 'none'};
          }
          .arm-l-${uid} {
            transform-origin: 24px 50px;
            animation: ${
              isWalk
                ? `rockyWalkArmL-${uid} 0.72s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite`
                : `rockyIdleArmL-${uid} 2.4s ease-in-out infinite`
            };
          }
          .arm-r-${uid} {
            transform-origin: 74px 50px;
            animation: ${
              isWave
                ? `rockyWaveArm-${uid} 0.55s ease-in-out infinite`
                : isWalk
                ? `rockyWalkArmR-${uid} 0.72s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite`
                : `rockyIdleArmR-${uid} 2.4s ease-in-out infinite`
            };
          }
          .torso-${uid} {
            transform-origin: 50px 80px;
            animation: ${
              isWalk
                ? `rockyBodyBob-${uid} 0.72s ease-in-out infinite`
                : `rockyIdleBob-${uid} 2.4s ease-in-out infinite`
            };
          }
          .shadow-${uid} {
            transform-origin: 50px 96px;
            animation: ${isWalk ? `rockyShadowPulse-${uid} 0.72s ease-in-out infinite` : 'none'};
          }
          .eyes-${uid} {
            transform-origin: 50px 52px;
            animation: rockyEyeBlink-${uid} 4s ease-in-out infinite;
          }

          /* Interactive Wave on Hover */
          ${
            interactive
              ? `
            .rocky-rigged-character:hover .arm-r-${uid} {
              animation: rockyWaveArm-${uid} 0.45s ease-in-out infinite !important;
            }
          `
              : ''
          }
        `}</style>
      </defs>

      {/* Ground Shadow */}
      <ellipse
        cx="50"
        cy="96"
        rx="28"
        ry="4.5"
        fill="rgba(56,189,248,0.24)"
        className={`shadow-${uid}`}
      />

      {/* Left Leg & Foot */}
      <g className={`leg-l-${uid}`}>
        <path
          d="M 35 77 C 34 82, 34 86, 34 89 C 34 91, 41 91, 41 89 C 41 86, 40 82, 40 77 Z"
          fill={`url(#rockLimb-${uid})`}
        />
        <path
          d="M 27 89 C 26 86, 42 86, 44 89 C 45 92.5, 42 95, 35 95 C 28 95, 26 92.5, 27 89 Z"
          fill={`url(#rockFoot-${uid})`}
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="0.8"
        />
        <path
          d="M 30 88 C 33 87, 39 87, 41 88"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Right Leg & Foot */}
      <g className={`leg-r-${uid}`}>
        <path
          d="M 60 77 C 59 82, 59 86, 59 89 C 59 91, 66 91, 66 89 C 66 86, 65 82, 65 77 Z"
          fill={`url(#rockLimb-${uid})`}
        />
        <path
          d="M 56 89 C 55 86, 71 86, 73 89 C 74 92.5, 71 95, 64 95 C 57 95, 55 92.5, 56 89 Z"
          fill={`url(#rockFoot-${uid})`}
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="0.8"
        />
        <path
          d="M 59 88 C 62 87, 68 87, 70 88"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Left Arm & Hand */}
      <g className={`arm-l-${uid}`}>
        <path
          d="M 24 50 C 18 54, 13 60, 11 67 C 10 70, 14 71.5, 16 68.5 C 18 64, 22 58, 26 53 Z"
          fill={`url(#rockLimb-${uid})`}
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="0.8"
        />
        {/* Palm & Fingers */}
        <circle
          cx="12"
          cy="69"
          r="4.8"
          fill={`url(#rockFoot-${uid})`}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="0.8"
        />
        {/* Thumb */}
        <circle cx="16" cy="67.5" r="2.2" fill={`url(#rockFoot-${uid})`} />
        {/* Hand Shine */}
        <path
          d="M 10 67 C 11 65, 14 65, 15 66"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Rock Torso, Eyes & Head */}
      <g className={`torso-${uid}`}>
        {/* Rocky Body */}
        <path
          d="M50 16
             C 66 15, 82 27, 84 45
             C 86 62, 76 80, 55 84
             C 36 87, 18 76, 15 57
             C 12 38, 30 18, 50 16 Z"
          fill={`url(#rockBody-${uid})`}
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1.2"
        />

        {/* Glossy Top Shine */}
        <path
          d="M32 28 C 40 20, 58 19, 68 26"
          fill="none"
          stroke={`url(#rockShine-${uid})`}
          strokeWidth="4.8"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Eyes Group (with blink) */}
        <g className={`eyes-${uid}`}>
          {/* Left Eye */}
          <ellipse cx="40" cy="52" rx="6" ry="7.5" fill="#0B132B" />
          <circle cx="42" cy="49.5" r="2" fill="#E0F2FE" />
          <circle cx="39" cy="54" r="0.9" fill="#E0F2FE" opacity="0.75" />

          {/* Right Eye */}
          <ellipse cx="61" cy="52" rx="6" ry="7.5" fill="#0B132B" />
          <circle cx="63" cy="49.5" r="2" fill="#E0F2FE" />
          <circle cx="60" cy="54" r="0.9" fill="#E0F2FE" opacity="0.75" />
        </g>

        {/* Cute Smirk / Smile */}
        <path
          d="M 47 63.5 Q 50 66 54 63.5"
          fill="none"
          stroke="#2A4365"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.65"
        />
      </g>

      {/* Right Arm & Hand */}
      <g className={`arm-r-${uid}`}>
        <path
          d="M 75 50 C 81 54, 86 60, 88 67 C 89 70, 85 71.5, 83 68.5 C 81 64, 77 58, 73 53 Z"
          fill={`url(#rockLimb-${uid})`}
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="0.8"
        />
        {/* Palm & Fingers */}
        <circle
          cx="87"
          cy="69"
          r="4.8"
          fill={`url(#rockFoot-${uid})`}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="0.8"
        />
        {/* Thumb */}
        <circle cx="83" cy="67.5" r="2.2" fill={`url(#rockFoot-${uid})`} />
        {/* Hand Shine */}
        <path
          d="M 85 66 C 86 65, 89 65, 90 67"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
