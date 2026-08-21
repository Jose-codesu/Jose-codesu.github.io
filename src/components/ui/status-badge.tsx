import { cn } from '@/lib/cn';
import type { Status } from '@/content/types';

const LABEL: Record<Status, string> = {
  shipped: 'Shipped',
  'in-review': 'In App Store review',
  beta: 'In beta',
  building: 'In development',
  research: 'Research',
};

/** Live states get the accent dot; everything else stays neutral so the page
 *  does not turn into a christmas tree of colored pills. */
const LIVE: Status[] = ['shipped', 'beta', 'in-review'];

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const live = LIVE.includes(status);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-muted uppercase',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn('size-1.5 rounded-full', live ? 'bg-accent' : 'bg-faint')}
      />
      {LABEL[status]}
    </span>
  );
}
