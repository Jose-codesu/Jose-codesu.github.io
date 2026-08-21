import type { Project } from './types';

/**
 * Order here is the order on the site. Newest / strongest first.
 * To add a project: copy the shape below, drop it at the top, done.
 */
export const projects: Project[] = [
  {
    slug: 'savor',
    name: 'Savor',
    tagline: 'A calorie tracker with no forms — you tell an agent what you ate',
    summary:
      'An iOS food journal where every day is a thread with Sage, an agent running on the Claude API. Sage reads plain language, estimates or looks up the macros, and writes structured entries — no database search, no portion dropdowns, no barcode ceremony.',
    year: '2026',
    status: 'beta',
    role: 'Solo — product, design, iOS engineering, agent design',
    platform: 'iOS 18 · iPhone',
    stack: [
      'Swift',
      'SwiftUI',
      'SwiftData',
      'Claude API (claude-sonnet-5)',
      'Tool use',
      'Gemini image model',
      'USDA FoodData Central',
      'Metal shaders',
      'Keychain',
      'GitHub Actions',
    ],
    metrics: [
      { value: '0', label: 'third-party Swift packages' },
      { value: '3', label: 'model & data providers orchestrated' },
      { value: '120Hz', label: 'motion budget the UI is built to' },
    ],
    featured: true,
    links: [{ label: 'Private repo', href: 'https://github.com/Jose-codesu', kind: 'repo' }],
    problem: [
      'Traditional trackers lose people in the first week, and it is never the calorie math that does it — it is the friction. A database search, a portion dropdown, a multi-field capture screen, repeated three times a day.',
      'The job to be done is not “log food”. It is “stay aware of what I eat without it feeling like work” — at a table, in a supermarket, at a restaurant, with a phone in one hand and a few seconds of patience.',
    ],
    approach: [
      'Replaced the entire capture UI with one conversation. Sage receives natural language (“two eggs and toast with butter”), decides whether to estimate from its own knowledge or call out to USDA FoodData Central, and returns entries as structured data rather than prose.',
      'Made the model write into a typed schema instead of into a chat log. The agent output is validated before it becomes a SwiftData row, so an unparseable or implausible response fails loudly at the boundary rather than silently corrupting the day.',
      'Gave the estimate an honest surface: an approximation reads as an approximation in the UI, and the user can correct it in the same thread instead of editing a form.',
      'Generated an editorial photograph of each meal with an image model, which “develops” into the thread like a darkroom print — the delight is occasional, not on every tap.',
      'Kept every API key in the Keychain under a dedicated service identifier — never in UserDefaults, never in a plist, never committed. Onboarding collects them in three steps.',
      'Shipped with zero third-party Swift packages: Foundation, SwiftUI, SwiftData, Metal and Security only. Clone and build, nothing to resolve.',
      'Wired GitHub Actions to build on a macOS runner on every push and upload an installable simulator build as an artifact, so the app can be verified without a Mac in front of me.',
    ],
    outcome: [
      'Running as a daily driver with a TestFlight circle around it, feature-complete enough that the beta polishes an experience rather than filling in holes.',
      'The agent surface grew past logging into scanning nutrition labels, scoring a pantry, building a grocery list and advising on restaurant menus — all in the same thread, because the architecture was one coach, not one feature.',
    ],
    notes: [
      {
        title: 'Making a language model safe to write to a database',
        body: [
          'The failure mode people expect from an LLM food logger is a wrong calorie number. The failure mode that actually hurts is a well-formed sentence that turns into a malformed row.',
          'So the model never writes to storage. It returns a structured payload, that payload is decoded into typed Swift values, and only values that survive decoding and a plausibility check reach SwiftData. When the model is uncertain, the entry is marked as an estimate instead of being dressed up as a lookup — the interface tells the truth about the confidence behind a number.',
        ],
      },
      {
        title: 'Three providers, one thread',
        body: [
          'Savor talks to Claude for language and reasoning, to an image model for the meal photograph, and to USDA FoodData Central for verified nutrition data. Each has different latency, different failure behavior, and a different cost of being wrong.',
          'The rule that kept it coherent: the thread never blocks on the slowest one. Language comes back first and the entry appears; the photograph develops in afterwards; the USDA lookup upgrades an estimate in place when it lands. A failure in any of the three degrades that one element rather than the interaction.',
        ],
      },
      {
        title: 'Why the motion budget is spent almost nowhere',
        body: [
          'The app is built to 120Hz, and most of it does not animate. High-frequency surfaces — the thread, the daily total — change instantly. The budget goes to occasional moments: a meal photo developing, a sheet, a milestone.',
          'Constant celebration reads as noise and, worse, as slowness. Delight that is quiet and earned is the difference between an app that feels premium and an app that feels busy.',
        ],
      },
    ],
  },
  {
    slug: 'habitat',
    name: 'Habitat',
    tagline: 'Habit tracking where nothing scolds you',
    summary:
      'A local-first iOS habit tracker with generative guided breathing and nearby places to actually practice what you planned. No account, no server, and the only network call is the place search. SwiftUI, SwiftData, a Watch app and widgets from one shared package.',
    year: '2026',
    status: 'in-review',
    role: 'Solo — product, design, iOS engineering',
    platform: 'iOS 18 · watchOS · Widgets',
    stack: [
      'Swift',
      'SwiftUI',
      'SwiftData',
      'WidgetKit',
      'watchOS',
      'MapKit',
      'StoreKit 2',
      'App Groups',
      'String Catalogs',
      'Swift Testing',
    ],
    metrics: [
      { value: '3', label: 'surfaces from one package: app, widget, watch' },
      { value: '1', label: 'network call in the whole app' },
      { value: '2', label: 'languages, generated from code' },
    ],
    featured: true,
    links: [
      { label: 'Privacy policy', href: 'https://github.com/Jose-codesu/habitat-privacy', kind: 'other' },
    ],
    problem: [
      'Habit apps run on guilt. Open one at nine in the morning and it greets you with a broken twelve-day streak because you have not checked in yet today. Miss a Saturday on a weekday habit and it counts against you. Stop paying and your history gets truncated.',
      'Every one of those is a design decision, not a technical constraint — and each one is the reason people delete the app.',
    ],
    approach: [
      'Encoded the streak rules as pure logic with tests pinning the behavior: today never breaks a streak, days the habit does not apply do not count against it, and a streak below two days is not displayed at all — there is no “streak: 0”.',
      'Kept the data local. SwiftData in an App Group container shared by app, widget and watch target. No account, no sync server, nothing to breach; the single network call is the nearby-places search.',
      'Built breathwork generatively instead of licensing a session library. A pattern is four durations and a rhythm, which is enough for the pacer to run without any external content — and it means every pattern is authored, not bought.',
      'Made premium buy convenience, never data ownership. The full-year view and export are paid; history is never truncated and keeps counting toward streaks and insights after a subscription lapses.',
      'Put shared logic in a local `HabitatKit` package that declares macOS as a platform, so streaks, statistics, the breathing clock and the insight thresholds run as native tests in seconds — no simulator in the loop.',
      'Generated the three String Catalogs from source with a script, so a new user-facing string cannot silently ship untranslated.',
    ],
    outcome: [
      'Feature-complete across iPhone, Watch and widgets, with the privacy policy published and App Store submission in progress.',
      'Incomplete work counts: four breathing cycles out of thirty are recorded as four cycles, leaving a focus timer early banks the minutes done, and archiving replaces deleting so history stays recoverable.',
    ],
    notes: [
      {
        title: 'Testing habit logic without booting a simulator',
        body: [
          'Streak math, statistics, the breathing clock and the insight thresholds all live in a local Swift package that declares macOS as a supported platform. That one line means the logic tests compile and run natively on the host in seconds instead of waiting on a simulator boot.',
          'The rule it enforces: if a piece of behavior needs a simulator to verify, it probably belongs in a layer that does not.',
        ],
      },
      {
        title: 'A bug that looked like a broken feature flag',
        body: [
          'Debug flags were being set with `defaults write`, and they appeared to work — until the app wrote the key itself once, after which the flag silently stopped taking effect with no error anywhere.',
          '`defaults write` targets the device preferences domain; the app reads the plist inside its own App Group container. The two agree only until the app writes the key, and from then on they diverge. The fix was to pass flags as launch arguments instead, and to add a `make flags` target that prints what the app has actually persisted — which is not the same question as what it was handed.',
        ],
      },
      {
        title: 'The palette is a script, not a decision',
        body: [
          'Three complete palettes live behind `scripts/set-palette.py`, which rewrites every color token in the project. Comparing directions meant running a command and looking at the app, not editing forty call sites and hoping the comparison was fair.',
          'Making a taste question cheap to re-ask is usually worth more than getting it right on the first attempt.',
        ],
      },
    ],
  },
  {
    slug: 'notewell',
    name: 'Notewell',
    tagline: 'Session notes for ABA teams that survive an audit',
    summary:
      'A notes-first web app for behavior-therapy clinics, where documentation failures translate directly into recouped payments. AI drafts the narrative, a pre-signature audit check blocks incomplete notes, and clone detection catches the copy-paste pattern auditors look for first.',
    year: '2026',
    status: 'building',
    role: 'Solo — product research, full-stack engineering',
    platform: 'Web · Next.js',
    stack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Drizzle ORM',
      'libSQL / SQLite',
      'Anthropic SDK',
      'next-intl',
      'Tailwind CSS',
      'Vitest',
      'Playwright',
    ],
    metrics: [
      { value: '$77.8M', label: 'improper payments in the audit that framed the product' },
      { value: '100/100', label: 'sampled patient-months with deficient notes' },
      { value: '24-48h', label: 'documentation window the product is designed around' },
    ],
    featured: true,
    disclosure:
      'Built and demoed against synthetic data only. No real protected health information touches the system until a business associate agreement is in place, and the product makes no compliance claim it cannot evidence.',
    problem: [
      'A March 2026 OIG audit of one state Medicaid program traced $77.8M in improper ABA payments to documentation failures: missing fields, vague language, cloned notes, and notes that never connected to the authorized service. In 100 of 100 sampled patient-months, the notes failed to fully describe services, goals or data.',
      'The people writing those notes are technicians finishing them after hours, usually unpaid, usually inside a 24 to 48 hour window. The tooling is Word, Google Docs, or paper.',
      'Enterprise platforms exist, but they are priced and shaped for large organizations. Agencies with one to fifty employees are the ones getting audited with the worst tools.',
    ],
    approach: [
      'Structured the note first, then let the model write. Session data is captured as fields; the AI drafts the narrative from those fields, which keeps the generated prose anchored to recorded facts instead of inventing them.',
      'Put an audit check before the signature, not after the claim: hours, CPT codes, goals and narrative are verified while the note can still be fixed.',
      'Implemented clone detection with Jaccard similarity over trigrams — the copy-paste pattern that shows up first in audit findings — surfacing it on the note itself and as a column in the team dashboard.',
      'Made corrections immutable: signed notes are amended through timestamped addendums rather than edits, so the record of what was known and when survives.',
      'Built the supervisor path as a co-sign review queue plus a team dashboard for note quality and timeliness, so a BCBA finds a bad note before an auditor does.',
      'Added a per-client audit packet that exports as a single PDF, because responding to an audit quickly is the difference between a question and a recoupment.',
    ],
    outcome: [
      'Core loop working end to end: structured capture, AI-drafted narrative, pre-signature audit check, co-sign queue, addendums, and audit packet export.',
      'Internationalized from the start with next-intl, which matters for a bilingual workforce, and covered with Vitest and Playwright because a compliance tool that regresses quietly is worse than no tool.',
    ],
    notes: [
      {
        title: 'Reading an audit report as a product spec',
        body: [
          'The OIG report is not a marketing statistic, it is a list of the exact ways a note fails. Missing fields. Vague language. Cloned text. No link to the authorized service. Each finding maps to a check the software can run before anyone signs.',
          'That is the whole product thesis: the requirements are already written down in public, by the people who do the auditing. The work is turning them into blocking checks rather than training slides.',
        ],
      },
      {
        title: 'Where the model is allowed to be creative',
        body: [
          'The narrative is the only place the model writes freely, and it writes from fields the human already filled in. It does not choose CPT codes, it does not decide session hours, and it does not sign anything.',
          'Constraining generation to the one place where prose is genuinely the deliverable is what makes an AI feature usable in a regulated workflow. Everywhere else, deterministic checks do the work.',
        ],
      },
    ],
  },
  {
    // Draft entries stay in the file and out of the site. Flip `draft` to false
    // when you are ready to show it.
    slug: 'metro-performance-tracker',
    name: 'Metro Performance Tracker',
    tagline: 'An internal dashboard for the store I manage',
    summary:
      'A TypeScript tool built for my own retail team to track daily performance against goals — the first thing I built to remove a spreadsheet from my actual job.',
    year: '2026',
    status: 'building',
    role: 'Solo — engineering',
    platform: 'Web',
    stack: ['TypeScript', 'React'],
    draft: true,
  },
];

export const visibleProjects = projects.filter((p) => !p.draft);
export const featuredProjects = visibleProjects.filter((p) => p.featured);

export function getProject(slug: string) {
  return visibleProjects.find((p) => p.slug === slug);
}
