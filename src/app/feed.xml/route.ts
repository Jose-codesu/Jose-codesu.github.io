import { site } from '@/content/site';
import { sortedLog } from '@/content/log';
import { publishedNotes } from '@/content/notes';

/** Prerendered into ./out at build time; GitHub Pages serves it as a file. */
export const dynamic = 'force-static';

interface FeedItem {
  title: string;
  link: string;
  description: string;
  date: string;
}

function escape(value: string) {
  return value
    .replace(/`([^`]+)`/g, '$1') // inline-code markers are for the site, not the feed
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** ISO date (no time) → RFC 822, which is what RSS readers expect. */
function rfc822(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toUTCString();
}

export function GET() {
  const items: FeedItem[] = [
    ...publishedNotes.map((note) => ({
      title: note.title,
      link: `${site.url}/notes/${note.slug}/`,
      description: note.summary,
      date: note.date,
    })),
    ...sortedLog.map((entry) => ({
      title: entry.title,
      link: entry.href ?? `${site.url}/about/`,
      description: entry.body,
      date: entry.date,
    })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site.seo.title)}</title>
    <link>${site.url}</link>
    <description>${escape(site.seo.description)}</description>
    <language>en-us</language>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />
${items
  .map(
    (item) => `    <item>
      <title>${escape(item.title)}</title>
      <link>${escape(item.link)}</link>
      <guid isPermaLink="false">${escape(item.link)}#${item.date}</guid>
      <pubDate>${rfc822(item.date)}</pubDate>
      <description>${escape(item.description)}</description>
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
