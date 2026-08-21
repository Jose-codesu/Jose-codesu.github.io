import Link from 'next/link';
import type { Project } from '@/content/types';
import { StatusBadge } from './ui/status-badge';
import { ProjectIcon } from './project-icon';
import { ArrowRight } from './ui/arrow';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="hover-lift hover-arrow card-press pressable group -mx-4 grid grid-cols-1 gap-x-8 gap-y-3 rounded-xl border border-transparent px-4 py-8 hover:border-line hover:bg-panel sm:grid-cols-[9rem_1fr]"
    >
      <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2 sm:pt-2">
        <span className="font-mono text-[12px] text-faint">{project.year}</span>
        <StatusBadge status={project.status} />
      </div>

      <div>
        <div className="flex items-center gap-3">
          <ProjectIcon project={project} size={40} />
          <h3 className="font-display text-[28px] leading-tight tracking-tight sm:text-[32px]">
            {project.name}
          </h3>
        </div>
        <p className="mt-2 text-[15px] text-muted">{project.tagline}</p>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-fg/85">{project.summary}</p>

        <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
          {project.stack.slice(0, 6).map((item) => (
            <li key={item} className="font-mono text-[11px] text-faint">
              {item}
            </li>
          ))}
          {project.stack.length > 6 && (
            <li className="font-mono text-[11px] text-faint">+{project.stack.length - 6}</li>
          )}
        </ul>

        <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] text-fg">
          Read the case study
          <ArrowRight />
        </span>
      </div>
    </Link>
  );
}
