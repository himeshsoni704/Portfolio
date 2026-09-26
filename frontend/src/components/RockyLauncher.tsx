import { motion } from 'framer-motion';
import { useRocky } from './RockyProvider';
import RockyCharacter from './RockyCharacter';

export default function RockyLauncher() {
  const { open, setOpen } = useRocky();
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={open ? { opacity: 0, y: 30, pointerEvents: 'none' } : { opacity: 1, y: 0, pointerEvents: 'auto' }}
      transition={{ delay: open ? 0 : 1.4, duration: 0.6 }}
      data-testid="rocky-chat-trigger"
      onClick={() => setOpen(true)}
      aria-label="Open Rocky chat"
      className="gloss-btn fixed bottom-5 right-5 z-[60] flex items-center gap-3 py-2.5 pl-3 pr-5 md:bottom-6 md:right-6"
    >
      <RockyCharacter className="h-10 w-10 transition-transform duration-300 hover:rotate-6" />
      <span className="flex flex-col items-start">
        <span className="font-mono text-[10px] tracking-[0.25em] text-ice">ROCKY</span>
        <span className="flex items-center gap-1.5 font-mono text-[8px] tracking-[0.2em] text-aero-green">
          <span className="h-1.5 w-1.5 rounded-full bg-aero-green" />
          ONLINE
        </span>
      </span>
    </motion.button>
  );
}
