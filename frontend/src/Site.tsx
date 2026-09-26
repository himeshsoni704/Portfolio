import { useState } from 'react';
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

  return (
    <AeroProvider>
      <main data-testid="portfolio-site">
        <Hero />
        <About />
        <Projects />
        <Research />
        {!world2 && <TransitionSpacer onEnter={() => setWorld2(true)} />}
        <Contact />
      </main>
      {world2 && <World2 onExit={() => setWorld2(false)} />}
    </AeroProvider>
  );
}
