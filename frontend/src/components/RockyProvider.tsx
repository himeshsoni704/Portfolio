import { createContext, useContext, useState, type ReactNode } from 'react';

type RockyContextType = {
  open: boolean;
  setOpen: (b: boolean) => void;
  pending: string | null;
  clearPending: () => void;
  ask: (q: string) => void;
};

const RockyContext = createContext<RockyContextType>({
  open: false,
  setOpen: () => {},
  pending: null,
  clearPending: () => {},
  ask: () => {},
});

export const useRocky = () => useContext(RockyContext);

export default function RockyProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<string | null>(null);

  const ask = (q: string) => {
    setPending(q);
    setOpen(true);
  };

  return (
    <RockyContext.Provider value={{ open, setOpen, pending, clearPending: () => setPending(null), ask }}>
      {children}
    </RockyContext.Provider>
  );
}
