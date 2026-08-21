import type { Note } from './types';

/**
 * Longer write-ups. Newest first; `draft: true` keeps one out of the site.
 *
 * The whole /notes section — including its nav link, its feed entries and its
 * home-page block — only appears once at least one note is published, so an
 * empty writing section never sits on the site looking abandoned.
 *
 * Body blocks:
 *   { type: 'p',     text: '…' }              paragraph
 *   { type: 'h2',    text: '…' }              section heading
 *   { type: 'quote', text: '…' }              pulled-out line
 *   { type: 'list',  items: ['…', '…'] }      bullets
 *   { type: 'code',  code: '…', lang: 'ts' }  code block
 */
export const notes: Note[] = [
  {
    // Drafted from the Habitat debugging notes — rewrite it in your own voice
    // whenever you want; the facts are yours, the phrasing is a starting point.
    slug: 'the-flag-that-was-not-broken',
    title: 'The debug flag that was not broken',
    date: '2026-08-20',
    summary:
      'A launch flag I set with `defaults write` worked exactly until the app wrote the same key once. Then it stopped, silently, with no error anywhere. The cause was two preference domains that agree right up until they do not.',
    tags: ['iOS', 'debugging', 'SwiftUI'],
    body: [
      {
        type: 'p',
        text: 'Habitat has debug flags. One of them, seedOnLaunch, fills the database with a year of history so I can look at the progress screen without tapping a checkmark three hundred times. I set it the way everyone sets a default on macOS.',
      },
      { type: 'code', code: 'defaults write com.joselavin.Habitat seedOnLaunch -bool YES', lang: 'sh' },
      {
        type: 'p',
        text: 'It worked. Then, a few days later, it did not — and nothing about the failure said so. No crash, no warning, no log line. The app launched with an empty database and behaved as though I had never set anything. Rewriting the key changed nothing. Deleting and rewriting it changed nothing.',
      },
      { type: 'h2', text: 'Two plists that look like one' },
      {
        type: 'p',
        text: 'The flag reader and the flag writer were not talking about the same file. `defaults write` puts the key in the device preferences domain — data/Library/Preferences on the simulator. The app reads its own container, which for Habitat is the App Group the app, the widget and the watch target all share.',
      },
      {
        type: 'p',
        text: 'Those two agree at first, because a key that only exists in one place is still found. The moment the app itself writes that key — which it does, once, the first time the flag is consumed — the container has its own copy, and the container always wins. From then on I was editing a file nobody read.',
      },
      { type: 'h2', text: 'The fix, and the tool that made it obvious' },
      {
        type: 'p',
        text: 'Flags now go in as launch arguments, which reach the process directly and never touch a preferences file at all:',
      },
      { type: 'code', code: 'FLAG=seedOnLaunch make launch', lang: 'sh' },
      {
        type: 'p',
        text: 'And there is a second target that answers the question I could not answer while I was stuck — not "what did I set?" but "what has the app actually persisted?"',
      },
      { type: 'code', code: 'make flags', lang: 'sh' },
      {
        type: 'list',
        items: [
          'What you set and what the app stored are two different questions.',
          'A shared App Group container is a second source of truth; treat it like one.',
          'seedOnLaunch is consumed on use, so the value you find afterwards is not the value you sent.',
        ],
      },
      { type: 'h2', text: 'What I took from it' },
      {
        type: 'p',
        text: 'The bug cost an afternoon, and none of that afternoon was spent on the actual cause. It was spent trusting a mechanism that had worked before. A tool that prints the real state — not the state you believe you configured — pays for itself the first time the two disagree.',
      },
      {
        type: 'quote',
        text: 'When something silently stops working, stop debugging the thing and start debugging your assumption about where it reads from.',
      },
    ],
  },
  {
    slug: 'template',
    title: 'The title goes here, and it should make a claim',
    date: '2026-08-20',
    summary:
      'One or two sentences that say what the reader gets. This is what shows up on the index, in the feed, and in the link preview.',
    tags: ['template'],
    draft: true,
    body: [
      { type: 'p', text: 'Open with the concrete situation. What were you building, what broke, what did you expect to happen.' },
      { type: 'h2', text: 'What actually happened' },
      { type: 'p', text: 'The specifics — error messages, timings, the wrong assumption. Specifics are what make a technical post worth reading.' },
      { type: 'code', code: "const velocity = Math.abs(swipeAmount) / timeTaken;\nif (velocity > 0.11) dismiss();", lang: 'ts' },
      { type: 'h2', text: 'What it turned out to be' },
      { type: 'list', items: ['The cause, stated plainly.', 'The fix.', 'The thing you now check first.'] },
      { type: 'quote', text: 'End on the rule you would give someone about to hit the same wall.' },
    ],
  },
];

export const publishedNotes = notes
  .filter((note) => !note.draft)
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getNote(slug: string) {
  return publishedNotes.find((note) => note.slug === slug);
}
