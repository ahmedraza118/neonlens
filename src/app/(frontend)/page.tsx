import type { Metadata } from 'next'
import Link from 'next/link'

import { ProjectCard, ServiceCard, TestimonialCard } from '@/components/Cards'
import { Faq } from '@/components/Faq'
import { HeroVideo } from '@/components/HeroVideo'
import { InquirySection } from '@/components/InquirySection'
import { Media } from '@/components/Media'
import { SectionHeading } from '@/components/SectionHeading'
import { VideoPlayer } from '@/components/VideoPlayer'
import { getHomepage, getLocations, getProjects, getServices, getSettings, getTestimonials, populated } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import type { Project } from '@/payload-types'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const [settings, home] = await Promise.all([getSettings(), getHomepage()])
  return buildMetadata({
    title: `${settings.businessName} — ${settings.tagline}`,
    description: settings.description,
    path: '/',
    image: populated(home.heroImage),
  })
}

export default async function HomePage() {
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

  return (
    <>
      {/* Hero */}
      <section className="container-x pt-6">
        <div className="relative isolate flex min-h-[70svh] items-end overflow-hidden rounded-3xl">
          <Media media={home.heroImage} fill priority sizes="(min-width: 1152px) 1152px, 100vw" className="-z-20 object-cover" />
          {home.heroVideoPlaybackId && (
            <div className="absolute inset-0 -z-10">
              <HeroVideo playbackId={home.heroVideoPlaybackId} />
            </div>
          )}
          {/* Dark gradient keeps white text readable on any photo */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/30 to-black/5" />
          <div className="p-6 text-white sm:p-12">
            {home.heroEyebrow && <p className="mb-4 text-sm font-semibold text-white/85">{home.heroEyebrow}</p>}
            <h1 className="max-w-3xl text-4xl leading-tight font-bold sm:text-6xl">{home.heroHeading}</h1>
            {home.heroSubheading && <p className="mt-5 max-w-2xl text-lg text-white/85">{home.heroSubheading}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#inquire" className="btn-primary">Check your date</Link>
              <Link href="/portfolio" className="btn border border-white/60 text-white hover:bg-white/10">See the work</Link>
            </div>
          </div>
        </div>
        {settings.stats && settings.stats.length > 0 && (
          <dl className="grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
            {settings.stats.map((s) => (
              <div key={s.id} className="text-center">
                <dd className="text-3xl font-bold">{s.value}</dd>
                <dt className="mt-1 text-sm text-muted">{s.label}</dt>
              </div>
            ))}
          </dl>
        )}
      </section>

      {/* Services */}
      <section className="container-x py-16">
        <SectionHeading eyebrow="What we do" title="Photo & film, made to be felt.">
          Weddings, brands, events and portraits — shot with a cinematic eye across{' '}
          {locations.map((l) => l.name).join(', ')}.
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
            <SectionHeading eyebrow="Selected work" title="Recent stories" />
            <Link href="/portfolio" className="btn-ghost mb-12">All projects →</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      {home.showreelPlaybackId && (
        <section className="container-x py-12">
          <VideoPlayer provider="mux" muxPlaybackId={home.showreelPlaybackId} title={`${settings.businessName} showreel`} />
        </section>
      )}

      {/* Process */}
      {home.process && home.process.length > 0 && (
        <section className="bg-accent-soft py-24">
          <div className="container-x">
            <SectionHeading eyebrow="How it works" title="From first message to final gallery" />
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
            <SectionHeading eyebrow="Kind words" title="Clients say it best" />
            <Link href="/reviews" className="btn-ghost mb-12">All reviews →</Link>
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
