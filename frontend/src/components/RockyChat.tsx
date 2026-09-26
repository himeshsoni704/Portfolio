import { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, X } from 'lucide-react';
import { useRocky } from './RockyProvider';
import RockyCharacter from './RockyCharacter';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SUGGESTIONS = [
  'Who is Himesh?',
  'What has he built?',
  'Tell me about the quantum project',
  "What's Pixelator?",
  'Why does he like photography?',
  'What is he working on?',
];

type Msg = { role: 'user' | 'rocky'; text: string; source?: 'llm' | 'demo' };

const GREETING: Msg = {
  role: 'rocky',
  text: "AMAZE! You found my corner of the website. I'm Rocky — I know a few things about Himesh. Ask me.",
  source: 'demo',
};

export default function RockyChat() {
  const { open, setOpen, pending, clearPending } = useRocky();
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const sessionRef = useRef(`s-${Math.random().toString(36).slice(2)}-${Date.now()}`);
  const scrollRef = useRef<HTMLDivElement>(null);
  const greetedRef = useRef(false);

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
        });
        const data = await res.json();
        setMessages((m) => [...m, { role: 'rocky', text: data.reply, source: data.source }]);
      } catch {
        setMessages((m) => [
          ...m,
          { role: 'rocky', text: 'Signal lost for a second. Try again — Himesh will fix me.', source: 'demo' },
        ]);
      } finally {
        setTyping(false);
      }
    },
    [typing]
  );

  // send chip questions triggered from anywhere on the site
  useEffect(() => {
    if (open && pending) {
      const q = pending;
      clearPending();
      window.setTimeout(() => send(q), 250);
    }
  }, [open, pending, send, clearPending]);

  // greet once on first open
  useEffect(() => {
    if (open && !greetedRef.current) {
      greetedRef.current = true;
      if (messages.length === 1 && messages[0].text === GREETING.text) {
        // keep default greeting
      }
    }
  }, [open, messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="glass fixed bottom-4 right-4 z-[70] flex h-[540px] max-h-[76vh] w-[min(92vw,390px)] origin-bottom-right flex-col overflow-hidden !rounded-2xl md:bottom-6 md:right-6"
          data-testid="rocky-chat-window"
          role="dialog"
          aria-label="Rocky chat"
        >
          {/* title bar — aero communication window */}
          <div className="flex items-center justify-between border-b border-aero-ice/15 bg-gradient-to-b from-aero-sky/20 to-transparent px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-b from-white/80 to-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-aero-sky/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-aero-green/80" />
              </div>
              <span className="font-mono text-[11px] tracking-[0.25em] text-ice">ROCKY — ONLINE</span>
              <span className="relative flex h-2 w-2">
                <span className="absolute h-full w-full animate-ping rounded-full bg-aero-green opacity-60" />
                <span className="relative h-2 w-2 rounded-full bg-aero-green" />
              </span>
            </div>
            <button
              data-testid="rocky-chat-close"
              onClick={() => setOpen(false)}
              aria-label="Close Rocky chat"
              className="rounded-full p-1 text-mist transition-colors hover:bg-white/10 hover:text-ice"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* messages */}
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'items-end gap-2'}`}>
                {m.role === 'rocky' && <RockyCharacter className="h-7 w-7 shrink-0" />}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'rounded-br-sm bg-gradient-to-b from-aero-sky/50 to-aero-blue/50 text-ice'
                      : 'glass !rounded-2xl rounded-bl-sm !bg-space-800/80 text-ice/90'
                  }`}
                >
                  {m.text}
                  {m.role === 'rocky' && m.source && (
                    <span className="mt-1 block font-mono text-[8px] tracking-[0.25em] text-mist/70">
                      {m.source === 'llm' ? 'LIVE AI' : 'DEMO MODE'}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex items-end gap-2">
                <RockyCharacter className="h-7 w-7 shrink-0" />
                <div className="glass !rounded-2xl !bg-space-800/80 rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="h-1.5 w-1.5 rounded-full bg-aero-ice"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* suggestions */}
          {messages.length <= 1 && !typing && (
            <div className="flex flex-wrap gap-2 px-4 pb-3">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  data-testid={`rocky-chip-${s.slice(0, 12).toLowerCase().replace(/[^a-z]+/g, '-')}`}
                  onClick={() => send(s)}
                  className="rounded-full border border-aero-ice/25 bg-aero-sky/5 px-3 py-1.5 text-[11px] text-silver transition-all hover:border-aero-ice/60 hover:text-ice"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* input */}
          <form
            className="flex items-center gap-2 border-t border-aero-ice/15 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              data-testid="rocky-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Rocky about Himesh…"
              aria-label="Ask Rocky"
              className="flex-1 rounded-full border border-aero-ice/20 bg-space-800/60 px-4 py-2.5 text-sm text-ice placeholder:text-mist/60 focus:border-aero-sky/60 focus:outline-none"
            />
            <button
              type="submit"
              data-testid="rocky-chat-submit"
              aria-label="Send message"
              disabled={typing || !input.trim()}
              className="gloss-btn flex h-10 w-10 items-center justify-center text-ice disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
