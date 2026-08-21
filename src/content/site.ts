import type { LinkKind } from './types';

export const site = {
  name: 'Jose Lavin',
  /** Shown in the header lockup and the command palette. */
  shortName: 'Jose Lavin',
  role: 'AI Engineer',
  location: 'Miami, FL',
  email: 'xeezzalejandro1805@icloud.com',
  github: 'https://github.com/Jose-codesu',
  /** TODO: add your LinkedIn URL here and it appears in the header, footer and ⌘K. */
  linkedin: '',
  url: 'https://jose-codesu.github.io',
  resumePath: '/Jose-Lavin-Resume.pdf',

  /**
   * The one-liner. Everything else on the site is evidence for this claim.
   * Text between asterisks renders in display italic.
   */
  headline: 'I build AI products *end to end*.',

  /** Two sentences under the headline. Concrete, no adjectives you can not prove. */
  intro:
    'Applied Artificial Intelligence undergraduate at Miami Dade College, Google-certified in cybersecurity, and a technology retail manager who ships software nights and weekends. I design and build the whole thing: agent loops against the Claude API, SwiftUI apps with local-first data, and Next.js tools that hold up under an audit.',

  availability: {
    open: true,
    text: 'Open to AI engineering internships and junior roles',
  },

  seo: {
    title: 'Jose Lavin — AI Engineer',
    description:
      'AI engineer in Miami building agent-driven products end to end: Claude API agent loops, local-first SwiftUI apps, and Next.js tools. Applied AI undergraduate at Miami Dade College.',
    keywords: [
      'AI engineer',
      'applied artificial intelligence',
      'Claude API',
      'agent engineering',
      'SwiftUI',
      'Next.js',
      'Miami',
      'Jose Lavin',
    ],
  },
} as const;

export interface SocialLink {
  label: string;
  href: string;
  kind: LinkKind;
}

export const socials: SocialLink[] = [
  { label: 'GitHub', href: site.github, kind: 'repo' },
  { label: 'Email', href: `mailto:${site.email}`, kind: 'other' },
  ...(site.linkedin ? [{ label: 'LinkedIn', href: site.linkedin, kind: 'other' as LinkKind }] : []),
];

export const nav = [
  { label: 'Work', href: '/work' },
  { label: 'Credentials', href: '/credentials' },
  { label: 'About', href: '/about' },
] as const;
