import { PROJECTS } from '../data/projects';
import { RESEARCH } from '../data/research';
import { EXPERIMENTS } from '../data/experiments';
import { PHOTOS, FILM } from '../data/photography';

// ─────────────────────────────────────────────────────────────
// WORLD 2 VIRTUAL FILE SYSTEM
// Desktop → Folder → File → Application. Everything in World 2
// is browsed through this tree.
// ─────────────────────────────────────────────────────────────

export type FSNode = {
  id: string;
  name: string;
  type: 'folder' | 'project' | 'research' | 'experiment' | 'image' | 'empty-music' | 'app';
  children?: FSNode[];
  projectId?: string;
  researchId?: string;
  experimentId?: string;
  appId?: 'resume' | 'contact';
  src?: string;
  alt?: string;
  kind?: string; // e.g. 'JPEG image', 'Application'
};

const img = (p: { src: string; alt: string; caption: string }, i: number): FSNode => ({
  id: `img-${i}`,
  name: `IMG_${String(i + 1).padStart(3, '0')}`,
  type: 'image',
  kind: 'JPEG image',
  src: p.src,
  alt: p.alt,
});

const PROJECT_FOLDERS: Array<{ id: string; name: string; ids: string[] }> = [
  { id: 'ai-ml', name: 'AI & ML', ids: ['roadpulse', 'uae-einvoicing-gap-analyzer', 'letter-of-credit-automation'] },
  { id: 'software', name: 'Software', ids: ['terminalai', 'defi-risk-checker', 'finteach', 'crypto-arbitrager', 'cogmap'] },
  { id: 'hardware-simulation', name: 'Hardware & Simulation', ids: ['indoor-rf-simulator', 'esp32-csi-motion-radar'] },
  { id: 'creative', name: 'Creative', ids: ['pixelator'] },
];

export const FS_ROOT: FSNode = {
  id: 'computer',
  name: 'Computer',
  type: 'folder',
  children: [
    {
      id: 'built',
      name: "Things I've Built",
      type: 'folder',
      children: PROJECT_FOLDERS.map((f) => ({
        id: f.id,
        name: f.name,
        type: 'folder' as const,
        children: f.ids
          .map((pid) => PROJECTS.find((p) => p.id === pid))
          .filter(Boolean)
          .map((p) => ({
            id: `proj-${p!.id}`,
            name: p!.title,
            type: 'project' as const,
            kind: p!.special === 'pixelator' ? 'Application' : 'Project file',
            projectId: p!.id,
          })),
      })),
    },
    {
      id: 'investigating',
      name: "Things I'm Investigating",
      type: 'folder',
      children: RESEARCH.map((r) => ({
        id: `res-${r.id}`,
        name: r.title,
        type: 'research' as const,
        kind: 'Research document',
        researchId: r.id,
      })),
    },
    {
      id: 'experiments',
      name: 'Experiments',
      type: 'folder',
      children: EXPERIMENTS.map((e) => ({
        id: `exp-${e.id}`,
        name: e.title,
        type: 'experiment' as const,
        kind: e.opens === 'pixelator' ? 'Application' : e.opens === 'bottle' ? 'Simulation' : 'Experiment file',
        experimentId: e.id,
      })),
    },
    {
      id: 'pictures',
      name: 'Pictures',
      type: 'folder',
      children: [
        { id: 'photography', name: 'Photography', type: 'folder', children: PHOTOS.map((p, i) => img(p, i)) },
        {
          id: 'film',
          name: 'Film',
          type: 'folder',
          children: [
            { id: 'film-poster', name: 'Film Poster', type: 'image', kind: 'JPEG image', src: FILM.poster.src, alt: FILM.poster.alt },
            { id: 'film-bts-1', name: 'BTS_001', type: 'image', kind: 'JPEG image', src: FILM.bts[0].src, alt: FILM.bts[0].alt },
            { id: 'film-bts-2', name: 'BTS_002', type: 'image', kind: 'JPEG image', src: FILM.bts[1].src, alt: FILM.bts[1].alt },
          ],
        },
      ],
    },
    { id: 'music', name: 'Music', type: 'folder', children: [{ id: 'no-tracks', name: 'No track loaded', type: 'empty-music' }] },
    { id: 'resume', name: 'Resume.pdf', type: 'app', appId: 'resume', kind: 'Document' },
    { id: 'contact', name: 'Contact', type: 'app', appId: 'contact', kind: 'Application' },
  ],
};

export function findNode(root: FSNode, id: string): FSNode | null {
  if (root.id === id) return root;
  for (const c of root.children ?? []) {
    const found = findNode(c, id);
    if (found) return found;
  }
  return null;
}

export function pathTo(root: FSNode, id: string): FSNode[] {
  if (root.id === id) return [root];
  for (const c of root.children ?? []) {
    const sub = pathTo(c, id);
    if (sub.length) return [root, ...sub];
  }
  return [];
}

export function imagesOf(node: FSNode): FSNode[] {
  const out: FSNode[] = [];
  const walk = (n: FSNode) => {
    if (n.type === 'image' && n.src) out.push(n);
    n.children?.forEach(walk);
  };
  node.children?.forEach(walk);
  return out;
}
