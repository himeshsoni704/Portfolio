// ───────────────────────────────────────────────────────────
// PROJECTS — things Himesh built. Content supplied by Himesh.
// Nothing here is invented: statuses are exact, missing links
// stay missing, CogMap's description stays "coming soon".
// ───────────────────────────────────────────────────────────

export type ProjectStatus = 'PROJECT' | 'PUBLIC' | 'PRIVATE' | 'ONGOING';

export type Project = {
  id: string;
  title: string;
  status: ProjectStatus;
  category: string;
  description: string;
  technologies: string[];
  github: string | null;
  demo: string | null;
  featured: boolean;
  special?: 'pixelator';
};

export const PROJECTS: Project[] = [
  {
    id: 'defi-risk-checker',
    title: 'Defi Risk Checker',
    status: 'PROJECT',
    category: 'DeFi · Risk',
    description: 'A project related to checking risk in decentralized finance.',
    technologies: ['DeFi', 'Risk Analysis'],
    github: null,
    demo: null,
    featured: true,
  },
  {
    id: 'roadpulse',
    title: 'RoadPulse',
    status: 'PROJECT',
    category: 'AI · Smart City',
    description: 'A fully functional, AI-powered smart city road incident reporting platform.',
    technologies: ['AI', 'Full Stack', 'Smart City'],
    github: 'https://github.com/himeshsoni704',
    demo: null,
    featured: true,
  },
  {
    id: 'finteach',
    title: 'FinTeach',
    status: 'PRIVATE',
    category: 'Bank Security',
    description: 'A tool related to bank security.',
    technologies: ['Security', 'Banking'],
    github: null,
    demo: null,
    featured: false,
  },
  {
    id: 'indoor-rf-simulator',
    title: 'Indoor RF Simulator',
    status: 'PUBLIC',
    category: 'Simulation · RF',
    description: 'An indoor radio-frequency simulator.',
    technologies: ['RF', 'Simulation'],
    github: 'https://github.com/himeshsoni704/indoor_rf_simulator',
    demo: null,
    featured: false,
  },
  {
    id: 'pixelator',
    title: 'Pixelator',
    status: 'PUBLIC',
    category: 'Creative Coding · Image Processing',
    description: 'An image pixelating application.',
    technologies: ['JavaScript', 'Image Processing'],
    github: 'https://github.com/himeshsoni704',
    demo: null,
    featured: true,
    special: 'pixelator',
  },
  {
    id: 'terminalai',
    title: 'TerminalAI',
    status: 'PUBLIC',
    category: 'Local AI · Linux',
    description:
      'A local Linux terminal AI bot. It explores using local AI to interact with and assist with Linux terminal commands.',
    technologies: ['Linux', 'Local AI', 'Terminal'],
    github: 'https://github.com/himeshsoni704',
    demo: null,
    featured: true,
  },
  {
    id: 'cogmap',
    title: 'CogMap',
    status: 'PUBLIC',
    category: 'Coming Soon',
    description: '[Description coming soon]',
    technologies: [],
    github: 'https://github.com/himeshsoni704',
    demo: null,
    featured: false,
  },
  {
    id: 'esp32-csi-motion-radar',
    title: 'ESP32 CSI Motion Radar',
    status: 'ONGOING',
    category: 'Hardware · Sensing',
    description:
      'A hardware/sensing project involving ESP32 and Wi-Fi Channel State Information for motion detection.',
    technologies: ['ESP32', 'Wi-Fi CSI', 'Sensing'],
    github: null,
    demo: null,
    featured: true,
  },
  {
    id: 'crypto-arbitrager',
    title: 'Crypto Arbitrager',
    status: 'PUBLIC',
    category: 'Crypto',
    description: 'A crypto arbitrage project.',
    technologies: ['Crypto', 'Arbitrage'],
    github: 'https://github.com/himeshsoni704',
    demo: null,
    featured: false,
  },
  {
    id: 'uae-einvoicing-gap-analyzer',
    title: 'UAE e-Invoicing Gap Analyzer',
    status: 'ONGOING',
    category: 'AI · FinTech',
    description:
      'An AI-assisted system for analyzing invoice data and checking readiness against UAE e-invoicing requirements.',
    technologies: [
      'AI / LLMs',
      'FastAPI',
      'PHP REST API',
      'MySQL',
      'CSV',
      'Excel',
      'XML',
      'Field Mapping',
      'Validation',
      'Compliance Analysis',
    ],
    github: null,
    demo: null,
    featured: true,
  },
  {
    id: 'letter-of-credit-automation',
    title: 'Letter of Credit Automation',
    status: 'ONGOING',
    category: 'Document Intelligence',
    description:
      'Document-processing and automation project involving OCR / extraction, structured information, validation, discrepancy detection and workflow automation.',
    technologies: ['OCR / Extraction', 'Structured Information', 'Validation', 'Discrepancy Detection', 'Workflow Automation'],
    github: null,
    demo: null,
    featured: true,
  },
];
