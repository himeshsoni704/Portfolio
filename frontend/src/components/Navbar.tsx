import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { scrollToId } from '../lib/lenis';

const LINKS = [
  { id: 'work', label: 'WORK' },
  { id: 'lab', label: 'EXPERIMENTS' },
  { id: 'creative', label: 'CREATIVE' },
  { id: 'about', label: 'ABOUT' },
];

function LogoMark() {
  return (
    <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden="true">
      <defs>
        <linearGradient id="navg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#38BDF8" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#0B132B" stroke="url(#navg)" strokeWidth="2.5" />
      <ellipse cx="32" cy="32" rx="21" ry="8.5" fill="none" stroke="#7DD3FC" strokeWidth="2" transform="rotate(-22 32 32)" opacity="0.9" />
      <circle cx="32" cy="32" r="7" fill="url(#navg)" />
      <circle cx="48" cy="19" r="2.6" fill="#7DD3FC" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goId = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      window.setTimeout(() => scrollToId(id), 500);
    } else {
      scrollToId(id);
    }
  };

  const goHome = () => {
    if (location.pathname !== '/') navigate('/');
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-500 md:px-8 ${
          scrolled ? 'glass mx-3 !rounded-2xl py-2 md:mx-6' : 'bg-transparent py-3'
        }`}
      >
        <button data-testid="nav-brand-logo" onClick={goHome} className="flex items-center gap-3" aria-label="Himesh Soni — home">
          <LogoMark />
          <span className="font-display text-lg font-bold tracking-[0.18em] text-ice">HIMESH</span>
        </button>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <button
              key={l.id}
              data-testid={`nav-link-${l.id}`}
              onClick={() => goId(l.id)}
              className="group relative font-mono text-[11px] tracking-[0.22em] text-silver transition-colors hover:text-ice"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-aero-sky transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
          <button
            data-testid="nav-link-rocky"
            onClick={() => goId('rocky')}
            className="gloss-btn px-4 py-1.5 font-mono text-[11px] tracking-[0.22em] text-ice"
          >
            ROCKY
          </button>
        </nav>

        <button
          className="text-ice md:hidden"
          data-testid="nav-mobile-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass mx-4 mt-2 flex flex-col gap-1 p-4 md:hidden"
        >
          {LINKS.map((l) => (
            <button
              key={l.id}
              data-testid={`nav-mobile-${l.id}`}
              onClick={() => {
                setMenuOpen(false);
                goId(l.id);
              }}
              className="rounded-xl px-4 py-3 text-left font-mono text-sm tracking-[0.2em] text-ice hover:bg-aero-sky/10"
            >
              {l.label}
            </button>
          ))}
          <button
            data-testid="nav-mobile-rocky"
            onClick={() => {
              setMenuOpen(false);
              goId('rocky');
            }}
            className="gloss-btn mx-2 mt-2 px-4 py-3 font-mono text-sm tracking-[0.2em] text-ice"
          >
            ROCKY
          </button>
        </motion.div>
      )}
    </header>
  );
}
