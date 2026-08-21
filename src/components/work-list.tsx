'use client';

import { useMemo, useState } from 'react';
import type { Project } from '@/content/types';
import { projectUsesSkill } from '@/lib/evidence';
import { ProjectTile } from './project-tile';
import { cn } from '@/lib/cn';

/**
 * The work index with a technology filter.
 *
 * Filtering is instant — no fade, no layout animation. This is a control people
 * click repeatedly to scan, and any transition would put a delay in front of
 * every click. Matching is normalized so "Next.js 16" answers to "Next.js".
 */
export function WorkList({
  projects,
  facets,
}: {
  projects: Project[];
  facets: { name: string; count: number }[];
}) {
  const [active, setActive] = useState<string | null>(null);

  const shown = useMemo(
    () => (active ? projects.filter((project) => projectUsesSkill(project, active)) : projects),
    [active, projects],
  );

  return (
    <>
      {facets.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 py-6">
          <Chip active={active === null} onClick={() => setActive(null)}>
            Everything
            <Count>{projects.length}</Count>
          </Chip>

          {facets.map((facet) => (
            <Chip
              key={facet.name}
              active={active === facet.name}
              onClick={() => setActive(active === facet.name ? null : facet.name)}
            >
              {facet.name}
              <Count>{facet.count}</Count>
            </Chip>
          ))}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((project, index) => (
          <ProjectTile key={project.slug} project={project} priority={index === 0} />
        ))}
      </div>

      {shown.length === 0 && (
        <p className="py-16 text-center text-[15px] text-muted">
          Nothing built with that yet.
        </p>
      )}
    </>
  );
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'pressable inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-[11px]',
        active
          ? 'border-transparent bg-fg text-bg'
          : 'border-line text-muted hover:border-line-strong hover:text-fg',
      )}
    >
      {children}
    </button>
  );
}

function Count({ children }: { children: React.ReactNode }) {
  return <span className="opacity-50">{children}</span>;
}
