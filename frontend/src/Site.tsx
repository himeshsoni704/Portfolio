import { useState } from 'react';
import Hero from './sections/Hero';
import About from './sections/About';
import SpaceTransition from './sections/SpaceTransition';
import Projects from './sections/Projects';
import Research from './sections/Research';
import Experiments from './sections/Experiments';
import Photography from './sections/Photography';
import Journey from './sections/Journey';
import Contact from './sections/Contact';
import { AeroProvider } from './win/AeroWindow';
import SkillsDrawer from './win/SkillsDrawer';
import MediaPlayer from './win/MediaPlayer';
import RockyChat from './win/RockyChat';

export default function Site() {
  const [skillsOpen, setSkillsOpen] = useState(false);

  return (
    <AeroProvider>
      <main data-testid="portfolio-site">
        <Hero />
        <About />
        <SpaceTransition />
        <Projects />
        <Research />
        <Experiments />
        <Photography />
        <Journey onOpenSkills={() => setSkillsOpen(true)} />
        <Contact />
      </main>
      <SkillsDrawer open={skillsOpen} onClose={() => setSkillsOpen(false)} />
      <MediaPlayer />
      <RockyChat />
    </AeroProvider>
  );
}
