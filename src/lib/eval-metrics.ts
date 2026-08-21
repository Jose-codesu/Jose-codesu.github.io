import data from '@/content/data/savor-evals.json';

export interface EvalPhoto {
  id: string;
  label: string;
  group: string;
  confidence: 'exact' | 'approximate';
  truth: number;
}

export interface EvalRun {
  id: string;
  model: string;
  prompt: string;
  date: string;
  repeats: number;
  estimates: Record<string, { kcal: number; latency?: number; spread?: number }>;
}

export const photos = data.photos as EvalPhoto[];
export const runs = data.runs as EvalRun[];
export const evalMeta = data.meta as { note: string; photos: number };

export interface Row {
  photo: EvalPhoto;
  estimate: number | null;
  /** Signed percentage: positive means the model over-estimated. */
  error: number | null;
  latency?: number;
  spread?: number;
}

export function rowsFor(run: EvalRun, exactOnly: boolean): Row[] {
  return photos
    .filter((photo) => !exactOnly || photo.confidence === 'exact')
    .map((photo) => {
      const estimate = run.estimates[photo.id];
      if (!estimate) return { photo, estimate: null, error: null };

      return {
        photo,
        estimate: estimate.kcal,
        error: ((estimate.kcal - photo.truth) / photo.truth) * 100,
        latency: estimate.latency,
        spread: estimate.spread,
      };
    });
}

export interface Metrics {
  n: number;
  mae: number | null;
  median: number | null;
  within20: number | null;
}

/**
 * Mean absolute error, median absolute error, and the share of estimates inside
 * ±20%. Photos the run never completed are excluded rather than counted as
 * zero — an average over cases you did not measure is not a measurement.
 */
export function metrics(rows: Row[]): Metrics {
  const errors = rows
    .map((row) => row.error)
    .filter((error): error is number => error !== null)
    .map(Math.abs);

  if (errors.length === 0) return { n: 0, mae: null, median: null, within20: null };

  const sorted = [...errors].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return {
    n: errors.length,
    mae: errors.reduce((total, error) => total + error, 0) / errors.length,
    median:
      sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle],
    within20: (errors.filter((error) => error <= 20).length / errors.length) * 100,
  };
}

/** Newest first, then by model — the order the run picker shows. */
export const sortedRuns = [...runs].sort(
  (a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.id.localeCompare(b.id)),
);

export function runLabel(run: EvalRun) {
  return `${run.model} · ${run.prompt}`;
}
