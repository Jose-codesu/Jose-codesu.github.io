'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { nav, site } from '@/content/site';
import { ThemeToggle } from './theme-toggle';
import { CommandPalette } from './command-palette';
import { cn } from '@/lib/cn';

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-colors duration-200 print:hidden',
        scrolled ? 'border-line bg-bg/80 backdrop-blur-md' : 'border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-4 px-5 sm:px-8">
        <Link
          href="/"
          className="pressable group -ml-1 flex shrink-0 items-center gap-2.5 rounded-md px-1 py-1"
        >
          <span
            aria-hidden
            className="grid size-7 place-items-center rounded-md border border-line-strong font-display text-[15px] leading-none"
          >
            J
          </span>
          <span className="hidden text-[14px] font-medium tracking-tight sm:block">{site.name}</span>
        </Link>

        <nav className="flex items-center" aria-label="Main">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative rounded-full px-3 py-1.5 text-[13px] transition-colors duration-150',
                  active ? 'text-fg' : 'text-muted hover:text-fg',
                )}
              >
                {active && (
                  /* One element that morphs between items instead of three that
                     fade — the movement is what tells you where you came from.
                     Spring, so an impatient double-click reverses smoothly. */
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-accent-soft"
                    transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <CommandPalette />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
