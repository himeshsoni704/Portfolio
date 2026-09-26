import Site from './Site';
import { Toaster } from './components/ui/sonner';

// The portfolio opens straight into the world — no boot, no login.
// The Vista boot + Win7 login belong to the computer (World 2).
export default function App() {
  return (
    <>
      <Site />
      <Toaster position="bottom-center" theme="light" />
    </>
  );
}