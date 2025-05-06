/**
 * Sitemap configuration for Threadrize
 * Used by the dynamic sitemap.xml generation
 */

export interface SitemapPage {
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export const sitemapPages: SitemapPage[] = [
  {
    url: '/',
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 1.0
  },
];

export const excludedRoutes = [
  '/api',
  '/_next',
  '/404',
  '/500'
];