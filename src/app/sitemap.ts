import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { visibleProjects } from '@/content/projects';

/** Static export writes this to /sitemap.xml at build time. */
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/work', '/credentials', '/about'].map((path) => ({
    url: `${site.url}${path}/`,
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const projects = visibleProjects.map((project) => ({
    url: `${site.url}/work/${project.slug}/`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...projects];
}
