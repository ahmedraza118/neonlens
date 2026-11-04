import { fmt, intlLocale, toLocale, withLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getPosts, getSettings } from '@/lib/queries'
import { absoluteUrl } from '@/lib/utils'

export const revalidate = 3600

const esc = (s: string) => s.replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`)

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ro' }]
}

export async function GET(_req: Request, { params }: { params: Promise<{ lang: string }> }) {
  const lang = toLocale((await params).lang)
  const url = (path: string) => absoluteUrl(withLocale(path, lang))
  const [posts, settings] = await Promise.all([getPosts(50, lang), getSettings(lang)])
  const items = posts
    .map(
      (p) => `<item><title>${esc(p.title)}</title><link>${url(`/blog/${p.slug}`)}</link><guid>${url(`/blog/${p.slug}`)}</guid><pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate><description>${esc(p.excerpt)}</description></item>`,
    )
    .join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(fmt(getDictionary(lang).blog.rssTitle, { name: settings.businessName }))}</title><link>${url('/blog')}</link><description>${esc(settings.description)}</description><language>${intlLocale[lang]}</language>${items}</channel></rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
