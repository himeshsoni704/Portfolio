import { useRef, useState } from 'react';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Research from './sections/Research';
import TransitionSpacer from './sections/TransitionSpacer';
import Contact from './sections/Contact';
import World2 from './world/World2';
import { AeroProvider } from './win/AeroWindow';

export default function Site() {
  const [world2, setWorld2] = useState(false);
  // Set when the user exits World 2, so the remounted doorway stays blocked
  // until they scroll back above it — exiting must not re-trigger the entry.
  const exitedRef = useRef(false);

  const exitWorld2 = () => {
    exitedRef.current = true;
    setWorld2(false);
  };

  return (
    <AeroProvider>
      <main data-testid="portfolio-site">
        <Hero />
        <About />
        <Projects />
        <Research />
        {!world2 && <TransitionSpacer onEnter={() => setWorld2(true)} blockedInitially={exitedRef.current} />}
        <Contact />
      </main>
      {world2 && <World2 onExit={exitWorld2} />}
    </AeroProvider>
  );
}
