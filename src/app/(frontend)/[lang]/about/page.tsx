import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { InquirySection } from '@/components/InquirySection'
import { Media } from '@/components/Media'
import { Paragraphs } from '@/components/Paragraphs'
import { TeamSection } from '@/components/Team'
import { fmt } from '@/i18n/config'
import { localeFromParams } from '@/i18n/server'
import { getLocations, getSettings, getTeam } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, t } = await localeFromParams(params)
  const settings = await getSettings()
  return buildMetadata({
    title: fmt(t.about.metaTitle, { name: settings.businessName }),
    absoluteTitle: true, // already contains the brand
    lang,
    description: settings.about?.body?.slice(0, 155) || settings.description,
    path: '/about',
    image: typeof settings.about?.image === 'object' ? settings.about.image : null,
  })
}

export default async function AboutPage({ params }: Props) {
  const { t, href } = await localeFromParams(params)
  const [settings, locations, team] = await Promise.all([getSettings(), getLocations(), getTeam()])
  const about = settings.about
  return (
    <>
      <section className="container-x pt-12 pb-20">
        <Breadcrumbs items={[{ name: t.nav.about, path: '/about' }]} />
        <div className="mt-10 grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-4">{t.about.eyebrow}</p>
            <h1 className="text-4xl font-bold sm:text-6xl">{about?.heading || settings.tagline}</h1>
            <Paragraphs text={about?.body} className="mt-8 text-lg leading-relaxed text-fg/85" />
            {about?.founderName && (
              <p className="mt-6 text-sm text-muted">
                — {about.founderName}
                {about.founderRole && `, ${about.founderRole}`}
              </p>
            )}
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={href('/portfolio')} className="btn-primary">{t.common.seeWork}</Link>
              <Link href={href('/reviews')} className="btn-ghost">{t.common.readReviews}</Link>
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
      <TeamSection members={team.slice(0, 8)} />
      <section className="container-x py-16">
        <p className="text-muted">
          {fmt(t.about.based, { city: settings.address?.city ?? '' })}
          {locations.map((l, i) => (
            <span key={l.id}>
              {i > 0 && (i === locations.length - 1 ? t.common.and : ', ')}
              <Link href={href(`/locations/${l.slug}`)} className="text-fg underline decoration-accent/50 underline-offset-4 hover:decoration-accent">
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
