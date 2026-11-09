import type { Metadata } from 'next'
import Link from 'next/link'

import { ProjectCard, ServiceCard, TestimonialCard } from '@/components/Cards'
import { DateChecker } from '@/components/DateChecker'
import { Faq } from '@/components/Faq'
import { HeroCarousel, type HeroSlide } from '@/components/HeroCarousel'
import { InquirySection } from '@/components/InquirySection'
import { SectionHeading } from '@/components/SectionHeading'
import { VideoPlayer } from '@/components/VideoPlayer'
import { fmt } from '@/i18n/config'
import { localeFromParams } from '@/i18n/server'
import { asMedia, getHomepage, getLocations, getProjects, getServices, getSettings, getTestimonials, populated } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { formatMoney } from '@/lib/utils'
import type { Project, Service } from '@/payload-types'

export const revalidate = 3600

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await localeFromParams(params)
  const [settings, home] = await Promise.all([getSettings(), getHomepage()])
  return buildMetadata({
    // Keyword-first H1 text ("Fotograf și videograf de nuntă în București și Ilfov") + brand.
    // Keyword-first; the brand is added only while the title stays short enough for Google (~65).
    title: home.heroHeading
      ? `${home.heroHeading} | ${settings.businessName}`.length <= 70
        ? `${home.heroHeading} | ${settings.businessName}`
        : home.heroHeading
      : `${settings.businessName} — ${settings.tagline}`,
    absoluteTitle: true,
    description: settings.description,
    path: '/',
    lang,
    image: populated(home.heroImage),
  })
}

export default async function HomePage({ params }: Props) {
  const { lang, t, href } = await localeFromParams(params)
  const [settings, home, services, locations, featured, testimonials] = await Promise.all([
    getSettings(),
    getHomepage(),
    getServices(),
    getLocations(),
    getProjects({ featured: true, limit: 6 }),
    getTestimonials({ featured: true }),
  ])
  const picked = (home.featuredProjects ?? []).map((p) => populated<Project>(p)).filter((p): p is Project => !!p)
  const projects = picked.length ? picked : featured

  // Hero slides: the ones configured in the CMS, or one per service when none are set.
  const fromService = (service: Service | null) => ({
    eyebrow: service?.title ?? '',
    title: service?.tagline ?? '',
    text: service?.excerpt,
    price: service ? `${t.common.fromCap} ${formatMoney(service.startingPrice, settings.currency, lang)}` : null,
    href: href(service ? `/services/${service.slug}` : '/services'),
    ctaLabel: fmt(t.hero.explore, { service: service?.title.toLocaleLowerCase(lang) ?? t.nav.services.toLocaleLowerCase(lang) }),
    image: asMedia(service?.heroImage),
  })
  const configured = home.heroSlides ?? []
  const slides: HeroSlide[] = (
    configured.length > 0
      ? configured.map((s, i) => {
          const base = fromService(populated<Service>(s.service))
          return {
            id: s.id ?? String(i),
            eyebrow: s.eyebrow || base.eyebrow,
            title: s.title || base.title,
            text: s.text || base.text,
            price: s.service ? base.price : null,
            href: s.ctaLink ? (s.ctaLink.startsWith('/') ? href(s.ctaLink) : s.ctaLink) : base.href,
            ctaLabel: s.ctaLabel || base.ctaLabel,
            image: asMedia(s.image) ?? base.image,
            video: asMedia(s.video),
            muxPlaybackId: s.muxPlaybackId,
          }
        })
      : services.map((s, i) => ({
          id: String(s.id),
          ...fromService(s),
          video: null,
          muxPlaybackId: i === 0 ? home.heroVideoPlaybackId : null,
        }))
  ).filter((s) => s.image || s.video || s.muxPlaybackId)

  return (
    <>
      {/* Hero: rounded photo card cycling through the services, stats underneath */}
      <section className="container-x pt-4 sm:pt-6">
        <HeroCarousel heading={home.heroHeading} slides={slides} intervalSeconds={home.heroAutoplaySeconds ?? 6} />
        <DateChecker className="relative z-10 mx-auto -mt-6 max-w-3xl shadow-xl shadow-black/10 sm:-mt-10" />
        {settings.stats && settings.stats.length > 0 && (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-6 py-8 sm:grid-cols-4 sm:gap-6 sm:py-10">
            {settings.stats.map((s) => (
              <div key={s.id} className="flex flex-col-reverse text-center">
                <dt className="mt-1 text-sm text-muted">{s.label}</dt>
                <dd className="text-2xl font-bold sm:text-3xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {home.heroSubheading && <p className="mx-auto max-w-3xl pb-4 text-center text-lg leading-relaxed text-fg/80 sm:text-xl">{home.heroSubheading}</p>}
      </section>

      {/* Services */}
      <section className="container-x py-16">
        <SectionHeading eyebrow={t.home.servicesEyebrow} title={t.home.servicesTitle}>
          {fmt(t.home.servicesIntro, { cities: locations.map((l) => l.name).join(', ') })}
        </SectionHeading>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} currency={settings.currency} />
          ))}
        </div>
      </section>

      {/* Portfolio */}
      {projects.length > 0 && (
        <section className="container-x py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow={t.home.workEyebrow} title={t.home.workTitle} />
            <Link href={href('/portfolio')} className="btn-ghost mb-12">{t.common.allProjects}</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      {/* Service area: internal links to every area page (local SEO) */}
      {locations.length > 0 && (
        <section className="container-x py-16">
          <SectionHeading eyebrow={t.home.areasEyebrow} title={t.home.areasTitle}>
            {t.home.areasIntro}
          </SectionHeading>
          <ul className="flex flex-wrap gap-2 sm:gap-3">
            {locations.map((l) => (
              <li key={l.id}>
                <Link
                  href={href(`/locations/${l.slug}`)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition hover:border-accent hover:text-accent ${l.isPrimary ? 'border-accent bg-accent-soft text-accent-strong' : 'border-line bg-surface'}`}
                >
                  <span aria-hidden>📍</span>
                  {l.name}
                  {!l.travelFee && l.isPrimary && <span className="hidden text-xs font-normal text-muted sm:inline">· {t.home.noTravelFee}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {home.showreelPlaybackId && (
        <section className="container-x py-12">
          <VideoPlayer provider="mux" muxPlaybackId={home.showreelPlaybackId} title={fmt(t.common.showreel, { name: settings.businessName })} />
        </section>
      )}

      {/* Process */}
      {home.process && home.process.length > 0 && (
        <section className="bg-accent-soft py-24">
          <div className="container-x">
            <SectionHeading eyebrow={t.home.processEyebrow} title={t.home.processTitle} />
            <ol className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {home.process.map((step, i) => (
                <li key={step.id} className="relative">
                  <span className="text-4xl font-bold text-accent/40">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="container-x py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow={t.home.reviewsEyebrow} title={t.home.reviewsTitle} />
            <Link href={href('/reviews')} className="btn-ghost mb-12">{t.common.allReviews}</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </section>
      )}

      <Faq faqs={settings.generalFaqs?.slice(0, 5)} />
      <InquirySection />
    </>
  )
}
