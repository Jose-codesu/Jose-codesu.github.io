import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { visibleProjects } from '@/content/projects';
import { publishedNotes } from '@/content/notes';

/** Static export writes this to /sitemap.xml at build time. */
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = ['', '/work', '/lab', '/lab/eval', '/lab/clone', '/credentials', '/about', '/resume'];
  if (publishedNotes.length > 0) base.push('/notes');

  const routes = base.map((path) => ({
    url: `${site.url}${path}/`,
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const projects = visibleProjects.map((project) => ({
    url: `${site.url}/work/${project.slug}/`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const noteRoutes = publishedNotes.map((note) => ({
    url: `${site.url}/notes/${note.slug}/`,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  return [...routes, ...projects, ...noteRoutes];
}
