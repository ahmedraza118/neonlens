import { withLocale } from '@/i18n/config'
import { getLocations, getServices, getSettings } from '@/lib/queries'
import { absoluteUrl, formatMoney } from '@/lib/utils'

export const revalidate = 86400

/** Plain-text summary for AI assistants and answer engines (llmstxt.org), in English with Romanian links. */
export async function GET() {
  const [settings, services, locations, servicesRo] = await Promise.all([getSettings('en'), getServices('en'), getLocations('en'), getServices('ro')])
  const en = (path: string) => absoluteUrl(withLocale(path, 'en'))
  const ro = (path: string) => absoluteUrl(withLocale(path, 'ro'))
  const body = [
    `# ${settings.businessName}`,
    '',
    `> ${settings.description}`,
    '',
    `Photo & video studio based in ${settings.address?.city}, Romania. Service area: ${locations.map((l) => l.name).join(', ')} (Bucharest and Ilfov county). Languages: Romanian, English. Contact: ${settings.email}, ${settings.phone}.`,
    '',
    '## Services',
    ...services.map((s) => {
      const roSlug = servicesRo.find((r) => r.id === s.id)?.slug ?? s.slug
      return `- [${s.title}](${en(`/services/${s.slug}`)}) ([RO](${ro(`/services/${roSlug}`)})): ${s.excerpt} From ${formatMoney(s.startingPrice, settings.currency)}.`
    }),
    '',
    '## Key pages',
    `- Portfolio: ${ro('/portfolio')} · ${en('/portfolio')}`,
    `- Pricing & quote calculator: ${ro('/pricing')} · ${en('/pricing')}`,
    `- Book a date: ${ro('/book')} · ${en('/book')}`,
    `- Areas covered: ${ro('/locations')} · ${en('/locations')}`,
    `- Reviews: ${ro('/reviews')} · ${en('/reviews')}`,
    `- FAQ: ${ro('/faq')} · ${en('/faq')}`,
    `- Blog: ${ro('/blog')} · ${en('/blog')}`,
  ].join('\n')
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
