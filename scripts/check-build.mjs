/**
 * Guards the static export before it goes live.
 *
 * A broken portfolio is worse than a plain one, and the failure modes here are
 * silent: a page that exports empty, an image that never made it into /public,
 * a stale link to a route that no longer exists. Fast to check, so CI checks it
 * on every push (see .github/workflows/deploy.yml).
 */
import { readFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'out');
const failures = [];

async function exists(path) {
  try {
    await stat(resolve(out, path));
    return true;
  } catch {
    return false;
  }
}

/** Every route that must render, plus a string that proves it rendered. */
const PAGES = [
  ['index.html', 'I build AI products'],
  ['work/index.html', 'Three products, built solo'],
  ['work/savor/index.html', 'Sage'],
  ['work/habitat/index.html', 'Habitat'],
  ['work/notewell/index.html', 'Notewell'],
  ['credentials/index.html', 'L1C473ZFU50D'], // the credential ID itself, not the label
  ['about/index.html', 'Principles'],
  ['resume/index.html', 'Selected work'],
  ['404.html', 'does not exist'],
  ['notes/index.html', 'Things worth writing down'],
  ['lab/index.html', 'run it'],
  ['lab/eval/index.html', 'Sixteen photos'],
  ['lab/clone/index.html', 'Jaccard similarity'],
];

const FILES = [
  '.nojekyll', // without this, Pages drops the _next directory and the site loads unstyled
  'sitemap.xml',
  'robots.txt',
  'feed.xml',
  'og/default.png',
  'og/work-savor.png',
  'Jose-Lavin-Resume.pdf',
];

for (const [page, needle] of PAGES) {
  if (!(await exists(page))) {
    failures.push(`missing page: ${page}`);
    continue;
  }

  const html = await readFile(resolve(out, page), 'utf8');
  if (!html.includes(needle)) failures.push(`${page} rendered without "${needle}"`);
  if (html.length < 2000) failures.push(`${page} is suspiciously small (${html.length} bytes)`);
}

for (const file of FILES) {
  if (!(await exists(file))) failures.push(`missing file: ${file}`);
}

// Every local image referenced by a built page must exist on disk.
const home = await readFile(resolve(out, 'work/habitat/index.html'), 'utf8').catch(() => '');
for (const match of home.matchAll(/src="(\/media\/[^"]+)"/g)) {
  const asset = match[1].replace(/^\//, '');
  if (!(await exists(asset))) failures.push(`referenced image is missing: ${match[1]}`);
}

if (failures.length > 0) {
  console.error('✗ build check failed:');
  for (const failure of failures) console.error(`  · ${failure}`);
  process.exit(1);
}

console.log(`✓ build check passed — ${PAGES.length} pages, ${FILES.length} files`);
