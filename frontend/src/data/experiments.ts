// ───────────────────────────────────────────────────────────
// EXPERIMENTS — things made because of curiosity. Data-driven:
// add a new entry here and it appears in the Experiments app.
// ───────────────────────────────────────────────────────────

export type Experiment = {
  id: string;
  title: string;
  description: string;
  type: string;
  status: 'EXPERIMENT';
  opens?: 'pixelator' | 'bottle';
};

export const EXPERIMENTS: Experiment[] = [
  {
    id: 'pixelator',
    title: 'Pixelator',
    description: 'Small image-processing experiment.',
    type: 'Image Processing',
    status: 'EXPERIMENT',
    opens: 'pixelator',
  },
  {
    id: 'water-bottle-simulation',
    title: 'Water Bottle Simulation',
    description: 'Small simulation/visual experiment involving water movement.',
    type: 'Simulation',
    status: 'EXPERIMENT',
    opens: 'bottle',
  },
  {
    id: 'local-ai-rag',
    title: 'Local AI / RAG Experiments',
    description: 'Experiments involving local AI models, RAG and terminal interaction.',
    type: 'AI / LLMs',
    status: 'EXPERIMENT',
  },
  {
    id: 'cv-experiments',
    title: 'Computer Vision Experiments',
    description: 'Small CV/image-processing experiments.',
    type: 'Computer Vision',
    status: 'EXPERIMENT',
  },
  {
    id: 'creative-coding',
    title: 'Creative Coding',
    description: 'Small visual and interactive experiments.',
    type: 'Creative Coding',
    status: 'EXPERIMENT',
  },
];
