import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/reveal';
import { RichText } from '@/components/rich-text';
import { ArrowRight } from '@/components/ui/arrow';
import { publishedNotes } from '@/content/notes';
import { longDate } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Notes',
  description: 'Write-ups on AI engineering, iOS and the things that were harder than expected.',
};

export default function NotesPage() {
  // Nothing published yet — the route should not exist rather than render empty.
  if (publishedNotes.length === 0) notFound();

  return (
    <Container>
      <header className="border-b border-line pt-14 pb-10 sm:pt-24">
        <Reveal>
          <p className="eyebrow">Notes</p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.5rem,7vw,4.25rem)] leading-[1] tracking-tight">
            Things worth writing down.
          </h1>
        </Reveal>
      </header>

      <ol>
        {publishedNotes.map((note, index) => (
          <Reveal
            as="li"
            key={note.slug}
            delay={index * 50}
            className="border-b border-line"
          >
            <Link
              href={`/notes/${note.slug}`}
              className="hover-lift hover-arrow card-press pressable -mx-4 grid gap-x-10 gap-y-2 rounded-xl border border-transparent px-4 py-8 hover:border-line hover:bg-panel sm:grid-cols-[9rem_1fr]"
            >
              <time dateTime={note.date} className="font-mono text-[12px] text-faint">
                {longDate(note.date)}
              </time>
              <div>
                <h2 className="font-display text-2xl tracking-tight">{note.title}</h2>
                <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
                  <RichText text={note.summary} />
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px]">
                  Read
                  <ArrowRight />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </ol>
    </Container>
  );
}
