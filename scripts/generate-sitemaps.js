/**
 * Generate Dynamic Sitemap Index + Monthly Post Sitemaps + Profiles + Boss Up
 * Run: node scripts/generate-sitemaps.js
 */
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://businessbosses.co.uk';
const API_URL = 'https://orca-app-5dg8w.ondigitalocean.app/api/v1';

async function fetchJson(url) {
  try {
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn(`[Sitemap] Fetch failed for ${url}:`, err.message);
    return null;
  }
}

function xmlEscape(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildUrlXml(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${lastmod ? new Date(lastmod).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function main() {
  console.log('[Sitemap] Starting sitemap generation...');
  const publicDir = path.resolve(__dirname, '../public');
  const sitemapsDir = path.join(publicDir, 'sitemaps');

  if (!fs.existsSync(sitemapsDir)) {
    fs.mkdirSync(sitemapsDir, { recursive: true });
  }

  const generatedSitemaps = [];

  // ==========================================
  // 1. Static Core Pages Sitemap
  // ==========================================
  const staticRoutes = [
    { url: `${BASE_URL}/`, priority: 1.0, changeFrequency: 'daily' },
    { url: `${BASE_URL}/feed/`, priority: 0.9, changeFrequency: 'hourly' },
    { url: `${BASE_URL}/marketplace/`, priority: 0.9, changeFrequency: 'daily' },
    { url: `${BASE_URL}/requests/`, priority: 0.9, changeFrequency: 'daily' },
    { url: `${BASE_URL}/buyer-requests/`, priority: 0.8, changeFrequency: 'daily' },
    { url: `${BASE_URL}/boss-up/`, priority: 0.85, changeFrequency: 'daily' },
    { url: `${BASE_URL}/deals/`, priority: 0.85, changeFrequency: 'daily' },
    { url: `${BASE_URL}/partners/`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/becomeapartner/`, priority: 0.75, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/magazine/`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/news/`, priority: 0.8, changeFrequency: 'daily' },
    { url: `${BASE_URL}/performance/`, priority: 0.75, changeFrequency: 'daily' },
    { url: `${BASE_URL}/coins/`, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/apply-featured/`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/privacypolicy/`, priority: 0.4, changeFrequency: 'yearly' },
  ];

  const staticXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes.map((r) => buildUrlXml(r.url, new Date(), r.changeFrequency, r.priority)).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(sitemapsDir, 'sitemap-pages.xml'), staticXml, 'utf8');
  generatedSitemaps.push({
    loc: `${BASE_URL}/sitemaps/sitemap-pages.xml`,
    lastmod: new Date().toISOString(),
  });

  // ==========================================
  // 2. Boss Up Challenges Sitemap
  // ==========================================
  try {
    const industryRes = await fetchJson(`${API_URL}/industry/user-count`);
    const industries = industryRes?.data?.rows || industryRes?.data || [];
    const validIndustries = Array.isArray(industries) ? industries : [];

    const bossUpUrls = validIndustries.map((ind) => {
      const id = ind.industryId || ind.id;
      return buildUrlXml(
        `${BASE_URL}/boss-up/${encodeURIComponent(id)}/`,
        ind.updatedAt || ind.createdAt || new Date(),
        'daily',
        '0.85'
      );
    });

    if (bossUpUrls.length > 0) {
      const bossUpXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${bossUpUrls.join('\n')}
</urlset>`;
      fs.writeFileSync(path.join(sitemapsDir, 'sitemap-bossup.xml'), bossUpXml, 'utf8');
      generatedSitemaps.push({
        loc: `${BASE_URL}/sitemaps/sitemap-bossup.xml`,
        lastmod: new Date().toISOString(),
      });
      console.log(`[Sitemap] Generated sitemap-bossup.xml with ${bossUpUrls.length} challenges.`);
    }
  } catch (e) {
    console.warn('[Sitemap] Failed to generate boss up sitemap:', e.message);
  }

  // ==========================================
  // 3. User & Business Profiles Sitemap
  // ==========================================
  try {
    const userRes = await fetchJson(`${API_URL}/users?page=0&size=2000`);
    const users = userRes?.data?.rows || userRes?.data || [];
    const validUsers = users.filter((u) => u.username && typeof u.username === 'string' && u.username.trim());

    if (validUsers.length > 0) {
      const profileUrls = validUsers.map((u) =>
        buildUrlXml(
          `${BASE_URL}/profile/${encodeURIComponent(u.username)}/`,
          u.updatedAt || u.createdAt || new Date(),
          'weekly',
          '0.7'
        )
      );

      const profilesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${profileUrls.join('\n')}
</urlset>`;
      fs.writeFileSync(path.join(sitemapsDir, 'sitemap-profiles.xml'), profilesXml, 'utf8');
      generatedSitemaps.push({
        loc: `${BASE_URL}/sitemaps/sitemap-profiles.xml`,
        lastmod: new Date().toISOString(),
      });
      console.log(`[Sitemap] Generated sitemap-profiles.xml with ${validUsers.length} profiles.`);
    }
  } catch (e) {
    console.warn('[Sitemap] Failed to generate profiles sitemap:', e.message);
  }

  // ==========================================
  // 4. Feed Posts Grouped by Month
  // ==========================================
  try {
    let allPosts = [];

    // Check if running in monorepo environment where staging DB can be safely read directly
    const backendModelsPath = path.resolve(__dirname, '../../../business-bosses-backend/src/api/v1/database/models');
    if (fs.existsSync(backendModelsPath)) {
      try {
        process.env.NODE_ENV = 'staging';
        const db = require(backendModelsPath);
        console.log('[Sitemap] Reading posts safely from staging database...');
        const dbPosts = await db.Post.findAll({
          attributes: ['postId', 'createdAt', 'updatedAt'],
          order: [['createdAt', 'DESC']],
          raw: true,
        });
        if (dbPosts && dbPosts.length > 0) {
          allPosts = dbPosts.map((p) => ({
            id: p.postId,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
          }));
        }
      } catch (dbErr) {
        console.warn('[Sitemap] Direct DB read skipped, fallback to API:', dbErr.message);
      }
    }

    // Fallback: If DB query returned nothing, query API
    if (allPosts.length === 0) {
      const postsRes = await fetchJson(`${API_URL}/post/all-posts-new?page=0&size=200`);
      const apiPosts = postsRes?.data?.posts?.rows || postsRes?.data?.posts || postsRes?.data || [];
      if (Array.isArray(apiPosts)) {
        allPosts = apiPosts.map((p) => ({
          id: p.postId || p.id,
          createdAt: p.createdAt || (p.timestamp ? new Date(Number(p.timestamp)) : new Date()),
          updatedAt: p.updatedAt,
        }));
      }
    }

    if (allPosts.length > 0) {
      // Group posts by Year-Month (e.g. "2026-11", "2026-10")
      const postsByMonth = {};
      for (const p of allPosts) {
        if (!p.id) continue;
        const d = p.createdAt ? new Date(p.createdAt) : new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const key = `${year}-${month}`;

        if (!postsByMonth[key]) postsByMonth[key] = [];
        postsByMonth[key].push(p);
      }

      const sortedMonths = Object.keys(postsByMonth).sort().reverse();

      for (const ym of sortedMonths) {
        const monthPosts = postsByMonth[ym];
        const fileName = `sitemap-posts-${ym}.xml`;
        const postUrls = monthPosts.map((p) =>
          buildUrlXml(
            `${BASE_URL}/post/${encodeURIComponent(p.id)}/`,
            p.updatedAt || p.createdAt,
            'monthly',
            '0.65'
          )
        );

        const monthXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${postUrls.join('\n')}
</urlset>`;

        fs.writeFileSync(path.join(sitemapsDir, fileName), monthXml, 'utf8');
        generatedSitemaps.push({
          loc: `${BASE_URL}/sitemaps/${fileName}`,
          lastmod: monthPosts[0]?.createdAt ? new Date(monthPosts[0].createdAt).toISOString() : new Date().toISOString(),
        });
        console.log(`[Sitemap] Generated ${fileName} (${monthPosts.length} posts).`);
      }
    }
  } catch (e) {
    console.warn('[Sitemap] Failed to group posts by month:', e.message);
  }

  // ==========================================
  // 5. Generate Master Sitemap Index (sitemap.xml)
  // ==========================================
  const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${generatedSitemaps
  .map(
    (s) => `  <sitemap>
    <loc>${xmlEscape(s.loc)}</loc>
    <lastmod>${s.lastmod}</lastmod>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`;

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapIndexXml, 'utf8');
  console.log(`[Sitemap] Master sitemap.xml generated with ${generatedSitemaps.length} sub-sitemaps!`);
}

main().catch(console.error);
