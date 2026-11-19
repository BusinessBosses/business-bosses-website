import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://businessbosses.co.uk';
  const now = new Date();

  // Core public & SEO-indexable routes
  const staticRoutes: { url: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { url: `${baseUrl}/`, priority: 1.0, changeFrequency: 'daily' },
    { url: `${baseUrl}/feed/`, priority: 0.9, changeFrequency: 'hourly' },
    { url: `${baseUrl}/marketplace/`, priority: 0.9, changeFrequency: 'daily' },
    { url: `${baseUrl}/requests/`, priority: 0.9, changeFrequency: 'daily' },
    { url: `${baseUrl}/buyer-requests/`, priority: 0.8, changeFrequency: 'daily' },
    { url: `${baseUrl}/boss-up/`, priority: 0.85, changeFrequency: 'daily' },
    { url: `${baseUrl}/deals/`, priority: 0.85, changeFrequency: 'daily' },
    { url: `${baseUrl}/partners/`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/becomeapartner/`, priority: 0.75, changeFrequency: 'monthly' },
    { url: `${baseUrl}/magazine/`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/news/`, priority: 0.8, changeFrequency: 'daily' },
    { url: `${baseUrl}/performance/`, priority: 0.75, changeFrequency: 'daily' },
    { url: `${baseUrl}/coins/`, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${baseUrl}/apply-featured/`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${baseUrl}/privacypolicy/`, priority: 0.4, changeFrequency: 'yearly' },
  ];

  let dynamicProfiles: MetadataRoute.Sitemap = [];

  try {
    // Fetch active users/businesses for indexing in sitemap
    const res = await fetch(
      'https://orca-app-5dg8w.ondigitalocean.app/api/v1/users?page=0&size=100',
      { next: { revalidate: 86400 } }
    ).catch(() => null);

    if (res && res.ok) {
      const data = await res.json();
      const users: any[] = data?.data?.rows || data?.data || [];
      const validUsers = users.filter((u: any) => u.username && typeof u.username === 'string' && u.username.trim());

      dynamicProfiles = validUsers.map((u: any) => ({
        url: `${baseUrl}/profile/${encodeURIComponent(u.username)}/`,
        lastModified: u.updatedAt ? new Date(u.updatedAt) : now,
        changeFrequency: 'weekly' as const,
        priority: 0.65,
      }));
    }
  } catch (e) {
    console.warn('Failed to fetch dynamic user profiles for sitemap', e);
  }

  const sitemapEntries: MetadataRoute.Sitemap = [
    ...staticRoutes.map((r) => ({
      url: r.url,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...dynamicProfiles,
  ];

  return sitemapEntries;
}
