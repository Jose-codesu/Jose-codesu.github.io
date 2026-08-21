import type { LogEntry } from './types';

/**
 * The running record. Add a line whenever something actually happens — a ship,
 * a credential, a hard bug, a thing learned. Sorted newest first automatically,
 * so order in this array does not matter.
 *
 * Keep entries factual. This section is credible precisely because it is dated.
 */
export const log: LogEntry[] = [
  {
    date: '2026-08-20',
    title: 'Started the AI engineering track in public',
    body: 'Launched this site as the permanent record: every project, credential and lesson gets added here as it happens rather than reconstructed later from memory.',
    tag: 'milestone',
  },
  {
    date: '2026-07-29',
    title: 'Habitat privacy policy published, submission prep',
    body: 'Wrote and published the privacy policy for Habitat and moved into App Store submission — build configuration, store metadata, and the screenshots pass.',
    tag: 'ship',
    href: 'https://github.com/Jose-codesu/habitat-privacy',
  },
  {
    date: '2026-07-29',
    title: 'Turned an OIG audit report into a product spec',
    body: 'Read the March 2026 OIG findings on ABA documentation and mapped each failure mode — missing fields, vague language, cloned notes — to a blocking check in Notewell.',
    tag: 'learn',
  },
  {
    date: '2026-07-10',
    title: 'Savor beta scope frozen',
    body: 'Locked the beta on the conversational logging loop with Sage running on claude-sonnet-5, and decided the App Store target sits after the beta feels finished rather than before.',
    tag: 'milestone',
  },
  {
    date: '2025-01-15',
    title: 'Google Cybersecurity Professional Certificate',
    body: 'Finished all eight courses, including Python automation for security tasks — the first structured programming work that stuck.',
    tag: 'learn',
  },
];

export const sortedLog = [...log].sort((a, b) => (a.date < b.date ? 1 : -1));
