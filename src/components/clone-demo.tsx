'use client';

import { useMemo, useState } from 'react';
import { CLONE_SEVERE, CLONE_WARN, MIN_SHINGLES, compare, markSharedWords } from '@/lib/clone-detect';
import { cn } from '@/lib/cn';

/* Synthetic notes written for this demo. No real client, session or provider
   is represented here, and none ever will be — the whole point of the product
   is that records like these are handled carefully. */
const ORIGINAL = `Session conducted in the home setting with the client and caregiver present. The RBT implemented discrete trial training targeting the manding for preferred items program at the independent prompt level. The client responded appropriately across 10 of 12 trials, with two errors corrected using a least-to-most prompting sequence. Vocal stereotypy was observed twice during transitions and was redirected to the current task without escalation. Reinforcement was delivered on a variable ratio schedule using access to preferred items. The client remained engaged for the full session and the plan is to continue the current targets next session.`;

const CLONED = `Session conducted in the home setting with the client and caregiver present. The RBT implemented discrete trial training targeting the manding for preferred items program at the independent prompt level. The client responded appropriately across 9 of 12 trials, with three errors corrected using a least-to-most prompting sequence. Vocal stereotypy was observed once during transitions and was redirected to the current task without escalation. Reinforcement was delivered on a variable ratio schedule using access to preferred items. The client remained engaged for the full session and the plan is to continue the current targets next session.`;

const DIFFERENT = `Session ran at the clinic with the client and one peer present for part of the hour. Work focused on the following one-step instructions program using errorless teaching, with the RBT fading from a full physical prompt to a gestural prompt across the session. Independent responding reached 70 percent by the final block. One instance of elopement occurred at a transition; the client returned to the table after a short break and a first-then statement. Edible reinforcement was paired with behaviour-specific praise throughout. The next session will probe generalization with a second instructor.`;

export function CloneDemo() {
  const [a, setA] = useState(ORIGINAL);
  const [b, setB] = useState(CLONED);

  const result = useMemo(() => compare(a, b), [a, b]);
  const marked = useMemo(() => markSharedWords(b, a), [a, b]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-y border-line py-5">
        <Preset
          label="A cloned pair"
          onClick={() => {
            setA(ORIGINAL);
            setB(CLONED);
          }}
        />
        <Preset
          label="Two genuine sessions"
          onClick={() => {
            setA(ORIGINAL);
            setB(DIFFERENT);
          }}
        />
        <Preset
          label="Too short to score"
          onClick={() => {
            setA('Client did well today.');
            setB('Client did well today.');
          }}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <NoteField label="Note A" value={a} onChange={setA} />
        <NoteField label="Note B" value={b} onChange={setB} />
      </div>

      {/* ---- Verdict ------------------------------------------------------ */}
      <div className="mt-8 rounded-2xl border border-line bg-panel px-6 py-7">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Jaccard similarity</p>
            <p className="mt-2 font-display text-[3rem] leading-none tracking-tight tabular-nums">
              {result.tooShort ? '—' : result.score.toFixed(3)}
            </p>
          </div>
          <Verdict result={result} />
        </div>

        <Meter score={result.tooShort ? 0 : result.score} muted={result.tooShort} />

        <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
          <Figure label="Trigrams in A" value={result.sizeA} />
          <Figure label="Trigrams in B" value={result.sizeB} />
          <Figure label="Shared" value={result.shared} />
          <Figure label="Union" value={result.union} />
        </dl>

        {result.tooShort && (
          <p className="mt-6 text-[14px] leading-relaxed text-muted">
            One of the notes is under {MIN_SHINGLES} trigrams — about {MIN_SHINGLES + 2} words.
            Below that, two unrelated notes collide by coincidence, so the check returns nothing
            rather than an accusation. A false clone flag lands on a specific person’s record;
            silence is the cheaper mistake here.
          </p>
        )}
      </div>

      {!result.tooShort && (
        <section className="mt-10">
          <h3 className="eyebrow">Note B, with the text it shares with A</h3>
          <p className="mt-4 text-[16px] leading-[1.9]">
            {marked.map((token, index) => (
              <span
                key={index}
                className={
                  token.shared
                    ? 'rounded-sm bg-accent-soft px-0.5 py-0.5 text-fg'
                    : 'text-muted'
                }
              >
                {token.word}{' '}
              </span>
            ))}
          </p>
          <p className="mt-5 text-[13px] leading-relaxed text-faint">
            Highlighted words sit inside a three-word sequence that also appears in note A. This is
            what the provider sees next to the score — a flag that says “suspicious” gets clicked
            past; one that shows the overlap gets fixed.
          </p>
        </section>
      )}
    </div>
  );
}

function NoteField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="eyebrow">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={9}
        spellCheck={false}
        className="w-full resize-y rounded-xl border border-line bg-panel p-4 text-[14px] leading-relaxed text-fg outline-none focus-visible:border-line-strong"
      />
    </label>
  );
}

function Preset({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="pressable rounded-full border border-line px-4 py-2 font-mono text-[11px] text-muted hover:border-line-strong hover:text-fg"
    >
      {label}
    </button>
  );
}

function Verdict({ result }: { result: ReturnType<typeof compare> }) {
  const map = {
    severe: { label: 'Near-identical', color: 'var(--color-danger)', icon: '!' },
    warn: { label: 'Highly similar', color: 'var(--color-accent)', icon: '!' },
    clean: { label: 'No clone detected', color: 'var(--color-good)', icon: '✓' },
    unscored: { label: 'Not scored', color: 'var(--color-faint)', icon: '–' },
  } as const;

  const state = map[result.verdict];

  return (
    <p className="flex items-center gap-2.5 text-[15px]">
      {/* Icon plus label: the state never depends on colour alone. */}
      <span
        aria-hidden
        className="grid size-6 place-items-center rounded-full text-[12px] font-medium text-bg"
        style={{ background: state.color }}
      >
        {state.icon}
      </span>
      {state.label}
    </p>
  );
}

function Meter({ score, muted }: { score: number; muted: boolean }) {
  return (
    <div className="mt-7">
      <div className="relative h-2 rounded-full bg-line">
        <span
          className={cn('absolute inset-y-0 left-0 rounded-full transition-[width] duration-200')}
          style={{
            width: `${score * 100}%`,
            background: muted
              ? 'var(--color-faint)'
              : score >= CLONE_SEVERE
                ? 'var(--color-danger)'
                : score >= CLONE_WARN
                  ? 'var(--color-accent)'
                  : 'var(--color-good)',
          }}
        />
        {[CLONE_WARN, CLONE_SEVERE].map((threshold) => (
          <span
            key={threshold}
            aria-hidden
            className="absolute inset-y-[-4px] w-px bg-fg/40"
            style={{ left: `${threshold * 100}%` }}
          />
        ))}
      </div>

      <div className="relative mt-2 h-4 font-mono text-[10px] text-faint">
        <span className="absolute left-0">0</span>
        <span className="absolute -translate-x-1/2" style={{ left: `${CLONE_WARN * 100}%` }}>
          {CLONE_WARN} warn
        </span>
        <span className="absolute -translate-x-1/2" style={{ left: `${CLONE_SEVERE * 100}%` }}>
          {CLONE_SEVERE} severe
        </span>
        <span className="absolute right-0">1</span>
      </div>
    </div>
  );
}

function Figure({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-1.5 font-mono text-[18px] tabular-nums">{value}</dd>
    </div>
  );
}
