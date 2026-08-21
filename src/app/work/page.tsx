import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { ProjectCard } from '@/components/project-card';
import { Reveal } from '@/components/reveal';
import { visibleProjects } from '@/content/projects';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Products built end to end: an agent-driven iOS food journal, a local-first habit tracker with a Watch app, and a compliance-focused notes tool for behavior therapy clinics.',
};

export default function WorkPage() {
  return (
    <Container>
      <header className="border-b border-line pt-14 pb-10 sm:pt-24">
        <Reveal>
          <p className="eyebrow">Work</p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.5rem,7vw,4.25rem)] leading-[1] tracking-tight">
            Everything I have built, with the reasoning left in.
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted">
            Each case study covers the problem, the decisions that shaped the product, and what
            actually shipped — including the parts that were harder than expected.
          </p>
        </Reveal>
      </header>

      <div className="divide-y divide-line">
        {visibleProjects.map((project, index) => (
          <Reveal key={project.slug} delay={index * 50}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
