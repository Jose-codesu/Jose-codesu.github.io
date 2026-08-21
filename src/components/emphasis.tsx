import { Fragment } from 'react';

/**
 * Renders `*emphasised*` spans from a content string as display italic, so
 * copy decisions stay in `src/content` instead of being hard-coded in JSX.
 */
export function Emphasis({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/g).map((part, index) =>
        part.startsWith('*') && part.endsWith('*') && part.length > 2 ? (
          <em key={index} className="text-accent italic">
            {part.slice(1, -1)}
          </em>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
