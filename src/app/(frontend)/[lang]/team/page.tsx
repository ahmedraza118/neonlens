import type { Metadata } from 'next'
import Link from 'next/link'

import type { Discipline } from '@/collections/Team'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { InquirySection } from '@/components/InquirySection'
import { JsonLd } from '@/components/JsonLd'
import { SectionHeading } from '@/components/SectionHeading'
import { TeamCard, yearsOf } from '@/components/Team'
import { fmt } from '@/i18n/config'
import { localeFromParams } from '@/i18n/server'
import { teamListSchema } from '@/lib/jsonld'
import { getSettings, getTeam } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
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
  const everyone = await getTeam()
  const active = ORDER.find((d) => d === role)
  const members = active ? everyone.filter((m) => m.disciplines?.includes(active)) : everyone
  // Only offer filters for roles someone actually has.
  const present = ORDER.filter((d) => everyone.some((m) => m.disciplines?.includes(d)))
  const combinedYears = everyone.reduce((sum, m) => sum + (yearsOf(m) ?? 0), 0)
  const languages = new Set(everyone.flatMap((m) => m.languages ?? []))

  return (
    <>
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-48 right-[-10rem] h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-3xl" />
        <div className="container-x relative pt-12 pb-10">
          <Breadcrumbs items={[{ name: t.team.crumb, path: '/team' }]} />
          <div className="mt-8 grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
            <SectionHeading as="h1" eyebrow={t.team.eyebrow} title={t.team.title}>
              {t.team.intro}
            </SectionHeading>
            {everyone.length > 1 && (
              <dl className="mb-12 grid grid-cols-3 gap-4 rounded-2xl border border-line bg-surface p-5 sm:p-6">
                <div>
                  <dd className="font-display text-3xl font-bold accent-text sm:text-4xl">{everyone.length}</dd>
                  <dt className="mt-1 text-xs text-muted sm:text-sm">{t.team.statPeople}</dt>
                </div>
                {combinedYears > 0 && (
                  <div>
                    <dd className="font-display text-3xl font-bold accent-text sm:text-4xl">{combinedYears}+</dd>
                    <dt className="mt-1 text-xs text-muted sm:text-sm">{t.team.statYears}</dt>
                  </div>
                )}
                {languages.size > 0 && (
                  <div>
                    <dd className="font-display text-3xl font-bold accent-text sm:text-4xl">{languages.size}</dd>
                    <dt className="mt-1 text-xs text-muted sm:text-sm">{t.team.statLanguages}</dt>
                  </div>
                )}
              </dl>
            )}
          </div>

          {present.length > 1 && (
            <nav aria-label={t.team.filter} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
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
        </div>
      </section>

      <section className="container-x pt-6 pb-24">
        {members.length === 0 ? (
          <p className="text-muted">{t.team.empty}</p>
        ) : (
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m, i) => (
              <TeamCard key={m.id} member={m} priority={i < 3} />
            ))}
          </div>
        )}
      </section>

      {everyone.length > 0 && <JsonLd data={teamListSchema(everyone, lang)} />}
      <InquirySection />
    </>
  )
}
