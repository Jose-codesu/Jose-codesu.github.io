import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { ProjectCard } from '@/components/project-card';
import { LogList } from '@/components/log-list';
import { StackGrid } from '@/components/stack-grid';
import { Reveal } from '@/components/reveal';
import { Emphasis } from '@/components/emphasis';
import { RichText } from '@/components/rich-text';
import { ButtonLink } from '@/components/ui/button';
import { CopyEmail } from '@/components/copy-email';
import { ArrowRight, ArrowUpRight } from '@/components/ui/arrow';
import { site } from '@/content/site';
import { featuredProjects } from '@/content/projects';
import { sortedLog } from '@/content/log';
import { publishedNotes } from '@/content/notes';
import { visibleCertifications, education } from '@/content/credentials';
import { longDate, monthYear } from '@/lib/format';

export default function HomePage() {
  const certification = visibleCertifications[0];

  return (
    <Container>
      {/* ---- Hero ---------------------------------------------------------
          The only place on the site with a stagger. Three lines, 60ms apart:
          long enough to read as a cascade, short enough that the page is
          readable before you notice it happened.                          */}
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
          <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-muted">{site.intro}</p>
        </Reveal>

        <Reveal delay={180} className="mt-9 flex flex-wrap items-center gap-3">
          <ButtonLink href="/work">
            View the work
            <ArrowRight />
          </ButtonLink>
          <ButtonLink href={site.resumePath} external variant="outline">
            Résumé
            <ArrowUpRight className="opacity-60" />
          </ButtonLink>
          <CopyEmail />
        </Reveal>

        <Reveal delay={240}>
          <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-4">
            {[
              { label: 'Studying', value: 'BS Applied AI', note: 'Miami Dade College' },
              { label: 'Certified', value: 'Google Cybersecurity', note: 'Jan 2025' },
              { label: 'Shipping', value: '3 products', note: 'iOS & web, solo' },
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
      </section>

      {/* ---- Selected work ---------------------------------------------- */}
      <Section
        eyebrow="Selected work"
        title="Three products, built solo"
        description="Each one shipped end to end: the product decision, the model work, the interface, and the release."
        href="/work"
        hrefLabel="All work"
      >
        <div className="mt-2 divide-y divide-line">
          {featuredProjects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 50}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---- Log --------------------------------------------------------- */}
      <Section
        eyebrow="Log"
        title="What I am working on"
        description="A dated record instead of a claim. Updated as things actually happen."
        href="/about"
        hrefLabel="About me"
      >
        <LogList entries={sortedLog.slice(0, 3)} />
      </Section>

      {/* ---- Notes --------------------------------------------------------
          Only rendered once something is published — see content/notes.ts. */}
      {publishedNotes.length > 0 && (
        <Section
          eyebrow="Notes"
          title="Things worth writing down"
          description="Write-ups on the problems that took the longest to solve."
          href="/notes"
          hrefLabel="All notes"
        >
          <ul className="mt-2">
            {publishedNotes.slice(0, 2).map((note, index) => (
              <Reveal as="li" key={note.slug} delay={index * 50} className="border-b border-line">
                <Link
                  href={`/notes/${note.slug}`}
                  className="hover-lift hover-arrow card-press pressable -mx-4 grid gap-x-8 gap-y-2 rounded-xl border border-transparent px-4 py-7 hover:border-line hover:bg-panel sm:grid-cols-[9rem_1fr]"
                >
                  <time dateTime={note.date} className="font-mono text-[12px] text-faint">
                    {longDate(note.date)}
                  </time>
                  <div>
                    <h3 className="text-[17px] font-medium tracking-tight">{note.title}</h3>
                    <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-muted">
                      <RichText text={note.summary} />
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      {/* ---- Credentials ------------------------------------------------- */}
      <Section
        eyebrow="Credentials"
        title="Education and certificates"
        href="/credentials"
        hrefLabel="All credentials"
      >
        <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {certification && (
            <Reveal>
              <p className="eyebrow">{monthYear(certification.issued ?? '2025-01-01')}</p>
              <h3 className="mt-2 text-[17px] font-medium tracking-tight">{certification.name}</h3>
              <p className="mt-1 text-[14px] text-muted">{certification.issuer}</p>
              <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted">
                {certification.summary}
              </p>
              <Link
                href="/credentials"
                className="hover-arrow mt-4 inline-flex items-center gap-1.5 text-[13px] link-underline"
              >
                Credential ID {certification.credentialId}
                <ArrowRight />
              </Link>
            </Reveal>
          )}

          <Reveal delay={60}>
            <p className="eyebrow">In progress</p>
            <ul className="mt-2 space-y-5">
              {education.map((item) => (
                <li key={item.credential}>
                  <h3 className="text-[17px] font-medium tracking-tight">{item.credential}</h3>
                  <p className="mt-1 text-[14px] text-muted">{item.school}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* ---- Stack ------------------------------------------------------- */}
      <Section
        eyebrow="Toolkit"
        title="What I work with"
        description="Self-assessed and deliberately conservative: “learning” means studying it, not shipping with it yet."
      >
        <StackGrid />
      </Section>

      {/* ---- Contact ----------------------------------------------------- */}
      <section className="mt-28 rounded-2xl border border-line bg-panel px-6 py-12 sm:px-12 sm:py-16">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            Building something with agents? I would like to hear about it.
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
            I am looking for AI engineering internships and junior roles where I can keep shipping —
            and I answer every email.
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
