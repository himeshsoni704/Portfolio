// ───────────────────────────────────────────────────────────
// PROJECTS — data-driven. Add a new project by adding an entry.
// Case studies render on /work/<slug> using the 01—08 template.
// Anything marked [PLACEHOLDER] is intentionally left for
// Himesh to fill in — no invented facts, metrics or links.
// ───────────────────────────────────────────────────────────

export type CaseSection = {
  no: string;
  heading: string;
  body: string[];
};

export type Project = {
  title: string;
  category: string;
  year: string;
  status: 'SHIPPED' | 'IN PROGRESS' | 'EXPERIMENT';
  description: string;
  technologies: string[];
  image: string;
  slug: string;
  github: string;
  demo: string | null;
  privacyLabel: string | null;
  featured: boolean;
  visual: 'qkd' | 'pipeline-einv' | 'pipeline-lc' | 'pixelator' | 'bottle';
  protocols: string[];
  quote?: string;
  board?: { current: string[]; exploring: string[]; next: string[] };
  caseStudy: CaseSection[];
};

export const PROJECTS: Project[] = [
  {
    title: 'Quantum Key Distribution × Machine Learning',
    category: 'Research × AI',
    year: '2025',
    status: 'SHIPPED',
    description:
      'I explored machine-learning approaches for detecting eavesdropping and attacks in quantum key distribution protocols.',
    technologies: [
      'BB84',
      'BKM07',
      'QBER',
      'Eavesdropping',
      'Photon-Number Attacks',
      'Temporal QBER',
      'KNN',
      'Logistic Regression',
      'Random Forest',
      'Isolation Forest',
    ],
    image: '/images/qkd-project.jpg',
    slug: 'qkd-ml',
    github: 'YOUR_GITHUB_URL',
    demo: null,
    privacyLabel: null,
    featured: true,
    visual: 'qkd',
    protocols: ['BB84', 'BKM07'],
    caseStudy: [
      {
        no: '01',
        heading: 'Problem',
        body: [
          'How do you detect an eavesdropper on a quantum channel?',
          'Quantum key distribution protocols like BB84 and BKM07 derive their security from physics — but real channels are noisy, and telling an actual attack apart from ordinary noise is a detection problem. I wanted to see whether machine learning could help make that call.',
        ],
      },
      {
        no: '02',
        heading: 'Protocols',
        body: [
          'I worked with two QKD protocols: BB84 (prepare-and-measure) and BKM07 (a entanglement-based six-state style protocol).',
          'The primary signal across both is QBER — the Quantum Bit Error Rate — tracked over time, because how QBER behaves temporally says a lot about what is happening on the channel.',
        ],
      },
      {
        no: '03',
        heading: 'Attack Models',
        body: [
          'I simulated eavesdropping scenarios: intercept-resend style attacks, and photon-number-related attacks (such as PNS-style attacks on weak coherent pulses).',
          'EVE interacts with the quantum channel between ALICE and BOB — the goal is to notice her from the statistics of the key alone.',
        ],
      },
      {
        no: '04',
        heading: 'ML Approach',
        body: [
          'I framed detection as both a classification problem and an anomaly-detection problem over QBER and channel features.',
          'Models explored: KNN, Logistic Regression, Random Forest (supervised) and Isolation Forest (unsupervised, for attack patterns with no labelled examples).',
        ],
      },
      {
        no: '05',
        heading: 'Experiments',
        body: [
          'Attack vs. no-attack runs across both protocols, comparing supervised classifiers against unsupervised anomaly detection — including how each behaves when QBER shifts gradually rather than spiking.',
          'Detailed experiment logs: [PLACEHOLDER — add your experiment tables]',
        ],
      },
      {
        no: '06',
        heading: 'Results',
        body: ['[PLACEHOLDER — add your results, metrics and comparison numbers. Nothing here is invented.]'],
      },
      {
        no: '07',
        heading: 'What I Learned',
        body: [
          'The hard part is not running the models — it is designing features that separate an adversary from honest noise. Quantum noise is a moving target.',
          'This project is also where quantum information stopped being an abstract topic for me and became something I could simulate, attack and measure.',
        ],
      },
      {
        no: '08',
        heading: "What's Next",
        body: [
          'Revisiting the detection pipeline with quantum-aware feature engineering and more realistic channel models — and testing how the approaches transfer when noise profiles change.',
        ],
      },
    ],
  },
  {
    title: 'AI-Based eInvoicing Gap Analyzer',
    category: 'AI × Software',
    year: '2025',
    status: 'SHIPPED',
    description:
      'An AI-assisted system for analysing invoice data against UAE e-invoicing requirements and identifying compliance gaps.',
    technologies: ['Python', 'FastAPI', 'PHP REST API', 'MySQL', 'AI/LLM Components'],
    image: '/images/einvoicing.jpg',
    slug: 'einvoicing-gap-analyzer',
    github: 'YOUR_GITHUB_URL',
    demo: null,
    privacyLabel: 'Private / Internship Project',
    featured: true,
    visual: 'pipeline-einv',
    protocols: [],
    caseStudy: [
      {
        no: '01',
        heading: 'Problem',
        body: [
          'The UAE is moving to mandatory e-invoicing, and businesses need to know how far their current invoice data is from actually complying — field by field, document by document.',
          'Manual review does not scale. I wanted a system that reads invoice data and answers: what is missing, what is wrong, and how ready is this document?',
        ],
      },
      {
        no: '02',
        heading: 'Why I Built It',
        body: [
          'This began as an internship problem: a real domain, real requirements, and a genuine gap between what invoices contain and what the e-invoicing framework expects.',
        ],
      },
      {
        no: '03',
        heading: 'Approach',
        body: [
          'A processing pipeline: invoice input → extraction → field mapping against the e-invoicing schema → validation rules → a compliance gap report with a readiness signal.',
          'AI/LLM components assist with extraction and mapping where rigid parsing breaks; deterministic rules handle the strict validation logic.',
        ],
      },
      {
        no: '04',
        heading: 'Architecture',
        body: [
          'Python + FastAPI for the analysis services, a PHP REST API and MySQL on the integration side — a mix of modern tooling and the systems that actually run the business.',
        ],
      },
      {
        no: '05',
        heading: 'Experiments',
        body: [
          'Tested against real-shaped invoice samples: complete documents, partially-filled documents, and documents with structurally invalid fields.',
          '[PLACEHOLDER — add your evaluation details]',
        ],
      },
      {
        no: '06',
        heading: 'Results',
        body: ['[PLACEHOLDER — add your results. No invented metrics here.]'],
      },
      {
        no: '07',
        heading: 'What I Learned',
        body: [
          'Compliance is a systems problem, not just an ML problem. The AI parts are only useful when the deterministic rules around them are airtight.',
        ],
      },
      {
        no: '08',
        heading: "What's Next",
        body: ['Deeper schema coverage and richer gap reporting as the UAE e-invoicing rollout evolves.'],
      },
    ],
  },
  {
    title: 'Letter of Credit Automation',
    category: 'AI × Document Intelligence',
    year: '2025',
    status: 'IN PROGRESS',
    description:
      'Exploring how document intelligence can automate parts of Letter of Credit processing — a trade-finance workflow still dominated by slow, manual document checks.',
    technologies: ['OCR', 'Document AI', 'Python', 'LLMs', 'Workflow Automation'],
    image: '/images/lc-automation.jpg',
    slug: 'lc-automation',
    github: 'YOUR_GITHUB_URL',
    demo: null,
    privacyLabel: null,
    featured: true,
    visual: 'pipeline-lc',
    protocols: [],
    board: {
      current: [
        'Pipeline skeleton: documents → OCR / extraction → structured data',
        'Validation and discrepancy-detection logic for core LC fields',
        'Prototype document previews with extracted-field overlays',
      ],
      exploring: [
        'How far LLMs can go on messy, real-world trade documents',
        'Which discrepancies matter most for human reviewers',
        'Confidence scoring before anything touches a workflow',
      ],
      next: [
        'A real workflow integration — not just a prototype',
        'Feedback loop from reviewer corrections back into extraction',
        'Broader document-type coverage',
      ],
    },
    caseStudy: [
      {
        no: '01',
        heading: 'Problem',
        body: [
          'Letter of Credit processing means checking stacks of trade documents against each other — and against the LC terms — by hand. Slow, error-prone, and very rule-heavy.',
          'The goal: automate parts of this pipeline, not pretend it can all disappear.',
        ],
      },
      {
        no: '02',
        heading: 'Why I Built It',
        body: [
          'It sits exactly where my interests overlap: document intelligence, real-world constraints, and a workflow where a missed discrepancy has actual consequences.',
        ],
      },
      {
        no: '03',
        heading: 'Approach',
        body: [
          'Documents → OCR / extraction → structured data → validation → discrepancy detection → workflow handoff. Each stage feeds the next; nothing is fully trusted without a check.',
        ],
      },
      {
        no: '04',
        heading: 'Architecture',
        body: ['[PLACEHOLDER — architecture diagrams and stack details are still evolving.]'],
      },
      {
        no: '05',
        heading: 'Experiments',
        body: ['[PLACEHOLDER — add your experiment notes as the project evolves.]'],
      },
      {
        no: '06',
        heading: 'Results',
        body: ['[PLACEHOLDER — this project is in progress. Results will be added honestly, when they exist.]'],
      },
      {
        no: '07',
        heading: 'What I Learned',
        body: [
          'So far: extraction is the easy 20%. Knowing which discrepancies actually matter to a human reviewer is the hard 80%.',
        ],
      },
      {
        no: '08',
        heading: "What's Next",
        body: ['Keep evolving it. This one is explicitly not finished — check the Current / Exploring / Next board.'],
      },
    ],
  },
  {
    title: 'Pixelator',
    category: 'Creative Coding × Image Processing',
    year: '2025',
    status: 'EXPERIMENT',
    description:
      "A small image-processing app I made simply because I wanted to experiment with pixelation. Started with a simple question: 'What happens if I just make everything pixels?'",
    technologies: ['Canvas API', 'Image Processing', 'JavaScript'],
    image: '/images/pixelator.jpg',
    slug: 'pixelator',
    github: 'YOUR_GITHUB_URL',
    demo: null,
    privacyLabel: null,
    featured: true,
    visual: 'pixelator',
    protocols: [],
    quote: "Started with a simple question: 'What happens if I just make everything pixels?'",
    caseStudy: [
      {
        no: '01',
        heading: 'Overview',
        body: [
          'No research objective. No client. Just a question: what happens if I reduce an image to blocks of pixels — and control how far that goes?',
        ],
      },
      {
        no: '02',
        heading: 'Why I Built It',
        body: [
          'Curiosity, honestly. And because image processing is one of the few places where you can see your code change reality instantly.',
        ],
      },
      {
        no: '03',
        heading: 'Approach',
        body: [
          'Downsample the image to a coarse grid, then scale it back up without smoothing — every block becomes a visible pixel. A slider controls how aggressive the effect is. Try it — the demo above is the real thing.',
        ],
      },
      {
        no: '04',
        heading: 'Architecture',
        body: ['A single canvas pipeline. No frameworks worth mentioning, which is exactly the fun of it.'],
      },
      {
        no: '05',
        heading: 'Experiments',
        body: ['Portraits, cityscapes, anything high-contrast. Some images survive heavy pixelation; some become pure abstraction.'],
      },
      {
        no: '06',
        heading: 'Results',
        body: ['A toy with zero practical value and infinite entertainment value. Success.'],
      },
      {
        no: '07',
        heading: 'What I Learned',
        body: ['Not everything needs a purpose to be worth building.'],
      },
      {
        no: '08',
        heading: "What's Next",
        body: ['Maybe palettes and dithering. Maybe nothing. It exists.'],
      },
    ],
  },
  {
    title: 'Water Bottle Simulation',
    category: 'Simulation × Physics',
    year: '2025',
    status: 'EXPERIMENT',
    description:
      'A small 2D physics experiment involving a water bottle and fluid behaviour — because apparently simulating a water bottle sounded like a good use of time.',
    technologies: ['Canvas API', '2D Physics', 'Particles'],
    image: '/images/water-bottle.jpg',
    slug: 'water-bottle-simulation',
    github: 'YOUR_GITHUB_URL',
    demo: null,
    privacyLabel: null,
    featured: true,
    visual: 'bottle',
    protocols: [],
    quote: 'A small physics experiment because apparently simulating a water bottle sounded like a good use of time.',
    caseStudy: [
      {
        no: '01',
        heading: 'Overview',
        body: [
          'A 2D canvas simulation: a bottle you can tilt, water that sloshes inside it, gravity doing its thing. It is 2D, and it says so proudly.',
        ],
      },
      {
        no: '02',
        heading: 'Why I Built It',
        body: ['Because apparently simulating a water bottle sounded like a good use of time. It was.'],
      },
      {
        no: '03',
        heading: 'Approach',
        body: [
          'Water is a set of simple particles with gravity, constrained inside the bottle container. Rotating the bottle rotates the world from the water’s point of view — which is what makes it feel alive.',
        ],
      },
      {
        no: '04',
        heading: 'Architecture',
        body: ['Canvas, particles, gravity vectors, and a little linear algebra to keep the water honest in the bottle’s frame.'],
      },
      {
        no: '05',
        heading: 'Experiments',
        body: ['Rotation speed, particle counts, damping. Too much damping looks dead; too little looks like soda.'],
      },
      {
        no: '06',
        heading: 'Results',
        body: ['[PLACEHOLDER — it is a water bottle. The result is joy.]'],
      },
      {
        no: '07',
        heading: 'What I Learned',
        body: ['Even toy simulations teach real things: reference frames, stability, and when "good enough physics" is genuinely good enough.'],
      },
      {
        no: '08',
        heading: "What's Next",
        body: ['Maybe bubbles. Maybe a lid. The beauty of experiments is nobody is waiting for a roadmap.'],
      },
    ],
  },
];

export function getProject(slug: string | undefined): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
