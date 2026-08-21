import Link from 'next/link';
import type { Project } from '@/content/types';
import { ProjectIcon } from './project-icon';
import { StatusBadge } from './ui/status-badge';
import { ArrowRight } from './ui/arrow';

/**
 * A project as a line, not a poster.
 *
 * Screenshots live inside the case studies, where someone has already decided
 * to look. On an index they competed with each other — three products, three
 * different shapes, none of them readable at card size — and made the page feel
 * heavier than the list it actually is.
 */
export function ProjectRow({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="hover-arrow card-press pressable group -mx-4 flex items-center gap-4 rounded-xl border border-transparent px-4 py-5 transition-colors hover:border-line hover:bg-panel sm:gap-5"
    >
      <ProjectIcon project={project} size={40} className="hidden sm:block" />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-display text-xl tracking-tight sm:text-2xl">{project.name}</h3>
          <StatusBadge status={project.status} />
        </div>

        <p className="mt-1 text-[15px] leading-snug text-muted">{project.tagline}</p>

        <ul className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
          {project.stack.slice(0, 4).map((item) => (
            <li key={item} className="font-mono text-[10px] text-faint">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <ArrowRight className="size-4 shrink-0 text-faint transition-colors group-hover:text-fg" />
    </Link>
  );
}
