import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { InquirySection } from '@/components/InquirySection'
import { Media } from '@/components/Media'
import { Paragraphs } from '@/components/Paragraphs'
import { getLocations, getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return buildMetadata({
    title: `About ${settings.businessName}`,
    description: settings.about?.body?.slice(0, 155) || settings.description,
    path: '/about',
    image: typeof settings.about?.image === 'object' ? settings.about.image : null,
  })
}

export default async function AboutPage() {
  const [settings, locations] = await Promise.all([getSettings(), getLocations()])
  const about = settings.about
  return (
    <>
      <section className="container-x pt-12 pb-20">
        <Breadcrumbs items={[{ name: 'About', path: '/about' }]} />
        <div className="mt-10 grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-4">About us</p>
            <h1 className="text-4xl font-bold sm:text-6xl">{about?.heading || settings.tagline}</h1>
            <Paragraphs text={about?.body} className="mt-8 text-lg leading-relaxed text-fg/85" />
            {about?.founderName && (
              <p className="mt-6 text-sm text-muted">
                — {about.founderName}
                {about.founderRole && `, ${about.founderRole}`}
              </p>
            )}
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/portfolio" className="btn-primary">See our work</Link>
              <Link href="/reviews" className="btn-ghost">Read reviews</Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Media media={about?.image} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>
      {settings.stats && settings.stats.length > 0 && (
        <section className="bg-accent-soft py-16">
          <dl className="container-x grid grid-cols-2 gap-8 md:grid-cols-4">
            {settings.stats.map((s) => (
              <div key={s.id}>
                <dd className="font-display text-4xl font-bold sm:text-5xl accent-text">{s.value}</dd>
                <dt className="mt-1 text-sm text-muted">{s.label}</dt>
              </div>
            ))}
          </dl>
        </section>
      )}
      <section className="container-x py-16">
        <p className="text-muted">
          Based in {settings.address?.city}, working across{' '}
          {locations.map((l, i) => (
            <span key={l.id}>
              {i > 0 && (i === locations.length - 1 ? ' and ' : ', ')}
              <Link href={`/locations/${l.slug}`} className="text-fg underline decoration-accent/50 underline-offset-4 hover:decoration-accent">
                {l.name}
              </Link>
            </span>
          ))}
          .
        </p>
      </section>
      <InquirySection />
    </>
  )
}
