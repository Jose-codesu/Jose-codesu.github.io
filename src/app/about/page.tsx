import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Reveal } from '@/components/reveal';
import { ExperienceList } from '@/components/experience-list';
import { LogList } from '@/components/log-list';
import { ButtonLink } from '@/components/ui/button';
import { CopyEmail } from '@/components/copy-email';
import { ArrowUpRight } from '@/components/ui/arrow';
import { site } from '@/content/site';
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
    body: 'A model call is not a product. The work I care about includes the interface around it, the storage under it, the failure states, the release, and the privacy policy — because that is where a demo either becomes something usable or does not.',
  },
  {
    title: 'Constrain the model, then let it write',
    body: 'Generation belongs where prose is genuinely the deliverable. Everything a system must be right about — codes, totals, dates, records — gets deterministic checks. The interesting engineering is drawing that line correctly.',
  },
  {
    title: 'Be honest about confidence',
    body: 'An estimate should look like an estimate in the interface. Presenting a guess with the same authority as a verified lookup is a design decision, and it is the wrong one.',
  },
  {
    title: 'Put the logic where it can be tested',
    body: 'Streak rules, audit checks, similarity scoring — pull them into pure functions that run without a simulator or a server, and the tests take seconds instead of minutes. Slow tests do not get run.',
  },
  {
    title: 'Write it down',
    body: 'Every project I build has a document explaining what it is and which decisions define it, dated. It is how I keep a product coherent while working alone, and how I hand context to anyone — or any agent — who joins later.',
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
              Between shifts I design and build software — currently three products, all of them
              solo, all of them shipped or in review rather than sitting in a folder.
            </p>
            <p>
              The path here was not a straight line. I spent two years running production at a
              cabinet shop, operating CNC and thermofoil machines, where a wrong number does not
              throw an exception — it ruins the material. Then four years in mobile retail:
              diagnosing device and account problems all day, explaining technical things to people
              who did not ask for a technical answer, and leading teams through it.
            </p>
            <p>
              In January 2025 I finished the{' '}
              <strong>Google Cybersecurity Professional Certificate</strong>, which is where Linux,
              SQL, networking and Python automation stopped being words and started being tools.
              Since then the work has been continuous: an agent-driven iOS food journal, a
              local-first habit tracker with a Watch app and widgets, and a compliance-focused notes
              tool for behavior therapy clinics.
            </p>
            <p>
              What I am after now is an <strong>AI engineering role</strong> where the whole loop is
              on the table — model behavior, product decisions, and the code that carries both.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href={site.resumePath} external variant="outline" size="sm">
              Download résumé
              <ArrowUpRight className="opacity-60" />
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
        title="The running record"
        description="Dated entries, added as things happen."
      >
        <LogList entries={sortedLog} />
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
