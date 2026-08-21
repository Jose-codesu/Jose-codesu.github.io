/**
 * Renders every social card to public/og/*.png at build time.
 *
 * Why a script instead of Next's `opengraph-image.tsx`: that convention emits an
 * extensionless file (`/opengraph-image`), and GitHub Pages serves unknown
 * extensions as octet-stream — which several social crawlers refuse to render.
 * Real `.png` files in /public sidestep the problem and stay byte-identical
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

/**
 * One layout for every card: eyebrow, display headline, supporting line, footer.
 * Keeping them identical is what makes a shared link recognisable as this site.
 */
function card({ eyebrow, headline, support, footer = 'jose-codesu.github.io' }) {
  return h(
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
      h('div', { style: { fontSize: 22, letterSpacing: 5, color: MUTED } }, eyebrow),
    ),
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column' } },
      h(
        'div',
        {
          style: {
            display: 'flex',
            fontFamily: 'Instrument Serif',
            // Long project taglines need to breathe; short headlines get to shout.
            fontSize: headline.length > 34 ? 76 : 96,
            lineHeight: 1.04,
            letterSpacing: -1,
          },
        },
        headline,
      ),
      h(
        'div',
        {
          style: {
            display: 'flex',
            marginTop: 28,
            fontSize: 27,
            lineHeight: 1.45,
            color: MUTED,
            maxWidth: 900,
          },
        },
        support,
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
      h('div', { style: { display: 'flex', color: MUTED } }, footer),
    ),
  );
}

async function render(element) {
  const svg = await satori(element, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: sans, weight: 400, style: 'normal' },
      { name: 'Inter', data: sansSemibold, weight: 600, style: 'normal' },
      { name: 'Instrument Serif', data: serif, weight: 400, style: 'normal' },
    ],
  });

  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}

/**
 * Project copy is read out of the content module with a regex rather than by
 * importing it: `projects.ts` is TypeScript, and this script runs in bare Node
 * before the build. The fields it needs are plain string literals.
 */
async function readProjects() {
  const source = await readFile(resolve(root, 'src/content/projects.ts'), 'utf8');
  const projects = [];

  const blocks = source.split(/\n  \{\n/).slice(1);
  for (const block of blocks) {
    const field = (name) => block.match(new RegExp(`${name}: '((?:[^'\\\\]|\\\\.)*)'`))?.[1];
    const slug = field('slug');
    const name = field('name');
    const tagline = field('tagline');
    const draft = /draft: true/.test(block);
    if (slug && name && tagline && !draft) {
      projects.push({ slug, name, tagline: tagline.replace(/\\'/g, "'") });
    }
  }

  return projects;
}

const outDir = resolve(root, 'public/og');
await mkdir(outDir, { recursive: true });

const written = [];

async function write(name, element) {
  const png = await render(element);
  await writeFile(resolve(outDir, `${name}.png`), png);
  written.push(`${name}.png (${(png.length / 1024).toFixed(0)} KB)`);
}

// Home / default card.
await write(
  'default',
  card({
    eyebrow: 'MIAMI, FL · AI ENGINEER',
    headline: 'I build AI products end to end.',
    support:
      'Agent loops on the Claude API, local-first SwiftUI apps, and Next.js tools that hold up under an audit.',
  }),
);

// One card per project, so a shared case study shows its own headline.
const projects = await readProjects();
for (const project of projects) {
  await write(
    `work-${project.slug}`,
    card({
      eyebrow: `CASE STUDY · ${project.name.toUpperCase()}`,
      headline: project.tagline.endsWith('.') ? project.tagline : `${project.tagline}.`,
      support: 'Problem, decisions and what shipped — the full case study.',
      footer: `jose-codesu.github.io/work/${project.slug}`,
    }),
  );
}

console.log(`✓ public/og — ${written.join(', ')}`);
