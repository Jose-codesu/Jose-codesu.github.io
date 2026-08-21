'use client';

import { useMemo, useState } from 'react';
import {
  type EvalRun,
  type Row,
  evalMeta,
  metrics,
  rowsFor,
  runLabel,
  sortedRuns,
} from '@/lib/eval-metrics';
import { cn } from '@/lib/cn';

const SERIES = ['var(--series-a)', 'var(--series-b)'] as const;

export function EvalExplorer() {
  const [runAId, setRunAId] = useState(sortedRuns[0].id);
  const [runBId, setRunBId] = useState<string>('none');
  const [exactOnly, setExactOnly] = useState(true);
  const [active, setActive] = useState<string | null>(null);

  const runA = sortedRuns.find((run) => run.id === runAId) ?? sortedRuns[0];
  const runB = sortedRuns.find((run) => run.id === runBId);

  const rowsA = useMemo(() => rowsFor(runA, exactOnly), [runA, exactOnly]);
  const rowsB = useMemo(() => (runB ? rowsFor(runB, exactOnly) : null), [runB, exactOnly]);

  const statsA = useMemo(() => metrics(rowsA), [rowsA]);
  const statsB = useMemo(() => (rowsB ? metrics(rowsB) : null), [rowsB]);

  /** Rows are ordered by run A's signed error, so the shape reads as a
   *  distribution — over-estimates at the top, under-estimates at the bottom —
   *  and stays put when a comparison run is added. */
  const ordered = useMemo(
    () => [...rowsA].sort((a, b) => (b.error ?? -Infinity) - (a.error ?? -Infinity)),
    [rowsA],
  );

  const scale = useMemo(() => {
    const values = [...rowsA, ...(rowsB ?? [])]
      .map((row) => Math.abs(row.error ?? 0))
      .filter(Boolean);
    const max = Math.max(20, ...values);
    return Math.ceil(max / 10) * 10;
  }, [rowsA, rowsB]);

  const activeRow = ordered.find((row) => row.photo.id === active);
  const activeB = rowsB?.find((row) => row.photo.id === active);

  return (
    <div>
      {/* ---- Controls: one row, above the chart ------------------------- */}
      <div className="flex flex-col gap-4 border-y border-line py-5 sm:flex-row sm:flex-wrap sm:items-end">
        <RunPicker
          label="Run"
          value={runAId}
          onChange={setRunAId}
          swatch={SERIES[0]}
          runs={sortedRuns}
        />
        <RunPicker
          label="Compare with"
          value={runBId}
          onChange={setRunBId}
          swatch={SERIES[1]}
          runs={sortedRuns.filter((run) => run.id !== runAId)}
          allowNone
        />

        <label className="flex cursor-pointer items-center gap-2.5 text-[13px] sm:ml-auto sm:pb-1.5">
          <input
            type="checkbox"
            checked={!exactOnly}
            onChange={(event) => setExactOnly(!event.target.checked)}
            className="size-4 accent-[var(--series-a)]"
          />
          Include the 3 photos whose truth is itself an estimate
        </label>
      </div>

      {/* ---- Headline numbers ------------------------------------------- */}
      <dl className="grid grid-cols-2 gap-x-6 gap-y-6 py-8 sm:grid-cols-4">
        <Stat label="Mean abs. error" value={statsA.mae} compare={statsB?.mae} suffix="%" />
        <Stat label="Median abs. error" value={statsA.median} compare={statsB?.median} suffix="%" />
        <Stat label="Within ±20%" value={statsA.within20} compare={statsB?.within20} suffix="%" />
        <Stat label="Photos scored" value={statsA.n} compare={statsB?.n} decimals={0} />
      </dl>

      {!exactOnly && (
        <p className="mb-6 rounded-xl border border-line bg-panel px-5 py-4 text-[14px] leading-relaxed text-muted">
          Those three photos are cases where I could not establish the real calories precisely, so
          the error being measured includes my own uncertainty. Watch the mean move while the
          median barely does — that is the shape of noise, not of a worse model.
        </p>
      )}

      {/* ---- Chart ------------------------------------------------------- */}
      <figure>
        <figcaption className="flex flex-wrap items-baseline justify-between gap-4 pb-4">
          <h3 className="text-[15px] font-medium tracking-tight">
            Estimation error by photo
            <span className="ml-2 font-normal text-muted">
              over-estimate right, under-estimate left
            </span>
          </h3>

          {runB && (
            <ul className="flex items-center gap-4 font-mono text-[11px]">
              {[runA, runB].map((run, index) => (
                <li key={run.id} className="flex items-center gap-1.5 text-muted">
                  <span
                    aria-hidden
                    className="size-2.5 rounded-[2px]"
                    style={{ background: SERIES[index] }}
                  />
                  {runLabel(run)}
                </li>
              ))}
            </ul>
          )}
        </figcaption>

        <ul className="border-t border-line">
          {ordered.map((row) => {
            const other = rowsB?.find((candidate) => candidate.photo.id === row.photo.id) ?? null;

            return (
              <li
                key={row.photo.id}
                tabIndex={0}
                onMouseEnter={() => setActive(row.photo.id)}
                onFocus={() => setActive(row.photo.id)}
                onMouseLeave={() => setActive(null)}
                onBlur={() => setActive(null)}
                aria-label={describe(row, other)}
                className={cn(
                  'grid grid-cols-[8.5rem_1fr] items-center gap-3 border-b border-line py-2.5 transition-colors sm:grid-cols-[11rem_1fr] sm:gap-5',
                  active === row.photo.id && 'bg-panel',
                )}
              >
                <div className="min-w-0">
                  <p className="truncate text-[13px]">{row.photo.label}</p>
                  {row.photo.confidence === 'approximate' && (
                    <p className="font-mono text-[10px] tracking-wide text-faint uppercase">
                      approx. truth
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-[2px]">
                  <Bar error={row.error} scale={scale} color={SERIES[0]} />
                  {other && <Bar error={other.error} scale={scale} color={SERIES[1]} />}
                </div>
              </li>
            );
          })}
        </ul>

        {/* Axis, under the plot column only. */}
        <div className="grid grid-cols-[8.5rem_1fr] gap-3 pt-2 sm:grid-cols-[11rem_1fr] sm:gap-5">
          <span />
          <div className="relative h-4 font-mono text-[10px] text-faint">
            <span className="absolute left-0">−{scale}%</span>
            <span className="absolute left-1/2 -translate-x-1/2">0</span>
            <span className="absolute right-0">+{scale}%</span>
          </div>
        </div>

        {/* ---- Readout: replaces a floating tooltip, works on focus too --- */}
        <div className="mt-6 min-h-[4.5rem] rounded-xl border border-line bg-panel px-5 py-4">
          {activeRow ? (
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-[13px]">
              <Readout label="Photo" value={activeRow.photo.label} />
              <Readout label="Real" value={`${activeRow.photo.truth} kcal`} />
              <Readout
                label={runLabel(runA)}
                value={
                  activeRow.estimate === null
                    ? 'not scored'
                    : `${activeRow.estimate} kcal · ${signed(activeRow.error)}`
                }
              />
              {activeB && (
                <Readout
                  label={runLabel(runB!)}
                  value={
                    activeB.estimate === null
                      ? 'not scored'
                      : `${activeB.estimate} kcal · ${signed(activeB.error)}`
                  }
                />
              )}
              {activeRow.spread !== undefined && (
                <Readout label="Spread over 3 runs" value={`${activeRow.spread} kcal`} />
              )}
              {activeRow.latency !== undefined && (
                <Readout label="Latency" value={`${activeRow.latency}s`} />
              )}
            </div>
          ) : (
            <p className="text-[13px] text-faint">
              Hover or tab through a row to see the real value, the estimate and the latency.
            </p>
          )}
        </div>
      </figure>

      <p className="mt-6 text-[13px] leading-relaxed text-faint">
        {evalMeta.note} Runs marked <span className="font-mono">shipped</span> use the prompt
        extracted from the app source; the rest are prompt candidates.{' '}
        {runA.repeats === 3
          ? 'This run scores the median of three passes per photo.'
          : 'This run is a single pass per photo, so a few points of the error are run-to-run noise.'}
      </p>
    </div>
  );
}

function Bar({ error, scale, color }: { error: number | null; scale: number; color: string }) {
  if (error === null) {
    return (
      <div className="relative h-[11px]">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] text-faint">
          not scored
        </span>
      </div>
    );
  }

  const magnitude = Math.min(Math.abs(error), scale);
  const width = (magnitude / scale) * 50;
  const positive = error >= 0;

  return (
    <div className="relative h-[11px]">
      {/* Zero baseline: recessive, and the only vertical rule in the plot. */}
      <span aria-hidden className="absolute inset-y-[-3px] left-1/2 w-px bg-line-strong" />
      <span
        aria-hidden
        className="absolute top-0 h-full"
        style={{
          background: color,
          width: `${width}%`,
          left: positive ? '50%' : `${50 - width}%`,
          borderRadius: positive ? '0 4px 4px 0' : '4px 0 0 4px',
        }}
      />
      <span
        className={cn(
          'absolute top-1/2 -translate-y-1/2 font-mono text-[10px] text-muted tabular-nums',
          positive ? 'text-left' : 'text-right',
        )}
        style={positive ? { left: `calc(50% + ${width}% + 6px)` } : { right: `calc(50% + ${width}% + 6px)` }}
      >
        {signed(error)}
      </span>
    </div>
  );
}

function RunPicker({
  label,
  value,
  onChange,
  runs,
  swatch,
  allowNone,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  runs: EvalRun[];
  swatch: string;
  allowNone?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="eyebrow flex items-center gap-2">
        <span aria-hidden className="size-2.5 rounded-[2px]" style={{ background: swatch }} />
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 rounded-full border border-line bg-panel px-4 pr-8 font-mono text-[12px] text-fg"
      >
        {allowNone && <option value="none">none</option>}
        {runs.map((run) => (
          <option key={run.id} value={run.id}>
            {runLabel(run)} · {run.date}
          </option>
        ))}
      </select>
    </label>
  );
}

function Stat({
  label,
  value,
  compare,
  suffix = '',
  decimals = 1,
}: {
  label: string;
  value: number | null;
  compare?: number | null;
  suffix?: string;
  decimals?: number;
}) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-2 font-display text-[2rem] leading-none tracking-tight tabular-nums">
        {value === null ? '—' : `${value.toFixed(decimals)}${suffix}`}
      </dd>
      {compare !== null && compare !== undefined && (
        <dd className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-muted tabular-nums">
          <span aria-hidden className="size-2 rounded-[2px]" style={{ background: SERIES[1] }} />
          {compare.toFixed(decimals)}
          {suffix}
        </dd>
      )}
    </div>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex flex-col">
      <span className="eyebrow">{label}</span>
      <span className="mt-1 tabular-nums">{value}</span>
    </p>
  );
}

function signed(error: number | null) {
  if (error === null) return '—';
  return `${error >= 0 ? '+' : '−'}${Math.abs(error).toFixed(1)}%`;
}

function describe(row: Row, other: Row | null) {
  const base = `${row.photo.label}: real ${row.photo.truth} kcal, estimated ${
    row.estimate ?? 'not scored'
  }, error ${signed(row.error)}`;
  return other ? `${base}; comparison run error ${signed(other.error)}` : base;
}
