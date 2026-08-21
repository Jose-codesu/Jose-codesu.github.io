/**
 * The clone detector from Notewell's `src/lib/similarity.ts`, unchanged apart
 * from the export surface: Jaccard similarity over word trigrams.
 *
 * It runs entirely in the browser on this site, which is the point of the demo
 * — the algorithm needs no server, no model and no API key. It is set math.
 */

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function shingleSet(text: string, n = 3): Set<string> {
  const words = normalize(text).split(' ').filter(Boolean);
  const set = new Set<string>();
  for (let i = 0; i <= words.length - n; i++) {
    set.add(words.slice(i, i + n).join(' '));
  }
  return set;
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  let intersection = 0;
  for (const s of small) if (large.has(s)) intersection++;
  return intersection / (a.size + b.size - intersection);
}

/** Below this many trigrams (~22 words) short notes collide by coincidence. */
export const MIN_SHINGLES = 20;
export const CLONE_WARN = 0.6;
export const CLONE_SEVERE = 0.85;

export type CompareResult = {
  score: number;
  shared: number;
  union: number;
  sizeA: number;
  sizeB: number;
  /** True when either note is too short for the score to mean anything. */
  tooShort: boolean;
  verdict: 'clean' | 'warn' | 'severe' | 'unscored';
};

export function compare(a: string, b: string): CompareResult {
  const setA = shingleSet(a);
  const setB = shingleSet(b);
  const tooShort = setA.size < MIN_SHINGLES || setB.size < MIN_SHINGLES;

  let shared = 0;
  for (const shingle of setA) if (setB.has(shingle)) shared++;
  const union = setA.size + setB.size - shared;
  const score = tooShort ? 0 : jaccard(setA, setB);

  return {
    score,
    shared,
    union,
    sizeA: setA.size,
    sizeB: setB.size,
    tooShort,
    verdict: tooShort
      ? 'unscored'
      : score >= CLONE_SEVERE
        ? 'severe'
        : score >= CLONE_WARN
          ? 'warn'
          : 'clean',
  };
}

/**
 * Marks which words of `text` sit inside a trigram that also appears in
 * `other`, so the overlap can be shown rather than asserted.
 */
export function markSharedWords(text: string, other: string): { word: string; shared: boolean }[] {
  const otherSet = shingleSet(other);
  const raw = text.split(/(\s+)/).filter((token) => token.trim().length > 0);
  const normalized = raw.map((token) => normalize(token));
  const shared = new Array<boolean>(raw.length).fill(false);

  for (let i = 0; i <= normalized.length - 3; i++) {
    const trigram = normalized.slice(i, i + 3).join(' ');
    if (otherSet.has(trigram)) {
      shared[i] = true;
      shared[i + 1] = true;
      shared[i + 2] = true;
    }
  }

  return raw.map((word, index) => ({ word, shared: shared[index] }));
}
