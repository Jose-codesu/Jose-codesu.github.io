import { visibleProjects } from '@/content/projects';
import type { Project } from '@/content/types';

/**
 * Which projects prove a given skill.
 *
 * The two lists are written independently — `stack.ts` says "Next.js", a
 * project says "Next.js 16" — so matching is normalized and version-agnostic
 * rather than exact. Deriving this instead of maintaining a third list is what
 * keeps a claimed skill from outliving the work that backs it up.
 */
/**
 * Different projects name the same thing differently — Savor lists
 * "Claude API (claude-sonnet-5)", Notewell lists "Anthropic SDK". Without this
 * map they would look like two unrelated technologies used once each, which
 * understates exactly the skill this portfolio is about.
 */
const ALIASES: Record<string, string> = {
  'anthropic sdk': 'claude api',
  'tool use': 'claude api',
  'structured output': 'claude api',
  'libsql / sqlite': 'sqlite',
  'sqlite / libsql': 'sqlite',
};

const DISPLAY: Record<string, string> = {
  'claude api': 'Claude API',
  sqlite: 'SQLite',
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/\(.*?\)/g, '') // "Claude API (claude-sonnet-5)" → "claude api"
    .replace(/[0-9.]+/g, '') // drop version numbers
    .replace(/[^a-z+/ ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function canonical(value: string) {
  const key = normalize(value);
  return ALIASES[key] ?? key;
}

export function projectUsesSkill(project: Project, skill: string) {
  const target = canonical(skill);
  return project.stack.some((item) => {
    const candidate = canonical(item);
    return candidate === target || candidate.startsWith(`${target} `) || candidate.includes(target);
  });
}

export function projectsUsing(skill: string): Project[] {
  const target = canonical(skill);
  if (!target) return [];

  return visibleProjects.filter((project) => projectUsesSkill(project, target));
}

/** Every technology named across the visible projects, with how many use it. */
export function stackFacets() {
  const counts = new Map<string, number>();

  for (const project of visibleProjects) {
    // Count each canonical technology once per project, so a project listing
    // both "Claude API" and "Tool use" does not count twice.
    const seen = new Set<string>();
    for (const item of project.stack) {
      const key = canonical(item);
      if (seen.has(key)) continue;
      seen.add(key);
      const label = DISPLAY[key] ?? item;
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, count }));
}
