'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Media } from '@/content/types';
import { cn } from '@/lib/cn';

/**
 * Screenshots, with a lightbox for reading them at full size.
 *
 * Built on the native <dialog>: focus trapping, Escape, inert background and
 * the top layer come from the platform, so the only things left to implement
 * are arrow-key navigation and the enter transition (see globals.css).
 */
export function ProjectGallery({ media }: { media: Media[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const close = useCallback(() => {
    dialogRef.current?.close();
    setOpenIndex(null);
  }, []);

  const open = useCallback((index: number) => {
    setOpenIndex(index);
    dialogRef.current?.showModal();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) =>
        current === null ? current : (current + delta + media.length) % media.length,
      );
    },
    [media.length],
  );

  useEffect(() => {
    if (openIndex === null) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        step(1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        step(-1);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [openIndex, step]);

  const phones = media.filter((item) => item.kind === 'phone');
  const wide = media.filter((item) => item.kind === 'wide');
  const active = openIndex === null ? null : media[openIndex];

  return (
    <>
      {phones.length > 0 && (
        <ul
          // Bleeds to the viewport edge on small screens so the last shot is
          // visibly cut off — that is the affordance that says "scrollable".
          className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {phones.map((item) => (
            <li key={item.src} className="snap-start">
              <Thumb item={item} onOpen={() => open(media.indexOf(item))} className="w-[168px] sm:w-[188px]" />
            </li>
          ))}
        </ul>
      )}

      {wide.length > 0 && (
        <ul className={cn('grid gap-8', phones.length > 0 && 'mt-8')}>
          {wide.map((item) => (
            <li key={item.src}>
              <Thumb item={item} onOpen={() => open(media.indexOf(item))} className="w-full" />
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialogRef}
        // `close` also fires on Escape and on the backdrop click below.
        onClose={() => setOpenIndex(null)}
        onClick={(event) => {
          // Clicks land on the dialog element itself only when they hit the
          // backdrop; anything inside stops at the figure.
          if (event.target === dialogRef.current) close();
        }}
        className="lightbox m-auto max-h-[92vh] max-w-[min(94vw,1200px)] overflow-visible bg-transparent p-0 text-fg backdrop:bg-black/80 backdrop:backdrop-blur-[3px]"
        aria-label="Screenshot viewer"
      >
        {active && (
          <figure className="flex max-h-[92vh] flex-col items-center gap-4">
            <Image
              src={active.src}
              alt={active.alt}
              width={active.width}
              height={active.height}
              className="max-h-[80vh] w-auto rounded-2xl border border-white/10 object-contain shadow-2xl"
            />
            <figcaption className="flex max-w-xl flex-col items-center gap-3 text-center">
              {active.caption && <p className="text-[14px] text-white/80">{active.caption}</p>}
              {media.length > 1 && (
                <p className="font-mono text-[11px] text-white/45">
                  {(openIndex ?? 0) + 1} / {media.length} · ← → to move · Esc to close
                </p>
              )}
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}

function Thumb({
  item,
  onOpen,
  className,
}: {
  item: Media;
  onOpen: () => void;
  className?: string;
}) {
  return (
    <figure className={className}>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open larger: ${item.alt}`}
        className="pressable group block w-full overflow-hidden rounded-[1.6rem] border border-line bg-panel"
      >
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          sizes="(max-width: 640px) 60vw, 400px"
          className="h-auto w-full"
        />
      </button>
      {item.caption && (
        <figcaption className="mt-3 text-[13px] leading-snug text-muted">{item.caption}</figcaption>
      )}
    </figure>
  );
}
