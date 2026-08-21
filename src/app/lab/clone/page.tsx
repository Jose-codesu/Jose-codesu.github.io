import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/reveal';
import { CloneDemo } from '@/components/clone-demo';
import { ArrowRight } from '@/components/ui/arrow';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'The clone detector',
  description:
    'Notewell’s clone detection — Jaccard similarity over word trigrams — running live in your browser on two session notes you can edit.',
  alternates: { canonical: `${site.url}/lab/clone/` },
};

export default function CloneLabPage() {
  return (
    <Container>
      <header className="pt-12 pb-8 sm:pt-20">
        <Reveal>
          <Link
            href="/lab"
            className="hover-arrow inline-flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-fg"
          >
            <ArrowRight className="rotate-180" />
            Lab
          </Link>
        </Reveal>

        <Reveal delay={50}>
          <p className="eyebrow mt-8">Notewell · compliance</p>
          <h1 className="mt-3 max-w-3xl font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.02] tracking-tight">
            Find the cloned note before the auditor does.
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted">
            Cloned session notes are the first thing an audit looks for and the finding that turns a
            review into a recoupment. Notewell scores every note against the provider’s others
            before anyone signs. Edit either note below and the score updates as you type —
            this is the production function, executing on your machine.
          </p>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
            How it works, and the scoping bug that would have made it report zero, is in{' '}
            <Link href="/notes/catching-cloned-notes-with-trigrams" className="link-underline">
              catching cloned notes with trigrams
            </Link>
            .
          </p>
        </Reveal>
      </header>

      <Reveal>
        <CloneDemo />
      </Reveal>

      <div className="mt-14 border-t border-line pt-8">
        <Link
          href="/work/notewell"
          className="hover-arrow inline-flex items-center gap-1.5 text-[14px] link-underline"
        >
          Read the Notewell case study
          <ArrowRight />
        </Link>
      </div>
    </Container>
  );
}
