import { lazy, Suspense, useEffect, useState } from 'react';
import HeroScene from './HeroScene';

// ═══════════════════════════════════════════════════════════════
// SPLINE SCENE SLOT
// ═══════════════════════════════════════════════════════════════
// Paste your published Spline scene URL below and it will
// replace the built-in Three.js "Himesh universe" scene —
// nothing else in the site needs to change.
//
// e.g. const SPLINE_SCENE_URL = 'https://prod.spline.design/XXXXXXXX/scene.splinecode';
// ───────────────────────────────────────────────────────────────
const SPLINE_SCENE_URL = '';

function SplineViewer({ url }: { url: string }) {
  useEffect(() => {
    if (document.querySelector('script[data-spline-viewer]')) return;
    const s = document.createElement('script');
    s.type = 'module';
    s.src = 'https://unpkg.com/@splinetool/viewer/build/spline-viewer.js';
    s.setAttribute('data-spline-viewer', 'true');
    document.head.appendChild(s);
  }, []);
  const SplineViewerEl = 'spline-viewer' as unknown as React.FC<{ url: string; className?: string }>;
  return (
    <div data-testid="spline-scene" className="h-full w-full">
      <SplineViewerEl url={url} className="h-full w-full" />
    </div>
  );
}

export default function SplineHero() {
  const useSpline = Boolean(SPLINE_SCENE_URL);
  if (!useSpline) {
    // Built-in scene: the "Himesh universe" — planet, orbit ring,
    // pixels, water bottle, camera lens, quantum circuit and Rocky.
    return <HeroScene />;
  }
  return (
    <Suspense fallback={<HeroScene />}>
      <SplineViewer url={SPLINE_SCENE_URL} />
    </Suspense>
  );
}

// lazy kept for drop-in compatibility with React.Spline patterns
void lazy;
