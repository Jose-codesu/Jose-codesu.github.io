import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { ProjectGallery } from '@/components/project-gallery';
import { ProjectIcon } from '@/components/project-icon';
import { Reveal } from '@/components/reveal';
import { StatusBadge } from '@/components/ui/status-badge';
import { ButtonLink } from '@/components/ui/button';
import { ArrowRight, ArrowUpRight } from '@/components/ui/arrow';
import { getProject, visibleProjects } from '@/content/projects';
import { site } from '@/content/site';
import { caseStudyMinutes } from '@/lib/case-study-length';

type Params = { slug: string };

/** Static export needs every route enumerated at build time. */
export function generateStaticParams(): Params[] {
  return visibleProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: `${site.url}/work/${project.slug}/` },
    openGraph: {
      title: `${project.name} — ${site.name}`,
      description: project.summary,
      type: 'article',
      // Generated per project by scripts/generate-og.mjs.
      images: [{ url: `/og/work-${project.slug}.png`, width: 1200, height: 630, alt: project.tagline }],
    },
    twitter: { card: 'summary_large_image', images: [`/og/work-${project.slug}.png`] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = visibleProjects.findIndex((item) => item.slug === project.slug);
  const next = visibleProjects[(index + 1) % visibleProjects.length];

  return (
    <Container as="article">
      <header className="pt-12 pb-10 sm:pt-20">
        <Reveal>
          <Link
            href="/work"
            className="hover-arrow inline-flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-fg"
          >
            <ArrowRight className="rotate-180" />
            All work
          </Link>
        </Reveal>

        <Reveal delay={50}>
          <div className="mt-8 flex items-center gap-4">
            <span className="font-mono text-[12px] text-faint">{project.year}</span>
            <StatusBadge status={project.status} />
          </div>

          <div className="mt-4 flex items-center gap-4">
            <ProjectIcon project={project} size={56} />
            <h1 className="font-display text-[clamp(2.75rem,8vw,4.5rem)] leading-[0.98] tracking-tight">
              {project.name}
            </h1>
          </div>
          <p className="mt-3 max-w-2xl text-[19px] leading-snug text-muted">{project.tagline}</p>
        </Reveal>

        <Reveal delay={100}>
          <p className="mt-8 max-w-2xl text-[17px] leading-relaxed">{project.summary}</p>
        </Reveal>

        {project.atAGlance && (
          <Reveal delay={140}>
            <ul className="mt-8 max-w-2xl space-y-3 border-l-2 border-accent/40 pl-5">
              {project.atAGlance.map((line) => (
                <li key={line} className="text-[15px] leading-relaxed text-muted">
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {project.links && project.links.length > 0 && (
          <Reveal delay={140} className="mt-8 flex flex-wrap gap-3">
            {project.links.map((link) => (
              <ButtonLink key={link.href} href={link.href} external variant="outline" size="sm">
                {link.label}
                <ArrowUpRight className="opacity-60" />
              </ButtonLink>
            ))}
          </Reveal>
        )}
      </header>

      {/* ---- Screens -------------------------------------------------------
          Placed before the write-up on purpose: a reader deciding whether to
          spend three minutes here should see the product first.            */}
      {project.media && project.media.length > 0 && (
        <Reveal className="mb-14">
          <ProjectGallery media={project.media} />
          {project.mediaNote && (
            <p className="mt-6 max-w-2xl text-[13px] leading-relaxed text-faint">
              {project.mediaNote}
            </p>
          )}
        </Reveal>
      )}

      {project.demo && (
        <Reveal className="mb-14">
          <Link
            href={project.demo.href}
            className="hover-lift hover-arrow card-press pressable flex flex-col gap-4 rounded-2xl border border-line bg-panel px-6 py-7 hover:border-line-strong sm:flex-row sm:items-center sm:gap-8 sm:px-8"
          >
            <div>
              <p className="eyebrow">Try it yourself</p>
              <p className="mt-2 font-display text-2xl tracking-tight">{project.demo.label}</p>
            </div>
            <p className="max-w-md text-[14px] leading-relaxed text-muted sm:ml-auto">
              {project.demo.body}
            </p>
            <ArrowRight className="hidden size-5 shrink-0 text-muted sm:block" />
          </Link>
        </Reveal>
      )}

      {project.metrics && (
        <Reveal>
          <dl className="grid gap-8 border-y border-line py-10 sm:grid-cols-3">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="sr-only">{metric.label}</dt>
                <dd className="font-display text-[2.5rem] leading-none tracking-tight">
                  {metric.value}
                </dd>
                <dd className="mt-2 max-w-[24ch] text-[13px] leading-snug text-muted">
                  {metric.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      )}

      {/* ---- The fold ------------------------------------------------------
          Everything above answers "what is it". Everything below is for the
          reader who has already decided they care, and it says so.        */}
      <Reveal className="mt-20 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line pb-4">
        <h2 className="font-display text-2xl tracking-tight">The long version</h2>
        <p className="font-mono text-[11px] tracking-wide text-faint uppercase">
          {caseStudyMinutes(project)} min · how it was built and why
        </p>
      </Reveal>

      <Reveal>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-b border-line py-8 sm:grid-cols-4">
          <Meta label="Role" value={project.role} />
          <Meta label="Platform" value={project.platform} />
          <Meta label="Year" value={project.year} />
          <Meta label="Stack" value={`${project.stack.length} technologies`} />
        </dl>
      </Reveal>

      <div className="mt-16 space-y-16">
        {project.problem && (
          <Prose eyebrow="01" title="The problem">
            {project.problem.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Prose>
        )}

        {project.approach && (
          <section className="grid gap-x-12 gap-y-6 sm:grid-cols-[7rem_1fr]">
            <Reveal>
              <p className="eyebrow sm:pt-2">02</p>
              <h2 className="mt-2 font-display text-2xl tracking-tight sm:hidden">The approach</h2>
            </Reveal>
            <div>
              <Reveal>
                <h2 className="hidden font-display text-3xl tracking-tight sm:block">The approach</h2>
              </Reveal>
              <ol className="mt-6 divide-y divide-line border-t border-line">
                {project.approach.map((item, itemIndex) => (
                  <Reveal
                    as="li"
                    key={item}
                    delay={Math.min(itemIndex * 40, 200)}
                    className="grid grid-cols-[2.5rem_1fr] gap-4 py-5"
                  >
                    <span className="font-mono text-[12px] text-faint">
                      {String(itemIndex + 1).padStart(2, '0')}
                    </span>
                    <p className="max-w-2xl text-[16px] leading-relaxed text-fg/90">{item}</p>
                  </Reveal>
                ))}
              </ol>
            </div>
          </section>
        )}

        {project.outcome && (
          <Prose eyebrow="03" title="Where it stands">
            {project.outcome.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Prose>
        )}

        {project.notes && project.notes.length > 0 && (
          <section className="grid gap-x-12 gap-y-6 sm:grid-cols-[7rem_1fr]">
            <Reveal>
              <p className="eyebrow sm:pt-2">04</p>
            </Reveal>
            <div>
              <Reveal>
                <h2 className="font-display text-3xl tracking-tight">Engineering notes</h2>
                <p className="mt-3 max-w-2xl text-[15px] text-muted">
                  The decisions that took the longest to get right.
                </p>
              </Reveal>

              <div className="mt-8">
                {project.notes.map((note) => (
                  /* Closed by default: three of these turn a page into a wall.
                     The summary line is the whole finding, so the collapsed
                     state still reads as content rather than as a mystery. */
                  <details key={note.title} className="group border-t border-line py-5">
                    <summary className="flex cursor-pointer list-none items-center gap-3 text-[17px] font-medium tracking-tight [&::-webkit-details-marker]:hidden">
                      <span
                        aria-hidden
                        className="grid size-5 shrink-0 place-items-center rounded-full border border-line text-[11px] text-muted transition-transform duration-200 group-open:rotate-45"
                      >
                        +
                      </span>
                      {note.title}
                    </summary>
                    <div className="mt-4 space-y-4 pl-8">
                      {note.body.map((paragraph) => (
                        <p key={paragraph} className="max-w-2xl text-[16px] leading-relaxed text-muted">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {project.disclosure && (
          <Reveal className="rounded-xl border border-line bg-panel px-6 py-6">
            <p className="eyebrow">Disclosure</p>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
              {project.disclosure}
            </p>
          </Reveal>
        )}

        <Reveal className="border-t border-line pt-8">
          <p className="eyebrow">Full stack</p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {project.stack.map((item) => (
              <li key={item} className="font-mono text-[12px] text-muted">
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* ---- Next project --------------------------------------------------- */}
      {next && next.slug !== project.slug && (
        <Link
          href={`/work/${next.slug}`}
          className="hover-lift hover-arrow card-press pressable mt-24 flex items-center justify-between gap-6 rounded-2xl border border-line px-6 py-8 hover:bg-panel sm:px-10"
        >
          <div>
            <p className="eyebrow">Next project</p>
            <p className="mt-2 font-display text-3xl tracking-tight">{next.name}</p>
            <p className="mt-1 text-[15px] text-muted">{next.tagline}</p>
          </div>
          <ArrowRight className="size-5 shrink-0 text-muted" />
        </Link>
      )}
    </Container>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-2 text-[14px] leading-snug">{value}</dd>
    </div>
  );
}

function Prose({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-x-12 gap-y-6 sm:grid-cols-[7rem_1fr]">
      <Reveal>
        <p className="eyebrow sm:pt-2">{eyebrow}</p>
      </Reveal>
      <div>
        <Reveal>
          <h2 className="font-display text-3xl tracking-tight">{title}</h2>
        </Reveal>
        <Reveal delay={40}>
          <div className="mt-5 space-y-4 [&>p]:max-w-2xl [&>p]:text-[16px] [&>p]:leading-relaxed [&>p]:text-muted">
            {children}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
