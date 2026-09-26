// ───────────────────────────────────────────────────────────
// RESEARCH — questions Himesh is investigating. A digital
// research notebook. No fabricated results, publications or
// conclusions — everything here is ongoing.
// ───────────────────────────────────────────────────────────

export type ResearchEntry = {
  id: string;
  title: string;
  status: 'ONGOING RESEARCH';
  description: string;
  researchQuestion: string;
  topics: string[];
  notes?: string[];
  visual?: 'qkd';
};

export const RESEARCH: ResearchEntry[] = [
  {
    id: 'qkd-eve-detection',
    title: 'Quantum Key Distribution: ML/DL-Based Eve Detection Under Noise',
    status: 'ONGOING RESEARCH',
    description:
      'Exploring QKD protocols and whether machine-learning and deep-learning approaches can detect eavesdropping-related behavior under realistic noise conditions.',
    researchQuestion:
      'Can ML/DL models reliably distinguish eavesdropping-related behavior from ordinary quantum channel noise?',
    topics: [
      'QKD',
      'BB84',
      'BKM07',
      'QBER',
      'Quantum Noise',
      'Eavesdropping',
      'Machine Learning',
      'Deep Learning',
      'Anomaly Detection',
    ],
    notes: [
      'Protocols studied: BB84 (prepare-and-measure) and BKM07, with QBER and its temporal behavior as the primary signal.',
      'Models explored so far include classical ML approaches (KNN, Logistic Regression, Random Forest) and anomaly detection (Isolation Forest).',
      'No final conclusions yet — this is an open investigation.',
    ],
    visual: 'qkd',
  },
  {
    id: 'ml-scheduling',
    title: 'Machine Learning for Scheduling Algorithms',
    status: 'ONGOING RESEARCH',
    description:
      'Investigating how machine-learning approaches can be applied to scheduling algorithms and how they compare with conventional scheduling strategies.',
    researchQuestion:
      'How do ML-based scheduling approaches compare with conventional scheduling strategies — and where are they actually worth it?',
    topics: ['Machine Learning', 'Scheduling Algorithms', 'Benchmarking'],
    notes: ['This is ongoing research. No final result yet.'],
  },
  {
    id: 'retinal-grading-reliability',
    title: 'Reliability-Aware Vision Models for Diabetic Retinopathy Grading',
    status: 'ONGOING RESEARCH',
    description:
      'Existing retinal disease models can grade disease severity, but an important question is whether their predictions remain reliable when fundus-image quality deteriorates. This research explores whether a learned quality mechanism can identify unreliable cases and potentially defer them rather than treating every prediction as equally reliable.',
    researchQuestion:
      'When fundus-image quality deteriorates, can a learned quality mechanism identify unreliable grades and defer those cases instead of trusting every prediction equally?',
    topics: [
      'Diabetic Retinopathy',
      'Fundus Images',
      'Image Quality',
      'Vision Models',
      'Reliability',
      'Selective Prediction',
      'Quality Gating',
      'Deferral',
    ],
    notes: [
      'This does not claim that existing models universally fail — the reliability gap under degraded image quality is the question being investigated.',
    ],
  },
  {
    id: 'patch-selection',
    title: 'Which Patches Should a Vision Model Refine?',
    status: 'ONGOING RESEARCH',
    description:
      'Take a vision pipeline that performs a cheap coarse pass, selects some image patches, and then performs expensive refinement only on those patches. Keeping the coarse model, refiner, fallback and compute budget fixed, the investigation is which patch-selection strategy actually helps.',
    researchQuestion:
      'Do expensive global signals (learned selectors, DINOv2 features, diffusion-model features) provide enough benefit over cheap signals (coarse-pass entropy) to justify their additional computational cost?',
    topics: [
      'Vision Pipelines',
      'Patch Selection',
      'Coarse-to-Fine',
      'DINOv2 Features',
      'Diffusion Features',
      'Compute Budgets',
    ],
    notes: [
      'Selection signals considered: coarse-pass entropy, learned selectors, DINOv2 features, diffusion-model features, other mechanisms.',
      'The cost of the selector itself matters — not just final accuracy.',
      'No answer yet. That is what makes it research.',
    ],
  },
];
