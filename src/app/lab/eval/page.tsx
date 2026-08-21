import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/reveal';
import { EvalExplorer } from '@/components/eval-explorer';
import { ArrowRight } from '@/components/ui/arrow';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'The eval bank',
  description:
    'Sixteen photos with known calories, thirteen runs across models and prompt versions — the real measurements behind Savor’s estimates, explorable.',
  alternates: { canonical: `${site.url}/lab/eval/` },
};

export default function EvalLabPage() {
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
          <p className="eyebrow mt-8">Savor · evals</p>
          <h1 className="mt-3 max-w-3xl font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.02] tracking-tight">
            Sixteen photos, thirteen runs, one honest number.
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted">
            Savor estimates the calories in a photo of a plate. To know whether that works I
            photographed food whose real values I can defend — brand labels, USDA entries with the
            food on a scale — and scored every model and prompt candidate against the same set.
            These are those measurements.
          </p>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
            Start with the checkbox on the right. Including three photos whose truth is itself an
            estimate is what made this benchmark lie to me for two weeks — the story is in{' '}
            <Link href="/notes/three-corrections-to-the-same-number" className="link-underline">
              three corrections to the same number
            </Link>
            .
          </p>
        </Reveal>
      </header>

      <Reveal>
        <EvalExplorer />
      </Reveal>

      <div className="mt-14 border-t border-line pt-8">
        <Link
          href="/work/savor"
          className="hover-arrow inline-flex items-center gap-1.5 text-[14px] link-underline"
        >
          Read the Savor case study
          <ArrowRight />
        </Link>
      </div>
    </Container>
  );
}
