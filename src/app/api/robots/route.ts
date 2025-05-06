import { NextResponse } from 'next/server';
import packageJson from '../../../../package.json';

export const runtime = 'edge';
export const preferredRegion = 'auto';

/**
 * Generates a robots.txt file dynamically
 * This helps search engines understand which parts of the site they should crawl
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  // Construct robots.txt content following standard format
  const robotsTxt = `# ${packageJson.name} Robots.txt
# ${baseUrl}

User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /404
Disallow: /500

# Allow Sitemap
Sitemap: ${baseUrl}/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
