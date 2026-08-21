/**
 * Renders the social card to public/og.png at build time.
 *
 * Why a script instead of Next's `opengraph-image.tsx`: that convention emits an
 * extensionless file (`/opengraph-image`), and GitHub Pages serves unknown
 * extensions as octet-stream — which several social crawlers refuse to render.
 * A real `.png` in /public sidesteps the whole problem and stays byte-identical
 * between local builds and CI.
 *
 * Run: node scripts/generate-og.mjs  (wired to `prebuild`)
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const INK = '#171614';
const PAPER = '#F0EDE8';
const MUTED = '#9A938A';
const ACCENT = '#E8712F';

/* Static instances, not variable TTFs: satori's font parser chokes on `fvar`. */
const [serif, sans, sansSemibold] = await Promise.all([
  readFile(resolve(root, 'assets/fonts/InstrumentSerif-Regular.ttf')),
  readFile(resolve(root, 'assets/fonts/Inter-Regular.ttf')),
  readFile(resolve(root, 'assets/fonts/Inter-SemiBold.ttf')),
]);

/** satori takes React-element-shaped objects; no JSX runtime needed here. */
const h = (type, props = {}, ...children) => ({
  type,
  props: { ...props, children: children.length <= 1 ? children[0] : children },
});

const card = h(
  'div',
  {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: INK,
      color: PAPER,
      padding: '72px 80px',
      fontFamily: 'Inter',
    },
  },
  h(
    'div',
    { style: { display: 'flex', alignItems: 'center', gap: 14 } },
    h('div', { style: { width: 12, height: 12, borderRadius: 999, backgroundColor: ACCENT } }),
    h(
      'div',
      { style: { fontSize: 22, letterSpacing: 5, color: MUTED } },
      'MIAMI, FL · AI ENGINEER',
    ),
  ),
  h(
    'div',
    { style: { display: 'flex', flexDirection: 'column' } },
    h(
      'div',
      { style: { display: 'flex', fontFamily: 'Instrument Serif', fontSize: 96, lineHeight: 1.02, letterSpacing: -1 } },
      'I build AI products end to end.',
    ),
    h(
      'div',
      { style: { display: 'flex', marginTop: 28, fontSize: 27, lineHeight: 1.45, color: MUTED, maxWidth: 880 } },
      'Agent loops on the Claude API, local-first SwiftUI apps, and Next.js tools that hold up under an audit.',
    ),
  ),
  h(
    'div',
    {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderTop: `1px solid ${MUTED}40`,
        paddingTop: 26,
        fontSize: 24,
      },
    },
    h('div', { style: { display: 'flex', fontWeight: 600 } }, 'Jose Lavin'),
    h('div', { style: { display: 'flex', color: MUTED } }, 'jose-codesu.github.io'),
  ),
);

const svg = await satori(card, {
  width: 1200,
  height: 630,
  fonts: [
    { name: 'Inter', data: sans, weight: 400, style: 'normal' },
    { name: 'Inter', data: sansSemibold, weight: 600, style: 'normal' },
    { name: 'Instrument Serif', data: serif, weight: 400, style: 'normal' },
  ],
});

const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

await mkdir(resolve(root, 'public'), { recursive: true });
await writeFile(resolve(root, 'public/og.png'), png);

console.log(`✓ public/og.png — ${(png.length / 1024).toFixed(0)} KB`);
