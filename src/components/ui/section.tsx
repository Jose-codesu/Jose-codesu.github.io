import Link from 'next/link';
import { ArrowRight } from './arrow';
import { cn } from '@/lib/cn';

export function Section({
  eyebrow,
  title,
  description,
  href,
  hrefLabel = 'View all',
  children,
  className,
}: {
  eyebrow: string;
  title?: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('mt-24 sm:mt-32', className)}>
      <div className="flex items-baseline justify-between gap-6 border-b border-line pb-4">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          {title && <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">{title}</h2>}
          {description && <p className="mt-2 max-w-xl text-[15px] text-muted">{description}</p>}
        </div>

        {href && (
          <Link
            href={href}
            className="hover-arrow group inline-flex shrink-0 items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-fg"
          >
            {hrefLabel}
            <ArrowRight />
          </Link>
        )}
      </div>

      {children}
    </section>
  );
}
