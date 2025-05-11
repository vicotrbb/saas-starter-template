/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { siteConfig } from '@/app/metadata';

type JsonLdProps = {
  type: 'WebSite' | 'Organization' | 'BreadcrumbList' | 'FAQPage' | 'Product';
  data?: unknown;
};

// JSON-LD structured data component to enhance SEO with rich results
export default function JsonLd({ type, data }: JsonLdProps) {
  // Create default data based on type
  const jsonLd = createJsonLd(type, data);

  // Return script element with JSON-LD
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Create JSON-LD structured data object based on type and data
function createJsonLd(type: string, data?: any) {
  const defaultLogo = `${siteConfig.url}/logo.png`;

  // Switch on type to create appropriate structured data
  switch (type) {
    case 'Organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteConfig.url,
        logo: data?.logo || defaultLogo,
        sameAs: [siteConfig.links.twitter].filter(Boolean),
        contactPoint: {
          '@type': 'ContactPoint',
          email: data?.email || '',
          contactType: 'customer service',
        },
        ...data,
      };

    case 'WebSite':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
        ...data,
      };

    case 'BreadcrumbList':
      // Ensure we have properly formatted breadcrumb items
      if (!data?.itemListElement) {
        throw new Error('Breadcrumb list requires itemListElement array');
      }
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: data.itemListElement,
      };

    case 'FAQPage':
      // Ensure we have properly formatted FAQ items
      if (!data?.mainEntity) {
        throw new Error('FAQ page requires mainEntity array');
      }
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data.mainEntity,
      };

    case 'Product':
      // Product schema for subscription tiers or features
      if (!data?.name || !data?.description) {
        throw new Error('Product requires name and description');
      }

      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: data.name,
        description: data.description,
        image: data.image || defaultLogo,
        brand: {
          '@type': 'Brand',
          name: siteConfig.name,
        },
        offers: data.offers || {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          price: data.price || '0',
          priceCurrency: data.currency || 'USD',
        },
        ...data,
      };

    default:
      return {};
  }
}
