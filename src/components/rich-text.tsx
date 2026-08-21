import { Fragment } from 'react';

/**
 * Renders `inline code` from a content string. Technical writing is unreadable
 * without it, and this is the smallest thing that works — no markdown parser,
 * no MDX toolchain, no runtime cost beyond a split.
 */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((part, index) =>
        part.startsWith('`') && part.endsWith('`') && part.length > 2 ? (
          <code
            key={index}
            className="rounded border border-line bg-panel px-1.5 py-0.5 font-mono text-[0.86em] text-fg"
          >
            {part.slice(1, -1)}
          </code>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
