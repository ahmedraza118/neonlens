import { getPosts, getSettings } from '@/lib/queries'
import { absoluteUrl } from '@/lib/utils'

export const revalidate = 3600

const esc = (s: string) => s.replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`)

export async function GET() {
  const [posts, settings] = await Promise.all([getPosts(50), getSettings()])
  const items = posts
    .map(
      (p) => `<item><title>${esc(p.title)}</title><link>${absoluteUrl(`/blog/${p.slug}`)}</link><guid>${absoluteUrl(`/blog/${p.slug}`)}</guid><pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate><description>${esc(p.excerpt)}</description></item>`,
    )
    .join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(settings.businessName)} Journal</title><link>${absoluteUrl('/blog')}</link><description>${esc(settings.description)}</description>${items}</channel></rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
