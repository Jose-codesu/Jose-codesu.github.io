import { Container } from '@/components/ui/container';
import { ButtonLink } from '@/components/ui/button';
import { ArrowRight } from '@/components/ui/arrow';

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col justify-center py-24">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,4rem)] leading-none tracking-tight">
        That page does not exist.
      </h1>
      <p className="mt-5 max-w-md text-[16px] leading-relaxed text-muted">
        The link may be outdated, or the page moved. Everything is one hop away from the home page —
        or press <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[11px]">⌘K</kbd>{' '}
        to search.
      </p>
      <div className="mt-8">
        <ButtonLink href="/">
          Back home
          <ArrowRight />
        </ButtonLink>
      </div>
    </Container>
  );
}
