// ───────────────────────────────────────────────────────────
// EXPERIMENTS — smaller things made while curious.
// Links go to Himesh's real GitHub profile (repos TBD by him).
// ───────────────────────────────────────────────────────────

export type Experiment = {
  title: string;
  category: string;
  description: string;
  link: string | null;
  tag?: string;
};

export const EXPERIMENTS: Experiment[] = [
  {
    title: 'Pixelator',
    category: 'Creative Coding',
    description: 'Live pixelation playground. The full demo lives right here on this site.',
    link: '/work/pixelator',
    tag: 'SANDBOX BELOW',
  },
  {
    title: 'Water Bottle Simulation',
    category: 'Physics',
    description: '2D bottle-tilting fluid experiment. Also live on this site — go tilt it.',
    link: '/work/water-bottle-simulation',
    tag: 'SANDBOX BELOW',
  },
  {
    title: 'Local LLM / RAG Experiments',
    category: 'AI / LLMs',
    description: 'Running local models, wiring up retrieval, and teaching a machine to cite its sources.',
    link: 'https://github.com/himeshsoni704',
  },
  {
    title: 'Computer Vision Playground',
    category: 'Computer Vision',
    description: 'Small experiments in detection, tracking and image understanding.',
    link: 'https://github.com/himeshsoni704',
  },
  {
    title: 'ML Micro-Experiments',
    category: 'Machine Learning',
    description: 'Tiny models on tiny datasets — fast feedback loops for understanding fundamentals.',
    link: 'https://github.com/himeshsoni704',
  },
  {
    title: 'Prototypes & Odd Jobs',
    category: 'Software',
    description: 'The grab-bag drawer: utilities, scrapped ideas and things built in one sitting.',
    link: 'https://github.com/himeshsoni704',
  },
];
