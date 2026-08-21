import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { site } from '@/content/site';
import './globals.css';

const sans = Geist({ variable: '--font-geist-sans', subsets: ['latin'], display: 'swap' });
const mono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'], display: 'swap' });
const display = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.seo.title,
    template: `%s — ${site.name}`,
  },
  description: site.seo.description,
  keywords: [...site.seo.keywords],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: site.url,
    siteName: site.seo.title,
    title: site.seo.title,
    description: site.seo.description,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: `${site.name} — ${site.role}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.seo.title,
    description: site.seo.description,
    images: ['/og.png'],
  },
  alternates: { canonical: site.url },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfaf8' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1918' },
  ],
};

/** Structured data so search engines read the page as a person, not a blog. */
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  url: site.url,
  address: { '@type': 'PostalAddress', addressLocality: 'Miami', addressRegion: 'FL', addressCountry: 'US' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Miami Dade College' },
  sameAs: [site.github, site.linkedin].filter(Boolean),
  knowsLanguage: ['en', 'es'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* Font variables live on <html>, not <body>: Tailwind's `@theme` resolves
       --font-sans / --font-display at :root, and a variable defined one level
       lower would leave those theme tokens empty. */
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:border focus:border-line-strong focus:bg-panel focus:px-4 focus:py-2 focus:text-sm"
          >
            Skip to content
          </a>

          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />

          <Toaster
            position="bottom-right"
            // Sonner reads the class on <html>, which next-themes owns.
            theme="system"
            toastOptions={{
              classNames: {
                toast:
                  'border border-line bg-panel text-fg font-sans rounded-xl shadow-lg shadow-fg/5',
                description: 'text-muted',
              },
            }}
          />
        </ThemeProvider>

        <script
          type="application/ld+json"
          // Static, author-controlled JSON — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
