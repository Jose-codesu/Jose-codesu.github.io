import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/reveal';
import { ArrowRight } from '@/components/ui/arrow';

export const metadata: Metadata = {
  title: 'Lab',
  description:
    'Two pieces of my work you can run in the browser: the eval bank behind Savor’s calorie estimates, and the clone detector from Notewell.',
};

const demos = [
  {
    href: '/lab/eval',
    eyebrow: 'Savor',
    title: 'The eval bank',
    body: 'Sixteen photos with known calories, thirteen runs across models and prompt versions. Switch runs, compare two, and toggle the three photos whose truth is itself an estimate — the headline error moves several points without the model changing.',
    meta: '13 runs · real measurements',
  },
  {
    href: '/lab/clone',
    eyebrow: 'Notewell',
    title: 'The clone detector',
    body: 'Paste two session notes and watch Jaccard similarity over word trigrams score them against the same thresholds the product uses. It is the production function, running in your browser — no server, no model, no API key.',
    meta: 'Production code · runs client-side',
  },
];

export default function LabPage() {
  return (
    <Container>
      <header className="border-b border-line pt-14 pb-10 sm:pt-24">
        <Reveal>
          <p className="eyebrow">Lab</p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.5rem,7vw,4.25rem)] leading-[1] tracking-tight">
            Don’t take my word for it — run it.
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted">
            A case study describes what I built. These two pages hand you the actual thing: real
            measurements from my eval bank, and production code executing on your machine.
          </p>
        </Reveal>
      </header>

      <ul className="divide-y divide-line">
        {demos.map((demo, index) => (
          <Reveal as="li" key={demo.href} delay={index * 50}>
            <Link
              href={demo.href}
              className="hover-lift hover-arrow card-press pressable -mx-4 grid gap-x-10 gap-y-3 rounded-xl border border-transparent px-4 py-9 hover:border-line hover:bg-panel sm:grid-cols-[9rem_1fr]"
            >
              <div>
                <p className="eyebrow">{demo.eyebrow}</p>
                <p className="mt-2 font-mono text-[11px] text-faint">{demo.meta}</p>
              </div>
              <div>
                <h2 className="font-display text-[28px] leading-tight tracking-tight">
                  {demo.title}
                </h2>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{demo.body}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px]">
                  Open
                  <ArrowRight />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </Container>
  );
}
