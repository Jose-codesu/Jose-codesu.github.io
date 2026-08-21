import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const button = cva(
  'pressable inline-flex items-center justify-center gap-2 rounded-full text-[14px] font-medium whitespace-nowrap',
  {
    variants: {
      variant: {
        primary: 'bg-fg text-bg hover:bg-fg/90',
        outline: 'border border-line text-fg hover:border-line-strong hover:bg-panel',
        ghost: 'text-muted hover:text-fg',
      },
      size: {
        md: 'h-10 px-5',
        sm: 'h-9 px-4 text-[13px]',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

type ButtonVariants = VariantProps<typeof button>;

export function ButtonLink({
  href,
  external,
  className,
  variant,
  size,
  children,
}: ButtonVariants & {
  href: string;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const classes = cn(button({ variant, size }), className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={cn(classes, 'hover-arrow')}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cn(classes, 'hover-arrow')}>
      {children}
    </Link>
  );
}

export { button as buttonVariants };
