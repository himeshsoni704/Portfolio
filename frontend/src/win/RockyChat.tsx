import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, X } from 'lucide-react';
import RockyCharacter from '../components/RockyCharacter';

// @ts-ignore — custom element, no types
const SplineViewerEl = 'spline-viewer' as any;

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// 3D ROCKY SLOT — paste the Spline Rocky model URL here and it
// replaces the 2D character inside the chat header.
// e.g. const ROCKY_SPLINE_URL = 'https://prod.spline.design/XXX/scene.splinecode';
const ROCKY_SPLINE_URL = '';

const SUGGESTIONS = [
  'Who is Himesh?',
  'What is he researching?',
  'Tell me about his QKD project',
  'What has he built?',
  "What's Pixelator?",
  'What is currently ongoing?',
];

type Msg = { role: 'user' | 'rocky'; text: string; source?: 'llm' | 'demo' };

const GREETING: Msg = {
  role: 'rocky',
  text: "Amaze. You're looking around. I'm Rocky — I live on this site and I know a few things about Himesh. Ask me.",
  source: 'demo',
};

// ─────────────────────────────────────────────────────────────
// ROCKY AI — floating companion. Bottom-right button → Aero
// glass chat window. Never invents information about Himesh.
// ─────────────────────────────────────────────────────────────

export default function RockyChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const [wave, setWave] = useState(false);
  const sessionRef = useRef(`s-${Math.random().toString(36).slice(2)}-${Date.now()}`);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Local demo fallback — used when backend is offline
  const localDemo = (msg: string): string => {
    const m = msg.toLowerCase();
    if (/who is himesh|about himesh/.test(m)) return 'Himesh Soni. Third-year CS student at BITS Pilani Dubai Campus. He builds things he is curious about — AI, quantum, fintech, creative coding. Amaze.';
    if (/project|built|build/.test(m)) return 'Projects: RoadPulse, Defi Risk Checker, Indoor RF Simulator, Pixelator, TerminalAI, CogMap, ESP32 CSI Motion Radar, and more. Amaze.';
    if (/research|qkd|quantum/.test(m)) return 'Research: QKD + ML Eve detection, ML for scheduling, reliability-aware vision for diabetic retinopathy grading. All ongoing — no final conclusions yet. Honest science.';
    if (/pixelator|pixel/.test(m)) return 'An image pixelating app. Grid sampling or organic SLIC segmentation. It actually runs inside this portfolio — open the Experiments app.';
    if (/contact|email|reach|hire/.test(m)) return 'Email: himeshsoni704@gmail.com · GitHub: github.com/himeshsoni704 · LinkedIn: himesh-soni · Instagram @hx.cr3';
    if (/skill|language|stack/.test(m)) return 'Python, Java, C/C++, JS/TS, React, FastAPI. AI/ML, Computer Vision, Qiskit, DaVinci Resolve. Amaze.';
    if (/photo|camera|film/.test(m)) return 'He enjoys photography and filmmaking — involved with Reflexions Photography & Videography Club at BITS Dubai. NOT a videographer. His words.';
    if (/hello|hi|hey/.test(m)) return 'Amaze. Hello. I am Rocky. Ask me about Himesh — projects, research, or his random experiments.';
    if (/rock|are you/.test(m)) return 'Finally. Someone asks the important questions. Yes — a rock living inside a computer.';
    return 'I do not know this yet. Himesh has not told me.';
  };

  const send = useCallback(
    async (text: string) => {
      const msg = text.trim();
      if (!msg || typing) return;
      setMessages((m) => [...m, { role: 'user', text: msg }]);
      setInput('');
      setTyping(true);
      try {
        const res = await fetch(`${API}/rocky`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: msg, session_id: sessionRef.current }),
          signal: AbortSignal.timeout(4000),
        });
        const data = await res.json();
        setMessages((m) => [...m, { role: 'rocky', text: data.reply, source: data.source }]);
      } catch {
        // Backend offline — fall back to local demo replies
        const reply = localDemo(msg);
        setMessages((m) => [...m, { role: 'rocky', text: reply, source: 'demo' }]);
      } finally {
        setTyping(false);
      }
    },
    [typing]
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) {
      setWave(true);
      const t = setTimeout(() => setWave(false), 1600);
      return () => clearTimeout(t);
    }
  }, [open]);

  const [hoverLauncher, setHoverLauncher] = useState(false);

  return (
    <>
      {/* floating launcher */}
      <motion.button
        data-testid="rocky-chat-trigger"
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHoverLauncher(true)}
        onMouseLeave={() => setHoverLauncher(false)}
        aria-label="Open Rocky AI chat"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: open ? 0 : 1, scale: open ? 0.6 : 1, pointerEvents: open ? 'none' : 'auto' }}
        transition={{ delay: open ? 0 : 1.2, duration: 0.5 }}
        className="fixed bottom-[78px] right-5 z-[150] flex items-center gap-3 rounded-full border-2 border-white/70 py-2 pl-2.5 pr-5 shadow-[0_14px_40px_rgba(10,60,110,0.45)] transition-transform hover:scale-105 active:scale-95"
        style={{ background: 'linear-gradient(165deg, rgba(246,251,255,0.92), rgba(190,226,250,0.85))', backdropFilter: 'blur(16px)' }}
      >
        <motion.div
          animate={hoverLauncher ? { x: 0 } : { x: [0, 4, 0, -3, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <RockyCharacter
            className="h-10 w-10"
            mode={hoverLauncher ? 'wave' : 'walk'}
            facing={hoverLauncher ? 'center' : 'right'}
          />
        </motion.div>
        <span className="text-left">
          <span className="block text-[12px] font-bold tracking-wide text-[#173A5E]">Rocky AI</span>
          <span className="flex items-center gap-1.5 font-mono text-[8px] tracking-[0.2em] text-[#1E7A4E]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1E7A4E]" /> ONLINE
          </span>
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 26, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed z-[155] flex flex-col overflow-hidden rounded-2xl border border-white/60 shadow-[0_40px_90px_rgba(4,30,60,0.5)] ${
              mobile
                ? 'inset-x-3 bottom-[68px] h-[68vh]'
                : 'bottom-[78px] right-5 h-[560px] max-h-[74vh] w-[400px]'
            }`}
            style={{ background: 'linear-gradient(170deg, rgba(246,251,255,0.96), rgba(222,238,251,0.94))', backdropFilter: 'blur(24px)' }}
            role="dialog"
            aria-label="Rocky AI chat"
            data-testid="rocky-chat-window"
          >
            {/* title bar */}
            <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/60 bg-gradient-to-b from-[#D5ECFD]/95 to-[#ABD6F6]/85 px-3">
              <div className="flex items-center gap-2.5">
                <span className="block">
                  {ROCKY_SPLINE_URL ? (
                    <SplineViewerEl url={ROCKY_SPLINE_URL} className="block h-7 w-7" />
                  ) : (
                    <RockyCharacter className="h-8 w-8" mode={wave ? 'wave' : 'idle'} waving={wave} />
                  )}
                </span>
                <span className="text-[12.5px] font-semibold tracking-wide text-[#1A3A5C]">Rocky AI</span>
                <span className="flex items-center gap-1.5 rounded-full border border-[#7CCFA5] bg-[#E4F7EE] px-2 py-0.5 font-mono text-[8px] tracking-[0.18em] text-[#1E7A4E]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1E7A4E]" /> ONLINE
                </span>
              </div>
              <button
                data-testid="rocky-chat-close"
                onClick={() => setOpen(false)}
                aria-label="Close Rocky chat"
                className="grid h-7 w-8 place-items-center rounded-md border border-[#E8A9A0] bg-gradient-to-b from-[#F09588] to-[#D2554A] text-white shadow-sm transition-all hover:from-[#F8A89C] active:scale-95"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.5} />
              </button>
            </div>

            {/* messages */}
            <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4" data-testid="rocky-messages">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'items-end gap-2'}`}>
                  {m.role === 'rocky' && <RockyCharacter className="h-7 w-7 shrink-0" />}
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      m.role === 'user'
                        ? 'rounded-br-sm bg-gradient-to-b from-[#4FB6F5] to-[#1668B8] text-white shadow-sm'
                        : 'rounded-bl-sm border border-white/90 bg-white/85 text-[#25384C] shadow-sm'
                    }`}
                  >
                    {m.text.replace(/\*\*/g, '')}
                    {m.role === 'rocky' && m.source && (
                      <span className="mt-1 block font-mono text-[7.5px] tracking-[0.25em] text-[#9FB9CE]">
                        {m.source === 'llm' ? 'LIVE AI' : 'DEMO MODE'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex items-end gap-2">
                  <RockyCharacter className="h-7 w-7 shrink-0" />
                  <div className="rounded-2xl rounded-bl-sm border border-white/90 bg-white/85 px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((d) => (
                        <span key={d} className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#5FB8F2]" style={{ animationDelay: `${d * 0.2}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* suggestions */}
            {messages.length <= 1 && !typing && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-2" data-testid="rocky-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    data-testid={`rocky-chip-${s.slice(0, 14).toLowerCase().replace(/[^a-z]+/g, '-')}`}
                    onClick={() => send(s)}
                    className="rounded-full border border-[#A9CBE8] bg-white/75 px-3 py-1.5 text-[11px] font-medium text-[#33608A] transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* input */}
            <form
              className="flex items-center gap-2 border-t border-white/60 bg-white/40 p-3"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <input
                data-testid="rocky-chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Rocky something..."
                aria-label="Ask Rocky"
                className="flex-1 rounded-full border border-[#9CC8E8] bg-white/90 px-4 py-2.5 text-[13px] text-[#173A5E] shadow-inner outline-none placeholder:text-[#9FB9CE] focus:border-[#4FB6F5]"
              />
              <button
                type="submit"
                data-testid="rocky-chat-submit"
                aria-label="Send message to Rocky"
                disabled={typing || !input.trim()}
                className="gloss-btn grid h-10 w-10 shrink-0 place-items-center text-white disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <p className="pb-2.5 text-center font-mono text-[7.5px] tracking-[0.25em] text-[#9FB9CE]">
              ROCKY ONLY KNOWS WHAT HIMESH PUT IN HIS KNOWLEDGE BASE
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
