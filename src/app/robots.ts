import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/lib/utils'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // Public photos live under /api/media/file — keep them crawlable for Google Images.
        allow: ['/', '/api/media/file/'],
        // Private gallery and confirmation pages are not blocked here on purpose: they carry
        // "noindex", which Google can only see if it may fetch them.
        disallow: ['/admin', '/api/', '/webhooks/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
