'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Fades content in as it enters the viewport, once.
 *
 * The animation itself is CSS (see globals.css) — this component only flips an
 * attribute. That keeps the motion off the main thread, so it stays smooth while
 * the rest of the page is still hydrating, and it means `prefers-reduced-motion`
 * is handled in one place instead of per component.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  /** Stagger between siblings. Keep it in the 30–80ms range. */
  delay?: number;
  className?: string;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Anything already on screen at mount should not wait for a scroll event.
    // The root reaches far above the viewport: a fast scroll or a jump can carry
    // content straight past the fold without it ever intersecting the viewport,
    // and an observer bounded by the viewport would leave it invisible for good.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100000px 0px -10% 0px', threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-visible={visible || undefined}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
