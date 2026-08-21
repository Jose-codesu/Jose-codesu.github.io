import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { PrintButton } from '@/components/print-button';
import { site } from '@/content/site';
import { roles } from '@/content/experience';
import { visibleCertifications, education } from '@/content/credentials';
import { stack } from '@/content/stack';
import { visibleProjects } from '@/content/projects';
import { dateRange, monthYear } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Résumé',
  description: `Résumé of ${site.name} — ${site.role} in ${site.location}. Experience, education, certifications and shipped work.`,
  alternates: { canonical: `${site.url}/resume/` },
};

/**
 * The résumé, generated from the same content as the rest of the site, so it
 * cannot drift out of date. Cmd+P produces a clean PDF: print rules in
 * globals.css drop the site chrome and switch to black on white.
 *
 * The phone number deliberately lives only in the downloadable PDF, not here —
 * a page this crawlable should not publish it.
 */
export default function ResumePage() {
  return (
    <Container className="max-w-3xl">
      <div className="flex items-start justify-between gap-6 pt-14 pb-8 sm:pt-20 print:hidden">
        <div>
          <p className="eyebrow">Résumé</p>
          <p className="mt-2 max-w-md text-[14px] leading-relaxed text-muted">
            Generated from the same content as the site, so it is never out of date. Print it or
            save it as a PDF.
          </p>
        </div>
        <PrintButton />
      </div>

      <article className="pb-8 print:pt-0">
        {/* ---- Header --------------------------------------------------- */}
        <header className="border-b border-line pb-6">
          <h1 className="font-display text-4xl tracking-tight print:text-3xl">{site.name}</h1>
          <p className="mt-1 text-[15px] text-muted">
            {site.role} · Applied Artificial Intelligence undergraduate
          </p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[12px] text-faint">
            <span>{site.location}</span>
            <a href={`mailto:${site.email}`} className="link-underline">
              {site.email}
            </a>
            <a href={site.url} className="link-underline">
              jose-codesu.github.io
            </a>
            <a href={site.github} className="link-underline">
              github.com/Jose-codesu
            </a>
          </p>
        </header>

        <Block title="Summary">
          <p className="text-[15px] leading-relaxed text-muted">
            Applied Artificial Intelligence undergraduate and technology retail manager building AI
            products end to end. Ships solo: agent loops on the Claude API with validated structured
            output, local-first SwiftUI apps across iPhone, Watch and widgets, and Next.js tools
            designed around compliance requirements. Google-certified in cybersecurity. Bilingual
            English and Spanish.
          </p>
        </Block>

        {/* ---- Projects first: they are the strongest evidence ----------- */}
        <Block title="Selected work">
          <ul className="space-y-4">
            {visibleProjects.map((project) => (
              <li key={project.slug}>
                <p className="text-[15px] font-medium tracking-tight">
                  {project.name}{' '}
                  <span className="font-normal text-muted">— {project.tagline}</span>
                </p>
                <p className="mt-1 text-[14px] leading-relaxed text-muted">{project.summary}</p>
                <p className="mt-1.5 font-mono text-[11px] text-faint">
                  {[project.platform, ...dedupe(project.platform, project.stack).slice(0, 6)].join(
                    ' · ',
                  )}
                </p>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Experience">
          <ul className="space-y-5">
            {roles.map((role) => (
              <li key={`${role.company}-${role.start}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="text-[15px] font-medium tracking-tight">
                    {role.title}
                    <span className="font-normal text-muted"> · {role.company}</span>
                  </p>
                  <p className="font-mono text-[11px] text-faint">
                    {dateRange(role.start, role.end)}
                  </p>
                </div>
                <ul className="mt-2 space-y-1">
                  {role.points.map((point) => (
                    <li
                      key={point}
                      className="relative pl-4 text-[14px] leading-relaxed text-muted before:absolute before:top-[0.6em] before:left-0 before:size-1 before:rounded-full before:bg-faint"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Education">
          <ul className="space-y-2">
            {education.map((item) => (
              <li key={item.credential} className="flex flex-wrap items-baseline justify-between gap-x-4">
                <p className="text-[15px]">
                  {item.credential}
                  <span className="text-muted"> · {item.school}</span>
                </p>
                <p className="font-mono text-[11px] text-faint">In progress</p>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Certifications">
          <ul className="space-y-2">
            {visibleCertifications.map((certification) => (
              <li key={certification.name}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="text-[15px]">
                    {certification.name}
                    <span className="text-muted"> · {certification.issuer}</span>
                  </p>
                  <p className="font-mono text-[11px] text-faint">
                    {certification.issued ? monthYear(certification.issued) : 'In progress'}
                  </p>
                </div>
                {certification.credentialId && (
                  <p className="font-mono text-[11px] text-faint">
                    Credential ID {certification.credentialId}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Technical skills">
          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {stack.map((group) => (
              <div key={group.name} className="break-inside-avoid">
                <dt className="eyebrow">{group.name}</dt>
                <dd className="mt-1 text-[14px] leading-relaxed text-muted">
                  {group.items.map((item) => item.name).join(' · ')}
                </dd>
              </div>
            ))}
          </dl>
        </Block>

        <Block title="Languages">
          <p className="text-[14px] text-muted">Spanish — native · English — advanced</p>
        </Block>

        <p className="mt-10 hidden font-mono text-[10px] text-faint print:block">
          Full version with project case studies: {site.url}
        </p>
      </article>

      <div className="border-t border-line py-8 print:hidden">
        <Link href="/about" className="hover-arrow text-[13px] text-muted transition-colors hover:text-fg">
          ← More context on the about page
        </Link>
      </div>
    </Container>
  );
}

/** The platform line already names iOS/Web and sometimes watchOS; repeating
 *  those in the stack list wastes a line of a résumé. */
function dedupe(platform: string, stack: string[]) {
  const claimed = platform.toLowerCase();
  return stack.filter((item) => !claimed.includes(item.toLowerCase()));
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 break-inside-avoid">
      <h2 className="eyebrow mb-3">{title}</h2>
      {children}
    </section>
  );
}
