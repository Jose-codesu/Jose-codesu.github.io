import Link from 'next/link';
import { stack } from '@/content/stack';
import { projectsUsing } from '@/lib/evidence';
import { ProjectIcon } from './project-icon';
import { cn } from '@/lib/cn';

/**
 * Skills, each followed by the projects that prove it. A claim with a receipt
 * next to it reads differently from a list of words — and if nothing links to a
 * skill, that is a signal to go build something with it.
 */
export function StackGrid({ className }: { className?: string }) {
  return (
    <div className={cn('mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {stack.map((group) => (
        <div key={group.name}>
          <h3 className="eyebrow">{group.name}</h3>
          <ul className="mt-3 space-y-2">
            {group.items.map((item) => {
              const evidence = projectsUsing(item.name);

              return (
                <li key={item.name} className="flex items-center gap-2 text-[14px]">
                  <span className={item.level === 'working' ? 'text-fg' : 'text-muted'}>
                    {item.name}
                  </span>

                  {item.level === 'learning' && (
                    <span className="font-mono text-[10px] tracking-wide text-faint uppercase">
                      learning
                    </span>
                  )}

                  {evidence.length > 0 && (
                    <span className="flex items-center gap-1">
                      {evidence.map((project) => (
                        <Link
                          key={project.slug}
                          href={`/work/${project.slug}`}
                          title={`Used in ${project.name}`}
                          aria-label={`Used in ${project.name}`}
                          className="pressable opacity-70 transition-opacity hover:opacity-100"
                        >
                          <ProjectIcon project={project} size={16} className="rounded-[26%]" />
                        </Link>
                      ))}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
