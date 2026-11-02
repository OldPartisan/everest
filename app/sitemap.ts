import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date('2025-12-15'),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
