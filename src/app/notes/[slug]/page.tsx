import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/reveal';
import { RichText } from '@/components/rich-text';
import { ArrowRight } from '@/components/ui/arrow';
import { getNote, publishedNotes } from '@/content/notes';
import { site } from '@/content/site';
import { longDate } from '@/lib/format';
import type { NoteBlock } from '@/content/types';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return publishedNotes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return {};

  return {
    title: note.title,
    description: note.summary,
    alternates: { canonical: `${site.url}/notes/${note.slug}/` },
    openGraph: {
      type: 'article',
      title: note.title,
      description: note.summary,
      publishedTime: note.date,
    },
  };
}

export default async function NotePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();

  return (
    <Container as="article" className="max-w-3xl">
      <header className="pt-12 pb-10 sm:pt-20">
        <Reveal>
          <Link
            href="/notes"
            className="hover-arrow inline-flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-fg"
          >
            <ArrowRight className="rotate-180" />
            All notes
          </Link>
        </Reveal>

        <Reveal delay={50}>
          <time dateTime={note.date} className="mt-8 block font-mono text-[12px] text-faint">
            {longDate(note.date)}
          </time>
          <h1 className="mt-3 font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.02] tracking-tight text-balance">
            {note.title}
          </h1>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted">
            <RichText text={note.summary} />
          </p>
        </Reveal>
      </header>

      <div className="border-t border-line pt-10 pb-4">
        {note.body.map((block, index) => (
          <Block key={index} block={block} />
        ))}
      </div>
    </Container>
  );
}

function Block({ block }: { block: NoteBlock }) {
  switch (block.type) {
    case 'h2':
      return <h2 className="mt-12 mb-4 font-display text-2xl tracking-tight">{block.text}</h2>;


    case 'quote':
      return (
        <blockquote className="my-8 border-l-2 border-accent/40 pl-5 font-display text-xl leading-snug">
          <RichText text={block.text} />
        </blockquote>
      );

    case 'list':
      return (
        <ul className="my-5 space-y-2">
          {block.items.map((item) => (
            <li
              key={item}
              className="relative pl-5 text-[17px] leading-relaxed text-muted before:absolute before:top-[0.7em] before:left-0 before:size-1 before:rounded-full before:bg-faint"
            >
              <RichText text={item} />
            </li>
          ))}
        </ul>
      );

    case 'code':
      return (
        <pre className="my-6 overflow-x-auto rounded-xl border border-line bg-panel p-5 font-mono text-[13px] leading-relaxed">
          <code>{block.code}</code>
        </pre>
      );

    default:
      return (
        <p className="my-5 text-[17px] leading-relaxed text-muted">
          <RichText text={block.text} />
        </p>
      );
  }
}
