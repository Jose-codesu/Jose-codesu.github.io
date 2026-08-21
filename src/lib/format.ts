/** Dates are stored as ISO strings and rendered in UTC so the output never
 *  shifts by a day depending on where the visitor is. */
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function parts(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m: (m ?? 1) - 1, d: d ?? 1 };
}

/** "January 2025" */
export function monthYear(iso: string) {
  const { y, m } = parts(iso);
  return `${MONTHS[m]} ${y}`;
}

/** "Jan 2025" */
export function shortMonthYear(iso: string) {
  const { y, m } = parts(iso);
  return `${MONTHS[m].slice(0, 3)} ${y}`;
}

/** "January 15, 2025" */
export function longDate(iso: string) {
  const { y, m, d } = parts(iso);
  return `${MONTHS[m]} ${d}, ${y}`;
}

/** "Jul 2024 — Present" */
export function dateRange(start: string, end: string | null) {
  return `${shortMonthYear(start)} — ${end ? shortMonthYear(end) : 'Present'}`;
}

/** "1 yr 2 mo" — approximate, rounded down to whole months. */
export function duration(start: string, end: string | null) {
  const s = parts(start);
  const e = end ? parts(end) : (() => { const n = new Date(); return { y: n.getUTCFullYear(), m: n.getUTCMonth(), d: n.getUTCDate() }; })();
  const months = Math.max(1, (e.y - s.y) * 12 + (e.m - s.m) + 1);
  const yrs = Math.floor(months / 12);
  const rem = months % 12;
  return [yrs ? `${yrs} yr` : '', rem ? `${rem} mo` : ''].filter(Boolean).join(' ');
}
