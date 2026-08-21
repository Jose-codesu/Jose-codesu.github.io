import type { StackGroup } from './types';

/**
 * `level` is self-assessed and intentionally conservative:
 *   working  — used it to build something that runs
 *   learning — actively studying, not yet shipped with it
 * Overstating this is the fastest way to fail a technical screen. Move items
 * up as the evidence appears in the work section.
 */
export const stack: StackGroup[] = [
  {
    name: 'AI engineering',
    items: [
      { name: 'Claude API', level: 'working' },
      { name: 'Tool use / function calling', level: 'working' },
      { name: 'Structured output', level: 'working' },
      { name: 'Prompt design', level: 'working' },
      { name: 'Agent loops', level: 'working' },
      { name: 'Evals', level: 'learning' },
      { name: 'RAG', level: 'learning' },
      { name: 'Fine-tuning', level: 'learning' },
    ],
  },
  {
    name: 'Languages',
    items: [
      { name: 'Python', level: 'learning' },
      { name: 'Swift', level: 'working' },
      { name: 'TypeScript', level: 'working' },
      { name: 'SQL', level: 'working' },
      { name: 'Bash', level: 'working' },
    ],
  },
  {
    name: 'Apple platforms',
    items: [
      { name: 'SwiftUI', level: 'working' },
      { name: 'SwiftData', level: 'working' },
      { name: 'WidgetKit', level: 'working' },
      { name: 'StoreKit 2', level: 'working' },
      { name: 'watchOS', level: 'working' },
      { name: 'Metal', level: 'learning' },
    ],
  },
  {
    name: 'Web',
    items: [
      { name: 'Next.js', level: 'working' },
      { name: 'React', level: 'working' },
      { name: 'Tailwind CSS', level: 'working' },
      { name: 'Drizzle ORM', level: 'working' },
      { name: 'SQLite / libSQL', level: 'working' },
    ],
  },
  {
    name: 'Security & systems',
    items: [
      { name: 'Linux', level: 'working' },
      { name: 'Networking / TCP/IP', level: 'working' },
      { name: 'SIEM & IDS concepts', level: 'learning' },
      { name: 'Incident response', level: 'learning' },
    ],
  },
  {
    name: 'Practices',
    items: [
      { name: 'Git & GitHub Actions', level: 'working' },
      { name: 'Automated testing', level: 'working' },
      { name: 'Technical writing', level: 'working' },
      { name: 'Bilingual EN / ES', level: 'working' },
    ],
  },
];
