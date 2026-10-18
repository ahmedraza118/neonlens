import { getLocations, getServices, getSettings } from '@/lib/queries'
import { absoluteUrl, formatMoney } from '@/lib/utils'

export const revalidate = 86400

/** Plain-text summary for AI assistants and answer engines (llmstxt.org). */
export async function GET() {
  const [settings, services, locations] = await Promise.all([getSettings(), getServices(), getLocations()])
  const body = [
    `# ${settings.businessName}`,
    '',
    `> ${settings.description}`,
    '',
    `Based in ${settings.address?.city}. Serving ${locations.map((l) => l.name).join(', ')}. Contact: ${settings.email}, ${settings.phone}.`,
    '',
    '## Services',
    ...services.map((s) => `- [${s.title}](${absoluteUrl(`/services/${s.slug}`)}): ${s.excerpt} From ${formatMoney(s.startingPrice, settings.currency)}.`),
    '',
    '## Key pages',
    `- [Portfolio](${absoluteUrl('/portfolio')})`,
    `- [Pricing & quote calculator](${absoluteUrl('/pricing')})`,
    `- [Book a date](${absoluteUrl('/book')})`,
    `- [Reviews](${absoluteUrl('/reviews')})`,
    `- [FAQ](${absoluteUrl('/faq')})`,
    `- [Journal](${absoluteUrl('/blog')})`,
  ].join('\n')
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
