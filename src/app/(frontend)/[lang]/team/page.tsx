import type { Metadata } from 'next'
import Link from 'next/link'

import type { Discipline } from '@/collections/Team'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { InquirySection } from '@/components/InquirySection'
import { JsonLd } from '@/components/JsonLd'
import { SectionHeading } from '@/components/SectionHeading'
import { CapabilityBoard, PortraitMosaic, TeamGrid, TeamWays } from '@/components/Team'
import { fmt, intlLocale } from '@/i18n/config'
import { localeFromParams } from '@/i18n/server'
import { teamListSchema } from '@/lib/jsonld'
import { getSettings, getTeam } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { teamCapabilities, teamStats } from '@/lib/team'
import { cn } from '@/lib/utils'

export const revalidate = 3600

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ role?: string }> }

const ORDER: Discipline[] = ['photographer', 'videographer', 'drone', 'editor', 'producer', 'assistant']

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { lang, t } = await localeFromParams(params)
  const { role } = await searchParams
  const [settings, team] = await Promise.all([getSettings(), getTeam()])
  return buildMetadata({
    title: t.team.metaTitle,
    description: fmt(t.team.metaDescription, { name: settings.businessName }),
    path: '/team',
    lang,
    image: team[0]?.photo && typeof team[0].photo === 'object' ? team[0].photo : null,
    // Filtered views repeat the same people; an empty team page is not worth indexing yet.
    noIndexFollow: Boolean(role) || team.length === 0,
  })
}

export default async function TeamPage({ params, searchParams }: Props) {
  const { lang, t, href } = await localeFromParams(params)
  const { role } = await searchParams
  const [settings, everyone] = await Promise.all([getSettings(), getTeam()])
  const active = ORDER.find((d) => d === role)
  const members = active ? everyone.filter((m) => m.disciplines?.includes(active)) : everyone
  // Only offer filters for roles someone actually has, and only when there is something to filter.
  const present = ORDER.filter((d) => everyone.some((m) => m.disciplines?.includes(d)))
  const showFilters = present.length > 1 && everyone.length > 3

  const stats = teamStats(everyone)
  const capabilities = teamCapabilities(everyone)
  const languageNames = stats.languages.map((l) => t.team.languageNames[l as keyof typeof t.team.languageNames] ?? l)
  const languageList = languageNames.length > 1 ? new Intl.ListFormat(intlLocale[lang], { type: 'conjunction' }).format(languageNames) : null
  const hasPhotoAndVideo = everyone.some((m) => m.disciplines?.includes('photographer')) && everyone.some((m) => m.disciplines?.includes('videographer'))

  const figures = [
    stats.people > 1 ? { value: String(stats.people), label: t.team.statPeople } : null,
    stats.years > 0 ? { value: `${stats.years}+`, label: stats.people > 1 ? t.team.statYears : t.team.statYearsOne } : null,
    stats.skills > 0 ? { value: String(stats.skills), label: t.team.statSkills } : null,
    stats.languages.length > 1 ? { value: String(stats.languages.length), label: t.team.statLanguages } : null,
  ].filter((f): f is { value: string; label: string } => f !== null)

  return (
    <>
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-48 right-[-10rem] h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-3xl" />
        <div className="container-x relative pt-12 pb-16 lg:pb-24">
          <Breadcrumbs items={[{ name: t.team.crumb, path: '/team' }]} />
          <div className="mt-10 grid items-center gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <div className="min-w-0">
              <p className="eyebrow mb-4">{t.team.eyebrow}</p>
              <h1 className="text-4xl leading-[1.05] font-bold sm:text-5xl lg:text-6xl">
                {fmt(t.team.title, { name: settings.businessName })} <span className="text-accent">{t.team.titleAccent}</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{t.team.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#inquire" className="btn-primary" data-cta="team_inquire">
                  {t.team.ctaPrimary}
                </a>
                <Link href={href('/services')} className="btn-ghost">
                  {t.team.ctaServices}
                </Link>
              </div>
              {figures.length > 0 && (
                <dl className={cn('mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8', figures.length >= 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-3')}>
                  {figures.map((f) => (
                    <div key={f.label}>
                      <dd className="font-display text-4xl font-bold accent-text">{f.value}</dd>
                      <dt className="mt-1 text-sm leading-snug text-muted">{f.label}</dt>
                    </div>
                  ))}
                </dl>
              )}
            </div>
            <PortraitMosaic members={everyone} />
          </div>
        </div>
      </section>

      <CapabilityBoard capabilities={capabilities} />

      <section id="people" className="container-x scroll-mt-24 py-20">
        <SectionHeading eyebrow={t.team.peopleEyebrow} title={t.team.peopleTitle} />
        {showFilters && (
          <nav aria-label={t.team.filter} className="-mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
            <Link
              href={href('/team')}
              scroll={false}
              className={cn('shrink-0 rounded-full border px-4 py-2 text-sm', !active ? 'border-accent bg-accent/10' : 'border-line text-muted hover:text-fg')}
            >
              {t.team.all}
            </Link>
            {present.map((d) => (
              <Link
                key={d}
                href={href(`/team?role=${d}`)}
                scroll={false}
                className={cn('shrink-0 rounded-full border px-4 py-2 text-sm', active === d ? 'border-accent bg-accent/10' : 'border-line text-muted hover:text-fg')}
              >
                {t.team.disciplines[d]}
              </Link>
            ))}
          </nav>
        )}
        {members.length === 0 ? <p className="text-muted">{t.team.empty}</p> : <TeamGrid members={members} priorityCount={0} />}
      </section>

      {everyone.length > 0 && <TeamWays businessName={settings.businessName} hasPhotoAndVideo={hasPhotoAndVideo} languages={languageList} />}

      {everyone.length > 0 && <JsonLd data={teamListSchema(everyone, lang)} />}
      <InquirySection heading={t.team.inquiryHeading} subheading={t.team.inquirySubheading} />
    </>
  )
}
