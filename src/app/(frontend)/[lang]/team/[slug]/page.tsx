import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'

import type { Discipline } from '@/collections/Team'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ProjectCard } from '@/components/Cards'
import { InquirySection } from '@/components/InquirySection'
import { JsonLd } from '@/components/JsonLd'
import { Media } from '@/components/Media'
import { Paragraphs } from '@/components/Paragraphs'
import { SectionHeading } from '@/components/SectionHeading'
import { firstName, SkillsDashboard, TeamCard, yearsOf } from '@/components/Team'
import { fmt, intlLocale, toLocale } from '@/i18n/config'
import { localeFromParams } from '@/i18n/server'
import { personSchema } from '@/lib/jsonld'
import { getProjects, getSettings, getTeam, getTeamMember, populated } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import type { Media as MediaDoc, Service } from '@/payload-types'

export const revalidate = 3600

type Props = { params: Promise<{ lang: string; slug: string }> }

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  return (await getTeam({ locale: toLocale(params.lang) })).map((m) => ({ slug: m.slug! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, t } = await localeFromParams(params)
  const { slug } = await params
  const [member, settings] = await Promise.all([getTeamMember(slug), getSettings()])
  if (!member) return {}
  return buildMetadata({
    title: fmt(t.team.detailMetaTitle, { name: member.name, role: member.role }),
    description: fmt(t.team.detailMetaDescription, { name: member.name, role: member.role, business: settings.businessName, bio: member.shortBio }),
    path: `/team/${member.slug}`,
    lang,
    image: populated<MediaDoc>(member.photo),
    seo: member.seo,
  })
}

export default async function TeamMemberPage({ params }: Props) {
  const { lang, t, href } = await localeFromParams(params)
  const { slug } = await params
  const member = await getTeamMember(slug)
  if (!member) notFound()
  if (member.slug !== slug) permanentRedirect(href(`/team/${member.slug}`))

  const [projects, others] = await Promise.all([getProjects({ crewId: member.id, limit: 6 }), getTeam({ exclude: member.id })])
  const name = firstName(member)
  const years = yearsOf(member)
  const disciplines = (member.disciplines ?? []) as Discipline[]
  const services = (member.services ?? []).map((s) => populated<Service>(s)).filter((s): s is Service => Boolean(s))
  const languages = (member.languages ?? []) as Array<keyof typeof t.team.languageNames>
  const signature = populated<MediaDoc>(member.signatureImage)
  const social = Object.entries(member.social ?? {}).filter(([k, v]) => k !== 'id' && typeof v === 'string' && /^https?:\/\//.test(v)) as Array<[string, string]>
  const socialLabel: Record<string, string> = { instagram: 'Instagram', website: 'Website', linkedin: 'LinkedIn' }

  return (
    <>
      <section className="container-x pt-12 pb-16">
        <Breadcrumbs items={[{ name: t.team.crumb, path: '/team' }, { name: member.name, path: `/team/${member.slug}` }]} />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-surface-2">
              <Media media={member.photo} fill priority quality={90} sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
              {years && (
                <span className="absolute bottom-5 left-5 rounded-full bg-page/90 px-4 py-1.5 text-sm font-semibold shadow-sm backdrop-blur">
                  {fmt(t.team.years, { n: years })}
                </span>
              )}
            </div>
          </div>

          <div className="min-w-0">
            {disciplines.length > 0 && <p className="eyebrow mb-4">{disciplines.map((d) => t.team.discipline[d]).join(' · ')}</p>}
            <h1 className="text-4xl font-bold sm:text-6xl">{member.name}</h1>
            <p className="mt-3 text-xl text-muted">{member.role}</p>

            {member.quote && (
              <blockquote className="mt-8 border-l-4 border-accent pl-5 font-display text-2xl leading-snug text-fg/90 sm:text-3xl">
                “{member.quote}”
              </blockquote>
            )}

            <Paragraphs text={member.bio || member.shortBio} className="mt-8 space-y-5 text-lg leading-relaxed text-fg/85" />

            <SkillsDashboard member={member} />

            <dl className="mt-10 grid gap-6 rounded-2xl border border-line bg-surface p-6 sm:grid-cols-2">
              {member.since && (
                <div>
                  <dt className="eyebrow mb-1.5">{fmt(t.team.since, { year: member.since })}</dt>
                  <dd className="font-semibold">{years ? fmt(t.team.years, { n: years }) : member.since}</dd>
                </div>
              )}
              {languages.length > 0 && (
                <div>
                  <dt className="eyebrow mb-1.5">{t.team.speaks}</dt>
                  <dd className="font-semibold">
                    {new Intl.ListFormat(intlLocale[lang], { type: 'conjunction' }).format(languages.map((l) => t.team.languageNames[l] ?? l))}
                  </dd>
                </div>
              )}
              {services.length > 0 && (
                <div className="sm:col-span-2">
                  <dt className="eyebrow mb-2">{t.team.worksOn}</dt>
                  <dd className="flex flex-wrap gap-2">
                    {services.map((s) => (
                      <Link key={s.id} href={href(`/services/${s.slug}`)} className="rounded-full border border-line px-3.5 py-1.5 text-sm hover:border-accent hover:text-accent">
                        {s.title}
                      </Link>
                    ))}
                  </dd>
                </div>
              )}
              {member.specialties && member.specialties.length > 0 && (
                <div className="sm:col-span-2">
                  <dt className="eyebrow mb-2">{t.team.specialties}</dt>
                  <dd className="flex flex-wrap gap-2">
                    {member.specialties.map((s) => (
                      <span key={s} className="rounded-full bg-accent-soft px-3.5 py-1.5 text-sm text-accent-strong">
                        {s}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              {member.gear && (
                <div className="sm:col-span-2">
                  <dt className="eyebrow mb-1.5">{t.team.gear}</dt>
                  <dd className="text-fg/85">{member.gear}</dd>
                </div>
              )}
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#inquire" className="btn-primary" data-cta="team_ask">
                {fmt(t.team.ask, { name })}
              </a>
              {projects.length > 0 && (
                <a href="#work" className="btn-ghost">
                  {fmt(t.team.work, { name })}
                </a>
              )}
              {social.map(([key, url]) => (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer me" className="text-sm text-muted underline decoration-line underline-offset-4 hover:text-fg">
                  {socialLabel[key] ?? key} ↗
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {signature && (
        <section className="container-x pb-16">
          <figure>
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-surface-2">
              <Media media={signature} fill sizes="100vw" className="object-cover" />
            </div>
            <figcaption className="mt-3 text-sm text-muted">
              {t.team.signature} — {member.name}
            </figcaption>
          </figure>
        </section>
      )}

      {projects.length > 0 && (
        <section id="work" className="container-x scroll-mt-24 py-16">
          <SectionHeading title={fmt(t.team.work, { name })} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="border-t border-line bg-surface-2/60 py-20">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading title={t.team.others} />
              <Link href={href('/team')} className="btn-ghost mb-12">
                {t.team.seeAll}
              </Link>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {others.slice(0, 3).map((m) => (
                <TeamCard key={m.id} member={m} />
              ))}
            </div>
          </div>
        </section>
      )}

      <JsonLd
        data={personSchema(member, {
          lang,
          jobTitle: member.role,
          knowsLanguage: languages.map((l) => (l === 'ro' ? 'ro-RO' : l)),
        })}
      />
      <InquirySection
        heading={fmt(t.team.askHeading, { name })}
        subheading={fmt(t.team.askSubheading, { name })}
        defaultService={services[0]?.title}
        defaultMessage={fmt(t.team.askMessage, { name: member.name })}
      />
    </>
  )
}
