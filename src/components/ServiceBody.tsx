import Link from 'next/link'

import { fmt } from '@/i18n/config'
import { getI18n } from '@/i18n/server'
import { getProjects, getTestimonials, populated } from '@/lib/queries'
import { formatMoney } from '@/lib/utils'
import type { Location, Service, SiteSetting } from '@/payload-types'

import { ProjectCard, TestimonialCard } from './Cards'
import { Faq } from './Faq'
import { SectionHeading } from './SectionHeading'
import { VideoPlayer } from './VideoPlayer'

/** Shared body for /services/[service] and /services/[service]/[location]. */
export async function ServiceBody({ service, settings, location }: { service: Service; settings: SiteSetting; location?: Location | null }) {
  const [localProjects, allProjects, testimonials] = await Promise.all([
    location ? getProjects({ serviceId: service.id, locationId: location.id, limit: 6 }) : Promise.resolve([]),
    getProjects({ serviceId: service.id, limit: 6 }),
    getTestimonials({ serviceId: service.id }),
  ])
  // Prefer projects shot in this city; top up with others from the same service.
  const projects = [...localProjects, ...allProjects.filter((p) => !localProjects.some((l) => l.id === p.id))].slice(0, 6)
  const faqs = [...(location?.faqs ?? []), ...(service.faqs ?? [])]
  const { lang, t, href } = getI18n()
  const city = location?.name ?? ''

  return (
    <>
      {service.highlights && service.highlights.length > 0 && (
        <section className="container-x py-20">
          <SectionHeading eyebrow={t.services.whyUs} title={location ? fmt(t.services.whatYouGetIn, { city }) : t.services.whatYouGet} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {service.highlights.map((h) => (
              <div key={h.id} className="card p-7">
                <h3 className="text-lg font-bold">{h.title}</h3>
                {h.description && <p className="mt-2 text-sm text-muted">{h.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {service.video?.provider && service.video.provider !== 'none' && (
        <section className="container-x py-10">
          <VideoPlayer
            provider={service.video.provider}
            muxPlaybackId={service.video.muxPlaybackId}
            youtubeId={service.video.youtubeId}
            title={service.video.title || service.title}
            file={service.video.file}
          />
        </section>
      )}

      {projects.length > 0 && (
        <section className="container-x py-20">
          <SectionHeading eyebrow={t.services.portfolio} title={fmt(location ? t.services.recentIn : t.services.recent, { service: service.title, city })} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      {service.packages && service.packages.length > 0 && (
        <section className="bg-accent-soft py-20">
          <div className="container-x">
            <SectionHeading eyebrow={t.services.packagesEyebrow} title={t.services.packagesTitle}>
              {t.services.packagesIntro.split('{link}')[0]}
              <Link href={href(`/pricing?service=${service.slug}`)} className="text-accent-2 underline">{t.services.quoteCalculator}</Link>
              {t.services.packagesIntro.split('{link}')[1]}
            </SectionHeading>
            <div className="grid gap-6 lg:grid-cols-3">
              {service.packages.map((p) => (
                <div key={p.id} className={`card relative flex flex-col p-8 ${p.popular ? 'border-accent ring-1 ring-accent' : ''}`}>
                  {p.popular && <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 text-xs font-semibold">{t.services.mostBooked}</span>}
                  <h3 className="text-xl font-bold">{p.name}</h3>
                  <p className="mt-3 font-display text-4xl font-bold">{formatMoney(p.price, settings.currency, lang)}</p>
                  {p.hours && <p className="text-sm text-muted">{fmt(t.common.hoursLong, { hours: p.hours })}</p>}
                  {p.description && <p className="mt-4 text-sm text-muted">{p.description}</p>}
                  <ul className="mt-6 flex-1 space-y-2 text-sm">
                    {(p.includes ?? []).map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-accent">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href={href(`/book?service=${service.slug}&package=${encodeURIComponent(p.id ?? p.name)}`)} className={`mt-8 ${p.popular ? 'btn-primary' : 'btn-ghost'}`}>
                    {t.services.bookPackage}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {service.process && service.process.length > 0 && (
        <section className="container-x py-20">
          <SectionHeading eyebrow={t.services.processEyebrow} title={t.services.processTitle} />
          <ol className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step, i) => (
              <li key={step.id}>
                <span className="text-4xl font-bold text-accent/40">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="container-x py-20">
          <SectionHeading eyebrow={t.services.reviewsEyebrow} title={t.services.reviewsTitle} />
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </section>
      )}

      <Faq faqs={faqs} heading={fmt(location ? t.services.faqIn : t.services.faq, { service: service.title, city })} />
    </>
  )
}

export function serviceLocationNote(location: Location | null | undefined, serviceId: number): string | null {
  const note = location?.serviceNotes?.find((n) => populated<Service>(n.service)?.id === serviceId || n.service === serviceId)
  return note?.content ?? null
}
