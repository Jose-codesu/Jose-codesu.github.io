import Image from 'next/image';
import type { Project } from '@/content/types';
import { cn } from '@/lib/cn';

/**
 * App icon, or a monogram when a project does not have one. Both render at the
 * same size and radius so a row of projects stays visually even.
 * 22% is the iOS squircle ratio — a plain rounded square reads as "web icon".
 */
export function ProjectIcon({
  project,
  size = 44,
  className,
}: {
  project: Pick<Project, 'name' | 'icon'>;
  size?: number;
  className?: string;
}) {
  const shared = cn('shrink-0 rounded-[22%] border border-line', className);

  if (project.icon) {
    return (
      <Image
        src={project.icon}
        alt=""
        width={size}
        height={size}
        className={shared}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cn(shared, 'grid place-items-center bg-panel font-display')}
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      {project.name.charAt(0)}
    </span>
  );
}
