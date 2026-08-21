import type { Project } from '@/content/types';

/** Roughly how long the long version takes, so nobody starts it by accident. */
export function caseStudyMinutes(project: Project) {
  const text = [
    ...(project.problem ?? []),
    ...(project.approach ?? []),
    ...(project.outcome ?? []),
    ...(project.notes ?? []).flatMap((note) => [note.title, ...note.body]),
  ].join(' ');

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
