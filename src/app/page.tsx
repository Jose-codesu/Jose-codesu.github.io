import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { ProjectRow } from '@/components/project-row';
import { Reveal } from '@/components/reveal';
import { Emphasis } from '@/components/emphasis';
import { ButtonLink } from '@/components/ui/button';
import { CopyEmail } from '@/components/copy-email';
import { ArrowRight, ArrowUpRight } from '@/components/ui/arrow';
import { site } from '@/content/site';
import { featuredProjects } from '@/content/projects';

/**
 * The home page is a sixty-second read on purpose.
 *
 * Everything here answers one of three questions — who is this, what has he
 * built, how do I reach him — and every deeper thing (case studies, notes,
 * credentials, the résumé) is one click away rather than in the way.
 */
export default function HomePage() {
  return (
    <Container>
      {/* ---- Hero -------------------------------------------------------- */}
      <section className="pt-14 pb-4 sm:pt-24">
        <Reveal className="flex items-center gap-2.5">
          {site.availability.open && (
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 [animation-duration:2.4s]" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
          )}
          <p className="eyebrow">
            {site.location} · {site.availability.text}
          </p>
        </Reveal>

        <Reveal delay={60}>
          <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.75rem,8vw,5rem)] leading-[0.98] tracking-tight text-balance">
            <Emphasis text={site.headline} />
          </h1>
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-muted">{site.intro}</p>
        </Reveal>

        <Reveal delay={180} className="mt-9 flex flex-wrap items-center gap-3">
          <ButtonLink href="/work">
            See the work
            <ArrowRight />
          </ButtonLink>
          <ButtonLink href="/resume" variant="outline">
            Résumé
          </ButtonLink>
          <CopyEmail />
        </Reveal>
      </section>

      {/* ---- Work: pictures first ---------------------------------------- */}
      <section className="mt-16 sm:mt-20">
        <div className="flex items-baseline justify-between gap-6 border-b border-line pb-4">
          <h2 className="eyebrow">Three products, built solo</h2>
          <Link
            href="/work"
            className="hover-arrow inline-flex shrink-0 items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-fg"
          >
            All work
            <ArrowRight />
          </Link>
        </div>

        <div className="mt-2 divide-y divide-line">
          {featuredProjects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 50}>
              <ProjectRow project={project} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- Try it ------------------------------------------------------- */}
      <section className="mt-16">
        <Reveal>
          <Link
            href="/lab"
            className="hover-lift hover-arrow card-press pressable flex flex-col gap-4 rounded-2xl border border-line px-6 py-7 hover:bg-panel sm:flex-row sm:items-center sm:gap-8 sm:px-8"
          >
            <div>
              <p className="eyebrow">Lab</p>
              <p className="mt-2 font-display text-2xl tracking-tight">
                Or skip the reading and run it
              </p>
            </div>
            <p className="max-w-md text-[15px] leading-relaxed text-muted sm:ml-auto">
              My eval bank with real measurements, and the clone detector from Notewell executing in
              your browser.
            </p>
            <ArrowRight className="hidden size-5 shrink-0 text-muted sm:block" />
          </Link>
        </Reveal>
      </section>

      {/* ---- Credentials, in one line ------------------------------------- */}
      <Reveal>
        <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-4">
          {[
            { label: 'Studying', value: 'BS Applied AI', note: 'Miami Dade College' },
            { label: 'Certified', value: 'Google Cybersecurity', note: 'Jan 2025' },
            { label: 'Writing', value: '5 technical notes', note: 'evals, agents, compliance' },
            { label: 'Languages', value: 'EN / ES', note: 'Native Spanish' },
          ].map((item) => (
            <div key={item.label}>
              <dt className="eyebrow">{item.label}</dt>
              <dd className="mt-2 text-[15px] font-medium tracking-tight">{item.value}</dd>
              <dd className="text-[13px] text-faint">{item.note}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {/* ---- Contact ------------------------------------------------------ */}
      <section className="mt-20 rounded-2xl border border-line bg-panel px-6 py-12 sm:px-12 sm:py-14">
        <Reveal>
          <h2 className="max-w-2xl font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            Building something with agents? I would like to hear about it.
          </h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
            Looking for AI engineering internships and junior roles — and I answer every email.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href={`mailto:${site.email}`} external>
              Email me
              <ArrowUpRight className="opacity-70" />
            </ButtonLink>
            <ButtonLink href={site.github} external variant="outline">
              GitHub
              <ArrowUpRight className="opacity-60" />
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </Container>
  );
}
