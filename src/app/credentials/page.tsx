import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Reveal } from '@/components/reveal';
import { StackGrid } from '@/components/stack-grid';
import { ArrowUpRight } from '@/components/ui/arrow';
import { visibleCertifications, education } from '@/content/credentials';
import { longDate } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Credentials',
  description:
    'Certificates, degrees in progress and verified credential IDs — Google Cybersecurity Professional Certificate and Applied Artificial Intelligence at Miami Dade College.',
};

export default function CredentialsPage() {
  return (
    <Container>
      <header className="border-b border-line pt-14 pb-10 sm:pt-24">
        <Reveal>
          <p className="eyebrow">Credentials</p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.5rem,7vw,4.25rem)] leading-[1] tracking-tight">
            Verifiable, dated, and still growing.
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted">
            Every certificate here lists its issuer and credential ID so it can be checked. New ones
            get added the day they are earned.
          </p>
        </Reveal>
      </header>

      <Section eyebrow="Certificates" title="Completed" className="mt-16 sm:mt-20">
        <div className="mt-2">
          {visibleCertifications.map((certification, index) => (
            <Reveal
              key={certification.name}
              delay={index * 50}
              className="grid gap-x-10 gap-y-4 border-b border-line py-10 sm:grid-cols-[11rem_1fr]"
            >
              <div>
                <p className="font-mono text-[12px] text-faint">
                  {certification.issued ? longDate(certification.issued) : 'In progress'}
                </p>
              </div>

              <div>
                <h3 className="font-display text-2xl tracking-tight">{certification.name}</h3>
                <p className="mt-1 text-[14px] text-muted">{certification.issuer}</p>
                <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted">
                  {certification.summary}
                </p>

                {certification.credentialId && (
                  <p className="mt-5 flex flex-wrap items-center gap-2 font-mono text-[12px] text-faint">
                    <span className="rounded-md border border-line px-2 py-1">
                      ID {certification.credentialId}
                    </span>
                    {certification.verifyUrl && (
                      <a
                        href={certification.verifyUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="hover-arrow inline-flex items-center gap-1 text-muted transition-colors hover:text-fg"
                      >
                        Verify
                        <ArrowUpRight className="opacity-60" />
                      </a>
                    )}
                  </p>
                )}

                {certification.courses && (
                  <div className="mt-7">
                    <p className="eyebrow">Courses completed</p>
                    <ol className="mt-3 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
                      {certification.courses.map((course, courseIndex) => (
                        <li key={course} className="flex gap-3 text-[14px] text-muted">
                          <span className="font-mono text-[11px] text-faint tabular-nums">
                            {String(courseIndex + 1).padStart(2, '0')}
                          </span>
                          {course}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {certification.skills && (
                  <div className="mt-7">
                    <p className="eyebrow">Covered</p>
                    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                      {certification.skills.map((skill) => (
                        <li key={skill} className="font-mono text-[12px] text-muted">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="Education" title="In progress">
        <div className="mt-2">
          {education.map((item, index) => (
            <Reveal
              key={item.credential}
              delay={index * 50}
              className="grid gap-x-10 gap-y-3 border-b border-line py-8 sm:grid-cols-[11rem_1fr]"
            >
              <p className="font-mono text-[12px] text-faint">
                {item.status === 'in-progress' ? 'In progress' : 'Completed'}
              </p>
              <div>
                <h3 className="text-[17px] font-medium tracking-tight">{item.credential}</h3>
                <p className="mt-1 text-[14px] text-muted">{item.school}</p>
                {item.focus && (
                  <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                    {item.focus.map((focus) => (
                      <li key={focus} className="font-mono text-[12px] text-faint">
                        {focus}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Toolkit"
        title="Skills, honestly rated"
        description="“Working” means it is in something that runs. “Learning” means exactly that."
      >
        <StackGrid />
      </Section>
    </Container>
  );
}
