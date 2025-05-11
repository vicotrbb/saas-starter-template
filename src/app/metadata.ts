// Centralized metadata configuration for Threadrize

/**
 * Default metadata values for Threadrize
 * These values are used as fallbacks for pages that don't define their own metadata
 */
export const defaultMetadata = {
  title: '',
  description: '',
  keywords: '',

  // Open Graph
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  ogLogo: '',
  ogType: '',

  // Twitter Card
  twitterTitle: '',
  twitterDescription: '',
  twitterImage: '',
  twitterCard: '',
  twitterCreator: '',

  // App info
  appName: 'saas-starter-template',
  locale: 'en_US',
  type: 'website',
};

/**
 * Site URL configuration
 * Used for canonical URLs and absolute URL generation
 */
export const siteConfig = {
  name: 'saas-starter-template',
  url: process.env.NEXT_PUBLIC_APP_URL ?? '',
  ogImage: '',
  ogLogo: '',
  description: '',
  links: {
    twitter: '',
  },
};

/**
 * Build absolute URL from path
 * @param path Path to append to site URL
 * @returns Full URL
 */
export function absoluteUrl(path: string) {
  return `${siteConfig.url}${path}`;
}

/**
 * Generate dynamic metadata for pages
 * @param title Page title
 * @param description Page description
 * @param image OG image path
 * @param noIndex Whether to exclude page from search engines
 * @returns Metadata object compatible with Next.js Metadata API
 */
export function generateMetadata({
  title = defaultMetadata.title,
  description = defaultMetadata.description,
  image = defaultMetadata.ogImage,
  noIndex = false,
  path = '/',
}) {
  const metadataBase = new URL(siteConfig.url);
  const imageUrl = image.startsWith('https') ? image : absoluteUrl(image);

  return {
    metadataBase,
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    keywords: defaultMetadata.keywords,
    authors: [
      {
        name: 'saas-starter-template',
        url: siteConfig.url,
      },
    ],
    creator: 'saas-starter-template',
    publisher: 'saas-starter-template',
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: absoluteUrl(path),
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '',
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
  };
}
