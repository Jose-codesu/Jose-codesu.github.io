/**
 * The shape of every piece of content on this site.
 *
 * Adding to the portfolio should never mean touching a component: write one
 * object in `src/content/*.ts` and the pages pick it up. Anything optional here
 * is genuinely optional — a project with only a summary still renders.
 */

export type Status =
  | 'shipped' // live and available to the public
  | 'in-review' // submitted, waiting on a review queue
  | 'beta' // real users, invite only
  | 'building' // active development
  | 'research'; // exploration, no product yet

export type LinkKind = 'live' | 'repo' | 'appstore' | 'testflight' | 'writeup' | 'demo' | 'other';

export interface ProjectLink {
  label: string;
  href: string;
  kind: LinkKind;
}

export interface Metric {
  /** Keep it short — this renders large. e.g. "3", "0", "24-48h" */
  value: string;
  label: string;
}

export interface Section {
  title: string;
  /** Paragraphs. Each string becomes its own <p>. */
  body: string[];
}

export interface Media {
  src: string;
  /** Required: describe what the screen shows, not that it is a screenshot. */
  alt: string;
  caption?: string;
  /** 'phone' renders in a device-shaped card; 'wide' spans the content column. */
  kind: 'phone' | 'wide';
  width: number;
  height: number;
}

export interface Project {
  slug: string;
  name: string;
  /** One line, sentence case, no period. Shown under the name. */
  tagline: string;
  /** Two or three sentences. Used on cards, in search, and in page metadata. */
  summary: string;
  year: string;
  status: Status;
  /** What you actually did. "Solo — product, design, engineering." */
  role: string;
  /** Square app icon in /public/media/icons. Falls back to a monogram. */
  icon?: string;
  /** Screenshots. Order matters; the first one leads the gallery. */
  media?: Media[];
  /** One line under the gallery for context a caption cannot carry. */
  mediaNote?: string;
  platform: string;
  stack: string[];
  links?: ProjectLink[];
  metrics?: Metric[];
  /** Shown on the home page. Order comes from the array, not this flag. */
  featured?: boolean;
  /** Set true to keep an entry in the file but out of the site. */
  draft?: boolean;
  /** The case study. Omit any of these and the section disappears. */
  problem?: string[];
  approach?: string[];
  outcome?: string[];
  /** Deep dives — the part that shows how you think. */
  notes?: Section[];
  /** Honest caveats. Rendered in a quieter block; credibility beats polish. */
  disclosure?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  /** ISO date, or null while in progress. */
  issued: string | null;
  credentialId?: string;
  /** Public verification page, when the issuer provides one. */
  verifyUrl?: string;
  status: 'completed' | 'in-progress';
  summary: string;
  /** Individual courses or modules, if the credential is a track. */
  courses?: string[];
  skills?: string[];
  draft?: boolean;
}

export interface Role {
  company: string;
  title: string;
  location: string;
  start: string;
  end: string | null; // null = present
  /** What the job actually involved, in past tense (present for current role). */
  points: string[];
  /** The thread back to engineering. Optional, but it is the interesting part. */
  transfer?: string;
}

export interface Education {
  school: string;
  credential: string;
  status: 'in-progress' | 'completed';
  start?: string;
  expected?: string;
  focus?: string[];
}

export interface StackGroup {
  name: string;
  /** `level` is self-assessed and deliberately conservative. */
  items: { name: string; level: 'working' | 'learning' }[];
}

export interface LogEntry {
  /** ISO date. Entries sort newest first automatically. */
  date: string;
  title: string;
  body: string;
  tag?: 'ship' | 'learn' | 'write' | 'milestone';
  href?: string;
}

export type NoteBlock =
  | { type: 'p' | 'h2' | 'quote'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'code'; code: string; lang?: string }
  /** Numbers read better as a table than as a paragraph of percentages. */
  | { type: 'table'; head: string[]; rows: string[][]; caption?: string };

export interface Note {
  slug: string;
  title: string;
  /** ISO date. Sorted newest first automatically. */
  date: string;
  summary: string;
  tags?: string[];
  draft?: boolean;
  body: NoteBlock[];
}
