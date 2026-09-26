import { useRef, useState } from 'react';

// ─────────────────────────────────────────────────────────────
// PIXELATOR — Himesh's real image pixelating application.
// UI ported from his original project; processing runs on the
// portfolio backend (/api/pixelate) with his exact logic:
// grid sampling + SLIC segmentation, palette extraction via
// SLIC shapes + KMeans.
// ─────────────────────────────────────────────────────────────

const PRESETS: Array<{ id: string; label: string; colors: string[] }> = [
  { id: 'cyber', label: 'CYBERPUNK', colors: ['#ff0055', '#00ff9f', '#00b8ff', '#f2ea02', '#ff00ff', '#7000ff', '#0012ff', '#ffffff', '#ff6a00', '#00ffd5', '#d400ff', '#ff0099', '#00aaff', '#ffaa00', '#ff33cc', '#33ff00'] },
  { id: 'gb', label: 'GAMEBOY', colors: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f', '#0f380f', '#306230', '#8bac0f', '#9bbc0f', '#0f380f', '#306230', '#8bac0f', '#9bbc0f', '#0f380f', '#306230', '#8bac0f', '#9bbc0f'] },
  { id: 'mono', label: 'MONO', colors: ['#000000', '#111111', '#222222', '#333333', '#444444', '#555555', '#666666', '#777777', '#888888', '#999999', '#aaaaaa', '#bbbbbb', '#cccccc', '#dddddd', '#eeeeee', '#ffffff'] },
  { id: 'neon', label: 'NEON', colors: ['#ff00ff', '#00ffff', '#ff6600', '#00ff66', '#ff0066', '#66ff00', '#6600ff', '#00ffcc', '#cc00ff', '#ffcc00', '#00ccff', '#ccff00', '#ff3300', '#33ff00', '#0033ff', '#ff0033'] },
  { id: 'pastel', label: 'PASTEL', colors: ['#ffd1dc', '#ffe4e1', '#f0fff0', '#e6e6fa', '#fff0f5', '#fafad2', '#f5f5dc', '#e0ffff', '#d8bfd8', '#ffe4b5', '#ffe4c4', '#f0e68c', '#f5deb3', '#faf0e6', '#e6e6fa', '#dcdcdc'] },
  { id: 'earth', label: 'EARTH', colors: ['#7b3f00', '#a0522d', '#deb887', '#cd853f', '#8b4513', '#d2b48c', '#bc8f8f', '#f5f5dc', '#a0522d', '#8b4513', '#654321', '#c2b280', '#996633', '#b5651d', '#654321', '#704214'] },
  { id: 'frutiger_aero', label: 'FRUTIGER AERO', colors: ['#00aaff', '#66ccff', '#99ddff', '#cceeff', '#e6f7ff', '#99ffff', '#66ffff', '#00ffff', '#33cccc', '#009999', '#336666', '#003333', '#ffffff', '#e6e6e6', '#cccccc', '#999999'] },
];

type PixelateResult = { image: string; swatches: number[][]; width: number; height: number };

const MONO_FONT = "'Geist Mono', 'JetBrains Mono', monospace";

// large images are pre-shrunk in the browser so the upload passes through the proxy
async function prepareUpload(f: File): Promise<File> {
  if (f.size <= 4 * 1024 * 1024) return f;
  try {
    const url = URL.createObjectURL(f);
    try {
      const img = await new Promise<HTMLImageElement>((ok, err) => {
        const i = new Image();
        i.onload = () => ok(i);
        i.onerror = () => err(new Error('decode failed'));
        i.src = url;
      });
      const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return f;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, 'image/png'));
      if (!blob) return f;
      return new File([blob], f.name.replace(/\.[^.]+$/, '') + '_shrunk.png', { type: 'image/png' });
    } finally {
      URL.revokeObjectURL(url);
    }
  } catch {
    return f;
  }
}

export default function PixelatorApp() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'Grid' | 'Segment'>('Grid');
  const [pixelSize, setPixelSize] = useState(10);
  const [paletteType, setPaletteType] = useState<'auto' | 'custom'>('auto');
  const [customColors, setCustomColors] = useState<string[]>(Array(16).fill('#000000'));
  const [presetId, setPresetId] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<PixelateResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptFile = (f: File | undefined | null) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setError('IMAGE_FILES_ONLY');
      return;
    }
    setFile(f);
    setError('');
    setResult(null);
  };

  const applyPreset = (id: string) => {
    setPresetId(id);
    if (!id) return;
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setPaletteType('custom');
    setCustomColors((prev) => preset.colors.map((c, i) => c ?? prev[i]));
  };

  const execute = async () => {
    if (!file) {
      setError('SELECT_AN_IMAGE_FIRST');
      return;
    }
    setBusy(true);
    setError('');
    setResult(null);
    try {
      const upload = await prepareUpload(file);
      const fd = new FormData();
      fd.append('file', upload, upload.name);
      fd.append('mode', mode);
      fd.append('pixel_size', String(pixelSize));
      fd.append('palette_type', paletteType);
      if (paletteType === 'custom') customColors.forEach((c) => fd.append('custom_colors', c));

      const api = process.env.REACT_APP_BACKEND_URL;
      const res = await fetch(`${api}/api/pixelate`, { method: 'POST', body: fd });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error((data && data.detail) || `HTTP_${res.status}`);
      setResult(data as PixelateResult);
    } catch (e) {
      setError(e instanceof Error ? e.message.toUpperCase() : 'PROCESSING_FAILED');
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.image;
    a.download = 'pixelated.png';
    a.click();
  };

  const preset = PRESETS.find((p) => p.id === presetId);

  return (
    <div className="min-h-full bg-black text-white" style={{ fontFamily: MONO_FONT }} data-testid="app-pixelator">
      <div className="p-4 sm:p-5">
        {/* header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-[16px] font-bold uppercase tracking-[-0.03em]">Pixelator</h2>
          <span className="text-[8.5px] uppercase tracking-[0.22em] text-[#666]">
            Grid sampling · SLIC segmentation · palette extraction
          </span>
        </div>

        {/* result */}
        {result && (
          <div className="mt-4" data-testid="pixelator-result">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#888]">
              Last_process_result — {result.width}×{result.height}
            </p>
            <img
              src={result.image}
              alt="Pixelated result"
              className="mt-2 w-full rounded-lg border border-[#333]"
              style={{ imageRendering: 'pixelated' }}
              data-testid="pixelator-result-image"
            />
            <div className="mt-2 flex h-3 w-full overflow-hidden rounded-sm border border-[#333]" data-testid="pixelator-swatches">
              {result.swatches.map((c, i) => (
                <span key={i} className="flex-1" style={{ background: `rgb(${c[0]},${c[1]},${c[2]})` }} />
              ))}
            </div>
            <button
              onClick={download}
              data-testid="pixelator-download"
              className="mt-3 border border-[#333] bg-[#111] px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#333]"
            >
              Download PNG
            </button>
          </div>
        )}

        {/* drop zone */}
        <label
          className={`mt-4 flex h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-4 text-center transition-colors ${
            dragOver ? 'border-white bg-[#111] text-white' : 'border-[#333] text-[#888] hover:border-[#555]'
          }`}
          onDragEnter={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            acceptFile(e.dataTransfer.files?.[0]);
          }}
          data-testid="pixelator-drop-zone"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => acceptFile(e.target.files?.[0])}
            data-testid="pixelator-file-input"
          />
          <span className="text-[11px] uppercase tracking-[0.15em]">Drag_drop_or_click_to_upload</span>
          {file && (
            <span className="mt-2 break-all text-[11px] font-bold text-white" data-testid="pixelator-file-name">
              Selected: {file.name}
            </span>
          )}
        </label>

        {/* control panel */}
        <div className="mt-5 grid grid-cols-1 gap-4 rounded-xl border border-[#333] bg-[#111] p-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[9px] uppercase tracking-[0.2em] text-[#666]">Sampling_mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as 'Grid' | 'Segment')}
              data-testid="pixelator-mode"
              className="w-full border border-[#333] bg-black p-2.5 text-[11px] text-white outline-none"
            >
              <option value="Grid">GRID_SAMPLING</option>
              <option value="Segment">ORGANIC_SLIC</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-[9px] uppercase tracking-[0.2em] text-[#666]">Resolution_scale — {pixelSize}</label>
            <input
              type="range"
              min={1}
              max={25}
              value={pixelSize}
              onChange={(e) => setPixelSize(Number(e.target.value))}
              className="mt-2 w-full accent-white"
              data-testid="pixelator-pixel-size"
              aria-label="Resolution scale"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-[9px] uppercase tracking-[0.2em] text-[#666]">Palette_source</label>
            <div className="flex gap-5">
              <label className="flex cursor-pointer items-center gap-2 text-[10px]">
                <input type="radio" name="palette_type" checked={paletteType === 'auto'} onChange={() => setPaletteType('auto')} data-testid="pixelator-palette-auto" /> AUTO_EXTRACT
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-[10px]">
                <input type="radio" name="palette_type" checked={paletteType === 'custom'} onChange={() => setPaletteType('custom')} data-testid="pixelator-palette-custom" /> CUSTOM_PALETTE
              </label>
            </div>
          </div>

          {paletteType === 'custom' && (
            <div className="border-t border-[#333] pt-4 sm:col-span-2" data-testid="pixelator-custom-palette-area">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-[#666]">Quick_presets</label>
                    <div className="flex h-3 w-[45%] gap-[2px]" data-testid="pixelator-preset-strip">
                      {(preset?.colors ?? []).map((c, i) => (
                        <span key={i} className="flex-1 rounded-[2px] border border-[#333]" style={{ background: c }} />
                      ))}
                    </div>
                  </div>
                  <select
                    value={presetId}
                    onChange={(e) => applyPreset(e.target.value)}
                    data-testid="pixelator-preset-select"
                    className="w-full border border-[#333] bg-black p-2.5 text-[11px] text-white outline-none"
                  >
                    <option value="">-- CHOOSE_PRESET --</option>
                    {PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[9px] uppercase tracking-[0.2em] text-[#666]">Manual_adjustment (16 colors)</label>
                  <div className="grid grid-cols-8 gap-1">
                    {customColors.map((c, i) => (
                      <input
                        key={i}
                        type="color"
                        value={c}
                        onChange={(e) => setCustomColors((prev) => prev.map((p, pi) => (pi === i ? e.target.value : p)))}
                        className="h-7 w-full cursor-pointer border border-[#333] bg-transparent"
                        data-testid={`pixelator-color-${i}`}
                        aria-label={`Custom color ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={execute}
            disabled={busy}
            data-testid="pixelator-execute"
            className="col-span-full mt-1 bg-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-black transition-colors hover:bg-[#ccc] disabled:cursor-wait disabled:bg-[#888]"
          >
            {busy ? 'EXECUTING…' : 'EXECUTE_UPLOAD'}
          </button>
        </div>

        {busy && (
          <p className="mt-3 animate-pulse text-center text-[10px] uppercase tracking-[0.25em] text-[#888]" data-testid="pixelator-busy">
            Processing — SLIC + palette matching can take a few seconds
          </p>
        )}
        {error && (
          <p className="mt-3 border border-[#5c1a1a] bg-[#1a0d0d] px-3 py-2 text-center text-[10px] uppercase tracking-[0.2em] text-[#ff7b6b]" data-testid="pixelator-error">
            {error}
          </p>
        )}
        <p className="mt-4 text-center text-[8.5px] uppercase tracking-[0.25em] text-[#555]">
          Pixelator — built by Himesh Soni · Python · SLIC · KMeans
        </p>
      </div>
    </div>
  );
}