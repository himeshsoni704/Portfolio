import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Intro from '../components/Intro';
import FeaturedWork from '../components/FeaturedWork';
import Experiments from '../components/Experiments';
import RockySection from '../components/RockySection';
import CreativeSection from '../components/CreativeSection';
import CurrentlyBuilding from '../components/CurrentlyBuilding';
import Skills from '../components/Skills';
import About from '../components/About';
import Contact from '../components/Contact';
import { prefersReducedMotion } from '../lib/lenis';

export default function Home() {
  const reduced = prefersReducedMotion();
  return (
    <motion.main
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <Marquee />
      <Intro />
      <FeaturedWork />
      <Experiments />
      <RockySection />
      <CreativeSection />
      <CurrentlyBuilding />
      <Skills />
      <About />
      <Contact />
    </motion.main>
  );
}
