export type JourneyEntry = {
  year: string;
  title: string;
  short: string;
  details: string[];
  metric?: string;
};

// Factually accurate — scores supplied by Himesh.
export const JOURNEY: JourneyEntry[] = [
  {
    year: '2022',
    title: 'ICSE',
    short: 'Completed ICSE.',
    metric: 'ICSE — 95',
    details: ['Completed ICSE — 95.'],
  },
  {
    year: '2024',
    title: 'ISC',
    short: 'Completed ISC.',
    metric: 'ISC — 92.3',
    details: ['Completed ISC — 92.3.'],
  },
  {
    year: '2024',
    title: 'Started B.Tech Computer Science',
    short: 'BITS Pilani Dubai Campus.',
    details: ['Started B.Tech Computer Science at BITS Pilani Dubai Campus.'],
  },
  {
    year: '2025',
    title: 'Projects & Experimentation',
    short: 'AI / ML / software projects and experimentation.',
    details: [
      'AI / ML / software projects and experimentation.',
      'Projects from this period include RoadPulse, TerminalAI, the Indoor RF Simulator and more.',
    ],
  },
  {
    year: '2026',
    title: 'Research & Exploration',
    short: 'AI / ML, Quantum, Computer Vision and ongoing research.',
    metric: 'QUANTUM · CV · SCHEDULING · AI SYSTEMS',
    details: [
      'AI / ML, Quantum, Computer Vision and ongoing research.',
      'Ongoing: QKD Eve detection, ML for scheduling, reliability-aware retinal grading, efficient vision patch selection.',
    ],
  },
];
