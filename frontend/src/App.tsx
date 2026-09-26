import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import BootScreen, { LoginScreen } from './BootLogin';
import Site from './Site';

type Phase = 'boot' | 'login' | 'site';

export default function App() {
  const [phase, setPhase] = useState<Phase>('boot');

  return (
    <>
      <AnimatePresence mode="wait">
        {phase === 'boot' && <BootScreen key="boot" onDone={() => setPhase('login')} />}
        {phase === 'login' && <LoginScreen key="login" onEnter={() => setPhase('site')} />}
        {phase === 'site' && <Site key="site" />}
      </AnimatePresence>
      <Toaster position="bottom-center" theme="light" />
    </>
  );
}
