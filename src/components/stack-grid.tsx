import { stack } from '@/content/stack';
import { cn } from '@/lib/cn';

export function StackGrid({ className }: { className?: string }) {
  return (
    <div className={cn('mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {stack.map((group) => (
        <div key={group.name}>
          <h3 className="eyebrow">{group.name}</h3>
          <ul className="mt-3 space-y-1.5">
            {group.items.map((item) => (
              <li key={item.name} className="flex items-baseline gap-2 text-[14px]">
                <span className={item.level === 'working' ? 'text-fg' : 'text-muted'}>{item.name}</span>
                {item.level === 'learning' && (
                  <span className="font-mono text-[10px] tracking-wide text-faint uppercase">
                    learning
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
