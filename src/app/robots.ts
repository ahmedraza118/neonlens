import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/lib/utils'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // Public photos live under /api/media/file — keep them crawlable for Google Images.
        allow: ['/', '/api/media/file/'],
        // Private galleries and booking confirmations, in both languages.
        disallow: ['/admin', '/api/', '/galerie-client', '/en/client', '/rezervare/confirmare', '/en/book/success', '/webhooks/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  }
}
