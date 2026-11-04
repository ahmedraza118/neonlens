import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  // Dev server only: allow opening it through a tunnel (ngrok / Cloudflare) or from other devices
  // on your Wi-Fi, e.g. to let someone test it. Has no effect on production builds.
  allowedDevOrigins: ['*.ngrok-free.app', '*.ngrok-free.dev', '*.ngrok.app', '*.ngrok.io', '*.trycloudflare.com', '192.168.*.*'],
  images: {
    formats: ['image/avif', 'image/webp'],
    // 90 is used for full-screen heroes and gallery photos, 85 by default, 75 for small cards.
    qualities: [75, 85, 90],
    // Up to 4K so photos stay razor-sharp on large high-DPI (Retina / 4K) screens.
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2560, 3840],
    // Full-resolution camera originals can be large; allow optimizing sources up to 100 MB.
    maximumResponseBody: 100_000_000,
    minimumCacheTTL: 60 * 60 * 24 * 30,
    localPatterns: [{ pathname: '/api/media/file/**' }],
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: { root: path.resolve(dirname) },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
