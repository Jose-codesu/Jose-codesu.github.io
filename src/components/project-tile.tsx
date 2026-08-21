import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/content/types';
import { ProjectIcon } from './project-icon';
import { StatusBadge } from './ui/status-badge';

/**
 * The compact card: a picture, a name, one line, three chips.
 *
 * Deliberately shorter than the old row. Someone scanning the home page for
 * fifteen seconds should be able to tell what three things I built and what
 * they look like — the case study is one click away for anyone who wants it.
 */
export function ProjectTile({ project, priority }: { project: Project; priority?: boolean }) {
  const cover = project.media?.[0];

  return (
    <Link
      href={`/work/${project.slug}`}
      className="hover-lift hover-arrow card-press pressable group flex flex-col overflow-hidden rounded-2xl border border-line bg-panel"
    >
      {cover && (
        <div className="relative aspect-[5/4] overflow-hidden border-b border-line bg-bg">
          <Image
            src={cover.src}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
            className="size-full object-cover object-top"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2.5">
          <ProjectIcon project={project} size={28} />
          <h3 className="font-display text-xl tracking-tight">{project.name}</h3>
          <StatusBadge status={project.status} className="ml-auto shrink-0" />
        </div>

        <p className="mt-3 text-[15px] leading-snug text-muted">{project.tagline}</p>

        <ul className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-5">
          {project.stack.slice(0, 3).map((item) => (
            <li key={item} className="font-mono text-[11px] text-faint">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
