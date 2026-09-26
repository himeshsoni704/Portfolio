import { useRef, useState } from 'react';
import Hero from './sections/Hero';
import Interests from './sections/Interests';
import Exploring from './sections/Exploring';
import SpaceTransition from './sections/SpaceTransition';
import World2 from './world/World2';
import RockyChat from './win/RockyChat';

// ─────────────────────────────────────────────────────────────
// WORLD 1 — a personal, explorable world (not a résumé page).
// Intro → What I'm into → What I'm exploring → Rocky flies you
// through space → the computer boots (World 2). Rocky AI is
// available the whole way — ask any questions about Himesh.
// ─────────────────────────────────────────────────────────────

export default function Site() {
  const [world2, setWorld2] = useState(false);
  // Set when the user exits World 2, so the re-mounted space act stays
  // blocked until they scroll back above it — exiting must not re-enter.
  const exitedRef = useRef(false);

  const exitWorld2 = () => {
    exitedRef.current = true;
    setWorld2(false);
  };

  return (
    <>
      <main data-testid="portfolio-site">
        <Hero />
        <Interests />
        <Exploring />
        {!world2 && (
          <SpaceTransition onEnterComputer={() => setWorld2(true)} blockedInitially={exitedRef.current} />
        )}
      </main>
      {!world2 && <RockyChat />}
      {world2 && <World2 onExit={exitWorld2} />}
    </>
  );
}