// ─────────────────────────────────────────────────────────────
// HIMESHOS SYSTEM SOUNDS — original Vista-style chimes,
// synthesized live with Web Audio (no copyrighted assets).
// Persisted mute toggle: localStorage 'himeshos-sound'.
// ─────────────────────────────────────────────────────────────

let ctx: AudioContext | null = null;

export function isSoundOn(): boolean {
  try {
    return localStorage.getItem('himeshos-sound') !== 'off';
  } catch {
    return true;
  }
}

export function setSoundOn(on: boolean): void {
  try {
    localStorage.setItem('himeshos-sound', on ? 'on' : 'off');
  } catch {
    /* private mode — ignore */
  }
  window.dispatchEvent(new Event('himeshos-sound-change'));
}

function ac(): AudioContext | null {
  if (!isSoundOn()) return null;
  try {
    if (!ctx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new Ctor();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(c: AudioContext, freq: number, t0: number, dur: number, vol: number, type: OscillatorType = 'sine') {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

// startup — glassy rising chime (original composition)
export function playStartup(): void {
  const c = ac();
  if (!c) return;
  const t = c.currentTime + 0.05;
  tone(c, 233.08, t, 2.2, 0.05, 'triangle'); // B♭3
  tone(c, 349.23, t + 0.16, 2.2, 0.058, 'sine'); // F4
  tone(c, 466.16, t + 0.32, 2.4, 0.066, 'sine'); // B♭4
  tone(c, 698.46, t + 0.5, 2.6, 0.072, 'sine'); // F5
  tone(c, 1396.9, t + 0.5, 1.4, 0.018, 'triangle'); // sparkle
}

// logout — descending settle
export function playLogout(): void {
  const c = ac();
  if (!c) return;
  const t = c.currentTime + 0.05;
  tone(c, 698.46, t, 1.4, 0.068, 'sine');
  tone(c, 466.16, t + 0.24, 1.5, 0.062, 'sine');
  tone(c, 349.23, t + 0.48, 1.8, 0.058, 'triangle');
  tone(c, 233.08, t + 0.66, 2.2, 0.05, 'sine');
}