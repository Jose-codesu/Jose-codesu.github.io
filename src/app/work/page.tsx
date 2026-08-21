import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/reveal';
import { WorkList } from '@/components/work-list';
import { visibleProjects } from '@/content/projects';
import { stackFacets } from '@/lib/evidence';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Products built end to end: an agent-driven iOS food journal, a local-first habit tracker with a Watch app, and a compliance-focused notes tool for behavior therapy clinics.',
};

export default function WorkPage() {
  return (
    <Container>
      <header className="pt-14 pb-6 sm:pt-24">
        <Reveal>
          <p className="eyebrow">Work</p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.5rem,7vw,4.25rem)] leading-[1] tracking-tight">
            Three products, built solo.
          </h1>
          <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-muted">
            Pick one for the two-minute version, or filter by what it is built with.
          </p>
        </Reveal>
      </header>

      <WorkList projects={visibleProjects} facets={stackFacets()} />
    </Container>
  );
}
