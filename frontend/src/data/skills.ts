// ───────────────────────────────────────────────────────────
// SKILLS — an interactive collection. No percentage bars,
// no fake proficiency. Just what is actually in the toolkit.
// ───────────────────────────────────────────────────────────

export type SkillCategory = {
  id: string;
  title: string;
  blurb: string;
  skills: string[];
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'programming',
    title: 'Programming',
    blurb: 'The core languages',
    skills: ['Python', 'Java', 'C / C++', 'JavaScript / TypeScript'],
  },
  {
    id: 'aiml',
    title: 'AI / ML',
    blurb: 'Where most of the research energy goes',
    skills: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'LLMs', 'RAG'],
  },
  {
    id: 'software',
    title: 'Software',
    blurb: 'What I build and ship with',
    skills: ['React', 'FastAPI', 'Flask', 'MySQL', 'Git', 'Linux'],
  },
  {
    id: 'quantum',
    title: 'Quantum',
    blurb: 'The deep-space module',
    skills: ['Qiskit', 'Quantum Simulation', 'QKD'],
  },
  {
    id: 'creative',
    title: 'Creative',
    blurb: 'The other half of the brain',
    skills: ['Photography', 'Filmmaking', 'DaVinci Resolve', 'Spline', 'Creative Coding'],
  },
];
