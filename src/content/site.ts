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

  /**
   * Two sentences under the headline, and they stay two sentences. Anyone who
   * wants the longer version clicks through to the about page.
   */
  intro:
    'Applied AI undergraduate in Miami, technology retail manager by day. I ship whole products solo: agent loops on the Claude API, local-first SwiftUI apps, and web tools built to survive an audit.',

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

import { publishedNotes } from './notes';

/**
 * Four items, and it stays four. Credentials and the résumé live inside About,
 * where someone goes when they have already decided to keep reading — a nav bar
 * with six links reads as a site to get through rather than one to look at.
 * Notes joins only once something is published (see notes.ts).
 */
export const nav = [
  { label: 'Work', href: '/work' },
  { label: 'Lab', href: '/lab' },
  ...(publishedNotes.length > 0 ? [{ label: 'Notes', href: '/notes' }] : []),
  { label: 'About', href: '/about' },
];
