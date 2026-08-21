import Link from 'next/link';
import { nav, site, socials } from '@/content/site';
import { CopyEmail } from './copy-email';
import { ArrowUpRight } from './ui/arrow';

export function SiteFooter() {
  return (
    <footer className="mt-28 border-t border-line print:hidden">
      <div className="mx-auto w-full max-w-5xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <p className="font-display text-2xl">{site.name}</p>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              {site.role} · {site.location}
            </p>
            <CopyEmail className="mt-4" />
          </div>

          <div className="flex gap-12">
            <nav aria-label="Footer">
              <p className="eyebrow mb-3">Site</p>
              <ul className="space-y-2 text-[14px]">
                <li>
                  <Link href="/" className="text-muted transition-colors hover:text-fg">
                    Home
                  </Link>
                </li>
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-muted transition-colors hover:text-fg">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="eyebrow mb-3">Elsewhere</p>
              <ul className="space-y-2 text-[14px]">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noreferrer noopener"
                      className="hover-arrow inline-flex items-center gap-1 text-muted transition-colors hover:text-fg"
                    >
                      {social.label}
                      <ArrowUpRight className="opacity-60" />
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={site.resumePath}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="hover-arrow inline-flex items-center gap-1 text-muted transition-colors hover:text-fg"
                  >
                    Résumé (PDF)
                    <ArrowUpRight className="opacity-60" />
                  </a>
                </li>
                <li>
                  <a
                    href="/feed.xml"
                    className="hover-arrow inline-flex items-center gap-1 text-muted transition-colors hover:text-fg"
                  >
                    RSS
                    <ArrowUpRight className="opacity-60" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-12 font-mono text-[11px] text-faint">
          © {new Date().getFullYear()} {site.name} · Built with Next.js, deployed on GitHub Pages
        </p>
      </div>
    </footer>
  );
}
