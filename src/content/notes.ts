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
    slug: 'three-corrections-to-the-same-number',
    title: 'Three corrections to the same number',
    date: '2026-08-20',
    summary:
      'Savor’s photo estimates went from 14.1% error to 10.2%, then to 6.9%, then back to 10%. The model never changed. Every one of those moves was a correction to what I was measuring — and the last one was the eval lying in my favour.',
    tags: ['evals', 'AI engineering', 'Savor'],
    body: [
      {
        type: 'p',
        text: 'Savor estimates the calories in a photo of a plate. To know whether it is any good I built an eval bank: sixteen photos whose real values I can defend — official brand labels, USDA entries with the food weighed on a scale — plus a `truth.json` beside them and a script that runs any model and prompt against the set and writes both the raw run and a comparison table.',
      },
      {
        type: 'p',
        text: 'The headline number was mean absolute error on calories. It moved three times in two weeks without a single change to the model or the prompt.',
      },
      { type: 'h2', text: 'Correction 1 — a third of the error was mine' },
      {
        type: 'p',
        text: 'Hunting for accuracy levers, I read the five worst cases of a run and noticed something in three of them: the word “approximate”, written by me, in the ground-truth `source` field.',
      },
      {
        type: 'table',
        head: ['Photo', 'How I knew the truth', 'Error'],
        rows: [
          ['012', 'Garlic bread, “~4 visible slices — approximate”', '+15%'],
          ['015', 'Combo meal, “approximate from label”', '+26%'],
          ['016', 'Restaurant plate, “standard recipe ~450 g — approximate”', '−32%'],
        ],
      },
      {
        type: 'p',
        text: 'These were exactly the three cases an earlier report had filed under “limit of the model, not the prompt” after four prompts and three models failed to move them. Nothing moved them because there was nothing to move: the bank did not know the answer either, so the error I was measuring included my own uncertainty.',
      },
      {
        type: 'p',
        text: 'Every case in `truth.json` now carries `truth_confidence: exact | approximate`. The headline metrics are computed over the exact set only; the approximate ones are reported separately and never decide a verdict.',
      },
      {
        type: 'table',
        head: ['Set', 'n', 'MAE', 'Median'],
        rows: [
          ['Exact truth (brand label or weighed USDA)', '13', '6.9%', '0.7%'],
          ['Approximate truth', '3', '24.4%', '25.9%'],
          ['Mixed — what I had been reporting', '16', '10.2%', '—'],
        ],
      },
      {
        type: 'p',
        text: 'A median of 0.7% on verifiable cases describes a different product than 14.1% does. That felt like the end of the story. It was not.',
      },
      { type: 'h2', text: 'Correction 2 — the bank was grading a paraphrase' },
      {
        type: 'p',
        text: 'The prompt variants lived inside the eval script, hand-written. The prompt that actually runs on the phone lives in `FoodVision.swift`, and it is not the same text — the shipped one also asks for the meal slot and for the visual coordinates of each component on the plate.',
      },
      {
        type: 'p',
        text: 'So every verdict I had produced answered “how good is the paraphrase?”, not “how accurate is Sage?”. The script now extracts the prompt from the Swift source with `--prompt shipped`. The good news: measured side by side, the shipped prompt and the paraphrase tie — 10.0% against 10.3%. The bank had been fine for ranking candidates. It was the absolute number that was fiction.',
      },
      { type: 'h2', text: 'Correction 3 — 6.9% was one lucky run' },
      {
        type: 'p',
        text: 'The script had no repetitions. One photo, one call, one number. With temperature in play and n = 13, a fortunate run moves the mean by several points — I had already measured about 4.5 points of run-to-run noise on the text bank and never applied the lesson to photos.',
      },
      {
        type: 'p',
        text: 'Scored as the median of three runs per photo, both prompts land at roughly 10%. That is the real number for the photo path. The 6.9% is retired.',
      },
      {
        type: 'p',
        text: 'Measuring three runs also exposed something nobody had looked at: how unstable the photo path is on identical input. One photo whose true value is 360 kcal produced a 288 kcal spread across three consecutive runs.',
      },
      { type: 'h2', text: 'What the error is actually made of' },
      {
        type: 'p',
        text: 'On the exact-truth cases, the two worst are both size judgment, not identification. A ~12 oz cola came back as 95 kcal against a real 140 — it saw a smaller glass. A whole 201 g avocado came back as 480 against 322 — it saw about 300 g. The model knows what the food is; without a reference object in the frame, it cannot tell how much of it there is.',
      },
      {
        type: 'p',
        text: 'One guard turned out to be theatre. Atwater reconciliation — cross-checking that stated calories agree with the macro breakdown — fired zero times across 57 estimates from four models on the photo path. It costs nothing and corrects nothing here. Knowing that it never fires is worth more than assuming it protects me.',
      },
      {
        type: 'quote',
        text: 'A benchmark is a measuring instrument, and instruments need calibrating before the readings mean anything. Three of my four biggest accuracy “gains” were the instrument, not the model.',
      },
      {
        type: 'p',
        text: 'The rule I work by now: before tuning anything, ask what the eval knows, whether it grades the artifact that ships, and how much the number moves when nothing changes.',
      },
    ],
  },
  {
    slug: 'the-prompt-that-fixed-two-cases-and-broke-four',
    title: 'The prompt that fixed two cases and broke four',
    date: '2026-08-20',
    summary:
      'I wrote a prompt revision aimed at the two worst cases in Savor’s eval bank. It improved one of them slightly, did not move the other by a single calorie, and quietly wrecked four cases that were already perfect.',
    tags: ['evals', 'prompting', 'Savor'],
    body: [
      {
        type: 'p',
        text: 'With the eval bank split by truth confidence, the two worst remaining cases were both about size: a cola the model estimated 32% low, and a whole avocado it estimated 49% high. Both are scale errors — it identifies the food correctly and then guesses the portion badly.',
      },
      {
        type: 'p',
        text: 'So I wrote a candidate prompt with volume anchors for drinks and a rule about foreground objects: trust standard size over apparent size. Two targeted fixes. The hypothesis was obvious and, I assumed, safe.',
      },
      {
        type: 'table',
        head: ['Prompt', 'n', 'MAE', 'Median', 'Within ±20%'],
        rows: [
          ['v3 — shipped', '13', '6.9%', '0.7%', '85%'],
          ['v5 — candidate', '13', '9.8%', '3.0%', '85%'],
        ],
      },
      { type: 'h2', text: 'What happened to the targets' },
      {
        type: 'table',
        head: ['Case', 'Real', 'v3', 'v5'],
        rows: [
          ['Cola, ~12 oz', '140', '95 (−32%)', '105 (−25%)'],
          ['Whole avocado, 201 g', '322', '480 (+49%)', '480 (+49%)'],
        ],
      },
      {
        type: 'p',
        text: 'The volume anchors helped the drink a little. The foreground rule did nothing at all to the avocado — not a partial improvement, not an overcorrection. The same 480 kcal, to the calorie. A prompt instruction that leaves the output byte-identical is not a weak instruction, it is an ignored one, and that is useful to know: the failure is in what the model can perceive, not in what it was told.',
      },
      { type: 'h2', text: 'What happened everywhere else' },
      {
        type: 'p',
        text: 'Four cases that v3 got right degraded. One drink went from 0.0% error — exact — to 16.8%. The mean got worse by 2.9 points and the median quadrupled, all from collateral damage on cases the change was never aimed at.',
      },
      {
        type: 'p',
        text: 'This is the part that is easy to miss when you evaluate a prompt by looking at the cases you were trying to fix. A prompt is not a patch applied to one situation; it is a global change to how the model reads every situation. Adding a rule about foreground size changes the answer for plates that never had a size problem.',
      },
      {
        type: 'p',
        text: 'Verdict: keep v3. The candidate is not shipped, and the report stays in the repo with its numbers, because the next person tempted by volume anchors — probably me — should find out it was already tried.',
      },
      {
        type: 'quote',
        text: 'Judge a prompt change on the whole set, never on the cases that motivated it. The regressions are where the cost hides.',
      },
      {
        type: 'p',
        text: 'The companion piece to this one is [three corrections to the same number](/notes/three-corrections-to-the-same-number), which is about how the numbers in that table earned the right to be trusted at all.',
      },
    ],
  },
  {
    slug: 'two-cache-breakpoints-in-an-agent-loop',
    title: 'Two cache breakpoints in an agent loop',
    date: '2026-08-20',
    summary:
      'One message to Sage can take eight tool rounds, and every round resends the entire system prompt. The interesting part was not caching the static half — it was realising the dynamic half is byte-identical too, for the length of a turn.',
    tags: ['agents', 'Claude API', 'cost', 'Savor'],
    body: [
      {
        type: 'p',
        text: 'Sage is an agentic loop, not a single completion. You say “two eggs and toast with butter”, and the model may call `search_nutrition`, then `log_food`, then `remember` — fourteen tools are available and the loop runs up to eight rounds before it is cut off. Each round is a fresh API request that carries the whole conversation and the whole system prompt again.',
      },
      {
        type: 'p',
        text: 'The system prompt is two blocks. The first is static: instructions, tone, and a calorie calibration atlas that measurably sharpens estimates — about 4.6K tokens that never change between users or days. Caching that one is the obvious move.',
      },
      { type: 'h2', text: 'The block I almost did not cache' },
      {
        type: 'p',
        text: 'The second block is the dynamic context: the profile, remembered facts, today’s entries, the current streak, the calorie goal, the check-in, the shopping list. It changes constantly — which is exactly why it looks like the wrong thing to cache.',
      },
      {
        type: 'p',
        text: 'It changes between turns. It does not change *during* one. Rounds two through eight of a single turn send byte-identical context, because nothing about the day has moved while the model is mid-thought. Marking it with a second cache breakpoint means every round after the first reads it at a tenth of the price instead of paying full rate for the same bytes.',
      },
      {
        type: 'code',
        lang: 'swift',
        code: `let system = [
    SystemBlock(text: Prompts.core, cache: true),      // static: ~4.6K tokens
    SystemBlock(text: Prompts.context(...), cache: true) // stable for this turn
]`,
      },
      {
        type: 'p',
        text: 'Caching is not a property of “static versus dynamic”. It is a property of byte-stability over the window you are billed across. Pick the window first, then look at what is stable inside it.',
      },
      { type: 'h2', text: 'What breaks a prefix without telling you' },
      {
        type: 'p',
        text: 'A cached prefix is a prefix match: one different byte at the front and you pay for everything behind it. So the context builder has to be disciplined about absences. The digest of places from the diary, for example, returns nil when there are no located entries — not an empty section, not a “no places yet” line. An empty section is still a difference, and it would move every byte after it.',
      },
      {
        type: 'list',
        items: [
          'Optional context must vanish completely when it is empty, not degrade to a placeholder.',
          'Anything ordered — memories, entries, tools — needs a stable order, or the prefix changes for no reason.',
          'Timestamps and counters near the top of a prompt are prefix poison.',
        ],
      },
      { type: 'h2', text: 'Verify it, do not assume it' },
      {
        type: 'p',
        text: 'All of this is invisible from the outside: an uncached run and a cached run return the same answer at the same speed. The only difference is the bill, which you see at the end of the month. So every response logs what actually happened.',
      },
      {
        type: 'code',
        lang: 'text',
        code: 'AGENT USAGE input=812 cache_read=5104 cache_write=0',
      },
      {
        type: 'p',
        text: 'A `cache_read` of zero on round two means the prefix broke and I am paying full price while believing I am not. It is one print statement, and it is the only thing standing between a caching strategy and a caching story.',
      },
      { type: 'h2', text: 'The bound that matters more than the cost' },
      {
        type: 'p',
        text: 'The loop is capped at eight tool rounds. Not because eight is optimal, but because an agent that can call tools in a loop can also loop forever, and the failure mode of a food logger that will not stop thinking is worse than one that occasionally gives up. Every failure path — a bad tool result, a network drop mid-stream, a cancelled turn — finalizes the assistant message gracefully rather than throwing. In a chat interface, a message that never resolves is the one bug users will not forgive.',
      },
      {
        type: 'quote',
        text: 'Cache what is stable for the window you are billed across, delete optional context instead of emptying it, and log the cache counters — otherwise you are guessing.',
      },
    ],
  },
  {
    slug: 'catching-cloned-notes-with-trigrams',
    title: 'Catching cloned notes with trigrams',
    date: '2026-08-20',
    summary:
      'Cloned session notes are the documentation failure auditors find first. Detecting them took twenty lines of set math — and one decision about what set to run it over that quietly determines whether it works at all.',
    tags: ['Notewell', 'algorithms', 'compliance'],
    body: [
      {
        type: 'p',
        text: 'In behaviour-therapy documentation, a cloned note is one session’s narrative pasted into another with the names and dates swapped. It is the first thing an auditor looks for, it is the finding that turns a review into a recoupment, and it is usually not fraud — it is a technician at 9pm writing their fifth note of the day.',
      },
      {
        type: 'p',
        text: 'Notewell flags it before anyone signs. The check is Jaccard similarity over word trigrams: split the text into overlapping three-word sequences, and compare the sets.',
      },
      {
        type: 'code',
        lang: 'ts',
        code: `function shingleSet(text: string, n = 3): Set<string> {
  const words = normalize(text).split(" ").filter(Boolean);
  const set = new Set<string>();
  for (let i = 0; i <= words.length - n; i++) {
    set.add(words.slice(i, i + n).join(" "));
  }
  return set;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  let intersection = 0;
  for (const s of small) if (large.has(s)) intersection++;
  return intersection / (a.size + b.size - intersection);
}`,
      },
      {
        type: 'p',
        text: 'Trigrams rather than words, because word overlap flags every note in the specialty — they all say “the client”, “prompt level”, “independent”. Trigrams rather than whole sentences, because the edits people actually make are small: a name, a date, a percentage. Three-word sequences survive those edits and still collapse when the paragraph is the same paragraph.',
      },
      { type: 'h2', text: 'Three decisions that keep it honest' },
      {
        type: 'p',
        text: '**Only the free text is compared.** Structured goal data repeats between sessions legitimately — the same programs, the same procedures, the same prompt levels, week after week. That is continuity of care, not cloning, and scoring it would flag every good clinician in the building.',
      },
      {
        type: 'p',
        text: '**Short notes are excluded.** Below twenty trigrams — roughly twenty-two words — two notes collide by coincidence. Those cases score zero rather than a similarity, because a false accusation of cloning is expensive in a way a missed one is not: it lands on a specific person’s record.',
      },
      {
        type: 'p',
        text: '**Two thresholds, not one.** 0.6 reads as “highly similar” and 0.85 as “near-identical”, and both are shown to the writer with the note they matched, while the note is still a draft. A black-box flag that says “suspicious” gets clicked past. One that says “86% of this text also appears in the note you wrote on Tuesday” gets fixed.',
      },
      { type: 'h2', text: 'The bug that would not have looked like a bug' },
      {
        type: 'p',
        text: 'The team dashboard reports clone rates per employee, and it is tempting to compute them the way you compute every other rate on that screen: filter the notes down to the slice you are displaying, then run the check.',
      },
      {
        type: 'p',
        text: 'Do that and the number is wrong in the most dangerous direction. Cloning is a relation between two notes, so slicing the input changes the question being asked. A note cloned across two different insurers looks perfectly clean inside each insurer’s slice — the pair is never in the same set at the same time. The dashboard would report zero, and it would be the payer with the split that finds it.',
      },
      {
        type: 'code',
        lang: 'ts',
        code: `// Callers must pass the set cloning is defined over — one provider's own
// notes. Slicing the input first (by payer, by client, by month) silently
// changes the question. Detect once per provider, then attribute the ids.
export function cloneInvolvedIds(notes: Note[], threshold = CLONE_WARN): Set<string>`,
      },
      {
        type: 'p',
        text: 'The fix is to detect over the whole provider set once, return the ids of every note involved in a pair, and let the dashboard attribute those ids to whatever slice it is drawing. Same numbers on screen, different meaning behind them.',
      },
      {
        type: 'quote',
        text: 'When a metric is a relation between two rows, filtering before you compute it does not narrow the answer — it changes the question.',
      },
    ],
  },
  {
    slug: 'where-the-model-is-allowed-to-write',
    title: 'Where the model is allowed to write',
    date: '2026-08-20',
    summary:
      'Notewell drafts clinical narratives with Claude, in a workflow where an invented detail is a false record. Making that safe was less about prompting and more about drawing a hard line around the one field the model is allowed to produce.',
    tags: ['Notewell', 'AI engineering', 'Claude API'],
    body: [
      {
        type: 'p',
        text: 'A session note has two kinds of content. There are facts — times, service codes, goals worked, prompt levels, trial data — and there is the narrative, a paragraph of clinical prose that ties them together. The facts are billing; the narrative is the part nobody has time to write.',
      },
      {
        type: 'p',
        text: 'So the model writes the narrative and nothing else. It does not pick service codes, it does not decide session hours, it does not sign anything. Everything it writes from is a field a human already filled in, handed over as JSON rather than described in prose.',
      },
      {
        type: 'code',
        lang: 'ts',
        code: `const payload = {
  session: { client, date, time, location, cpt_code, participants },
  goals_worked: goals.map((g) => ({
    goal: g.name, procedure: g.procedure,
    prompt_level: g.promptLevel, data: g.data,
    client_response: g.response,
  })),
  maladaptive_behaviors: input.behaviors || undefined,
  reinforcement: input.reinforcement || undefined,
  plan_next_session: input.plan || undefined,
};`,
      },
      {
        type: 'p',
        text: 'Note the `|| undefined` on the optional fields. An empty string invites the model to fill the gap; an absent key gives it nothing to fill. The system prompt says it plainly too — use only the data provided, never invent events, times, behaviours, percentages or outcomes, and if a field is empty, omit it. Both halves matter, and the payload shape is the half that does not depend on instruction-following.',
      },
      { type: 'h2', text: 'Refusals are a state, not an error' },
      {
        type: 'p',
        text: 'Clinical language about a child’s behaviour sits close to things a model may decline to write. When that happens the API does not fail — it comes back with `stop_reason: "refusal"`, and code that only handles thrown errors will happily save an empty narrative.',
      },
      {
        type: 'p',
        text: 'It is handled explicitly, and so is a model being unavailable: the request declares a fallback model, so a capacity blip degrades to a slightly different draft instead of a blank editor at 9pm. The draft is a starting point that a human edits and signs either way.',
      },
      { type: 'h2', text: 'The other place the system says “I don’t know”' },
      {
        type: 'p',
        text: 'The same instinct shows up somewhere with no model involved. Notewell reports how many notes were signed inside the 48-hour window payers expect. Some notes simply cannot be judged: a draft has no signature time yet.',
      },
      {
        type: 'code',
        lang: 'ts',
        code: `export function isTimely(note: Note): boolean | null {
  if (note.status !== "final" || !note.finalizedAt) return null;
  // Anchor the date-only sessionDate in UTC so the verdict doesn't flip with
  // the server's timezone; the +24h grace absorbs the missing time-of-day.
  const session = new Date(\`\${note.sessionDate}T00:00:00Z\`);
  const hours = (new Date(note.finalizedAt).getTime() - session.getTime()) / 36e5;
  if (hours < -24) return false;          // signed before the session happened
  return hours <= TIMELY_HOURS + 24;      // grace: session date has no time
}`,
      },
      {
        type: 'p',
        text: 'The return type is `boolean | null`, and the rate is computed only over the notes where the answer is knowable. Folding the unknowable ones into either bucket would produce a number that looks like a measurement and is not one — the same failure I had already made in a different codebase, where a third of a model’s measured error turned out to be [my benchmark’s own uncertainty](/notes/three-corrections-to-the-same-number).',
      },
      {
        type: 'p',
        text: 'Two details in those six lines are worth stealing. The session date has no time of day, so the comparison is anchored at UTC midnight and given a 24-hour grace rather than pretending to a precision the data does not have. And a note signed more than a day *before* its session is not late, it is impossible — that one returns false on purpose, because it is exactly the pattern an audit is looking for.',
      },
      {
        type: 'quote',
        text: 'In a compliance tool, the model gets the prose and nothing else. Everything the system has to be right about stays deterministic — and anything it cannot know returns null instead of a guess.',
      },
    ],
  },
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
];

export const publishedNotes = notes
  .filter((note) => !note.draft)
  // Newest first; notes sharing a date keep the order they appear in above.
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export function getNote(slug: string) {
  return publishedNotes.find((note) => note.slug === slug);
}
