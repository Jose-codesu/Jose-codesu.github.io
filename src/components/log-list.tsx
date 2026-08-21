import { longDate } from '@/lib/format';
import type { LogEntry } from '@/content/types';
import { ArrowUpRight } from './ui/arrow';
import { Reveal } from './reveal';

const TAG_LABEL: Record<NonNullable<LogEntry['tag']>, string> = {
  ship: 'Shipped',
  learn: 'Learned',
  write: 'Wrote',
  milestone: 'Milestone',
};

export function LogList({ entries }: { entries: LogEntry[] }) {
  return (
    <ol className="mt-4">
      {entries.map((entry, index) => (
        <Reveal
          as="li"
          key={entry.date + entry.title}
          delay={index * 40}
          className="grid gap-x-8 gap-y-2 border-b border-line py-6 sm:grid-cols-[9rem_1fr]"
        >
          <div className="flex items-baseline gap-3 sm:block">
            <time dateTime={entry.date} className="font-mono text-[12px] text-faint">
              {longDate(entry.date)}
            </time>
            {entry.tag && (
              <p className="mt-1 font-mono text-[11px] tracking-wide text-accent uppercase">
                {TAG_LABEL[entry.tag]}
              </p>
            )}
          </div>

          <div>
            <h3 className="text-[16px] font-medium tracking-tight">
              {entry.href ? (
                <a
                  href={entry.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover-arrow inline-flex items-center gap-1 link-underline"
                >
                  {entry.title}
                  <ArrowUpRight className="opacity-60" />
                </a>
              ) : (
                entry.title
              )}
            </h3>
            <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-muted">{entry.body}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
