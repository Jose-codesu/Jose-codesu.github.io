import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Reveal } from '@/components/reveal';
import { ExperienceList } from '@/components/experience-list';
import { LogList } from '@/components/log-list';
import { ButtonLink } from '@/components/ui/button';
import { CopyEmail } from '@/components/copy-email';
import { sortedLog } from '@/content/log';

export const metadata: Metadata = {
  title: 'About',
  description:
    'How a retail manager in Miami became an AI engineer: the path, the working principles, and the full professional history.',
};

/** The working principles. Each one is visible in the case studies — that is
 *  the test for whether it belongs here. */
const principles = [
  {
    title: 'Ship the whole thing',
    body: 'A model call is not a product. The work includes the interface around it, the storage under it, the failure states and the release — that is where a demo either becomes usable or does not.',
  },
  {
    title: 'Constrain the model, then let it write',
    body: 'Generation belongs where prose is the deliverable. Everything a system must be right about — codes, totals, records — gets deterministic checks. The engineering is drawing that line.',
  },
  {
    title: 'Be honest about confidence',
    body: 'An estimate should look like an estimate, and a metric that cannot know an answer should say so. Dressing a guess as a measurement is a decision, and it is the wrong one.',
  },
];

export default function AboutPage() {
  return (
    <Container>
      <header className="border-b border-line pt-14 pb-10 sm:pt-24">
        <Reveal>
          <p className="eyebrow">About</p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.5rem,7vw,4.25rem)] leading-[1] tracking-tight">
            Miami. Applied AI student by day, building products the rest of the time.
          </h1>
        </Reveal>
      </header>

      <section className="mt-14 grid gap-x-12 gap-y-8 sm:grid-cols-[7rem_1fr]">
        <Reveal>
          <p className="eyebrow sm:pt-2">Bio</p>
        </Reveal>
        <Reveal delay={40}>
          <div className="space-y-5 text-[17px] leading-relaxed text-muted [&>p>strong]:font-medium [&>p>strong]:text-fg">
            <p>
              I run a mobile technology store in Davie, Florida, and I am an{' '}
              <strong>Applied Artificial Intelligence undergraduate at Miami Dade College</strong>.
              Between shifts I build software — three products so far, all solo, all shipped or in
              review rather than sitting in a folder.
            </p>
            <p>
              The path was not straight. Two years running production at a cabinet shop on CNC
              machines, where a wrong number does not throw an exception, it ruins the material.
              Then four years in mobile retail, diagnosing device problems all day and explaining
              technical things to people who did not ask for a technical answer.
            </p>
            <p>
              The <strong>Google Cybersecurity Professional Certificate</strong> in January 2025 is
              where Linux, SQL and Python stopped being words and became tools. What I want now is
              an <strong>AI engineering role</strong> where the whole loop is on the table — model
              behaviour, product decisions, and the code that carries both.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/resume" variant="outline" size="sm">
              Résumé
            </ButtonLink>
            <ButtonLink href="/credentials" variant="outline" size="sm">
              Credentials
            </ButtonLink>
            <CopyEmail />
          </div>
        </Reveal>
      </section>

      <Section eyebrow="Principles" title="How I work">
        <ol className="mt-2 divide-y divide-line">
          {principles.map((principle, index) => (
            <Reveal
              as="li"
              key={principle.title}
              delay={Math.min(index * 40, 160)}
              className="grid gap-x-10 gap-y-2 py-7 sm:grid-cols-[3rem_1fr]"
            >
              <span className="font-mono text-[12px] text-faint">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-[17px] font-medium tracking-tight">{principle.title}</h3>
                <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-muted">
                  {principle.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section
        eyebrow="Experience"
        title="Professional history"
        description="Four years of managing operations and teams — and the parts of it that carried straight into engineering."
      >
        <ExperienceList />
      </Section>

      <Section
        eyebrow="Log"
        title="Recently"
        description="Dated entries, added as things happen."
      >
        <LogList entries={sortedLog.slice(0, 4)} />
      </Section>

      <section className="mt-24 rounded-2xl border border-line bg-panel px-6 py-12 sm:px-12">
        <Reveal>
          <p className="eyebrow">Languages</p>
          <p className="mt-3 max-w-2xl font-display text-2xl leading-snug tracking-tight sm:text-3xl">
            Native Spanish, advanced English — I do technical work in both, and I have spent four
            years translating between technical and non-technical for a living.
          </p>
        </Reveal>
      </section>
    </Container>
  );
}
