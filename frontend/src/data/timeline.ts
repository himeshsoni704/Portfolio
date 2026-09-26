export type JourneyEntry = {
  year: string;
  title: string;
  short: string;
  details: string[];
};

// Factually accurate, supplied by Himesh. Nothing fabricated.
export const JOURNEY: JourneyEntry[] = [
  {
    year: '2022',
    title: 'ICSE',
    short: 'Completed ICSE.',
    details: ['Completed ICSE.'],
  },
  {
    year: '2024',
    title: 'ISC',
    short: 'Completed ISC.',
    details: ['Completed ISC.'],
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
    short: 'Quantum computing · QKD · ML · Computer vision · Scheduling · AI systems.',
    details: [
      'Research across: quantum computing, QKD, ML, computer vision, scheduling, AI systems.',
      'Ongoing: QKD Eve detection, ML for scheduling, reliability-aware retinal grading, efficient vision patch selection.',
    ],
  },
];
