import Link from 'next/link';
import { Fragment } from 'react';

/**
 * Renders `inline code`, **emphasis** and [links](/somewhere) from a string.
 *
 * Two patterns, no markdown parser and no MDX toolchain — the cost of a real
 * one is not worth it until the writing needs more than this.
 */
const PATTERN = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(PATTERN).map((part, index) => {
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          return (
            <code
              key={index}
              className="rounded border border-line bg-panel px-1.5 py-0.5 font-mono text-[0.86em] text-fg"
            >
              {part.slice(1, -1)}
            </code>
          );
        }

        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          return (
            <strong key={index} className="font-medium text-fg">
              {part.slice(2, -2)}
            </strong>
          );
        }

        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (link) {
          const [, label, href] = link;
          const external = href.startsWith('http');

          return external ? (
            <a
              key={index}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="link-underline"
            >
              {label}
            </a>
          ) : (
            <Link key={index} href={href} className="link-underline">
              {label}
            </Link>
          );
        }

        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}
