import Link from 'next/link'
import type { ReactNode } from 'react'

import type { Discipline } from '@/collections/Team'
import { fmt } from '@/i18n/config'
import { getI18n } from '@/i18n/server'
import { populated } from '@/lib/populated'
import { type Capability, firstName, LEVEL_STEPS, type SkillLevel, yearsOf } from '@/lib/team'
import { cn } from '@/lib/utils'
import type { Media as MediaDoc, Service, Team } from '@/payload-types'

import { Media } from './Media'
import { SectionHeading } from './SectionHeading'

/*
 * How the team is presented: clients book the studio, never a person. So nothing here offers to
 * "book" or "ask for" someone, and no personal contact links are shown. Profiles introduce the
 * people; the team page leads with what the team covers together; every call to action is the
 * studio's own inquiry form.
 */

/** Five-step meter. `tone="dark"` on the dark boards, `"light"` on cards. */
export function SkillMeter({ level, tone = 'light', label }: { level: SkillLevel; tone?: 'light' | 'dark'; label: string }) {
  const filled = LEVEL_STEPS[level] ?? 3
  return (
    <span role="meter" aria-valuemin={0} aria-valuemax={5} aria-valuenow={filled} aria-label={label} className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={cn(
            'h-1.5 flex-1 rounded-full',
            i >= filled ? (tone === 'dark' ? 'bg-white/15' : 'bg-line') : tone === 'dark' ? 'bg-[#5eead4]' : 'bg-accent',
          )}
        />
      ))}
    </span>
  )
}

/** A member's strongest skills, as small meters on their card. */
export function TopSkills({ member, max = 2, className }: { member: Team; max?: number; className?: string }) {
  const { t } = getI18n()
  const skills = (member.skills ?? []).slice(0, max)
  if (skills.length === 0) return null
  return (
    <ul className={cn('space-y-2.5', className)}>
      {skills.map((s) => (
        <li key={s.id ?? s.name}>
          <div className="mb-1 flex justify-between gap-3 text-xs">
            <span className="font-medium text-fg/85">{s.name}</span>
            <span className="text-muted">{t.team.levels[s.level]}</span>
          </div>
          <SkillMeter level={s.level} label={`${s.name}: ${t.team.levels[s.level]}`} />
        </li>
      ))}
    </ul>
  )
}

function DisciplineChips({ member, max = 3 }: { member: Team; max?: number }) {
  const { t } = getI18n()
  const disciplines = (member.disciplines ?? []) as Discipline[]
  if (disciplines.length === 0) return null
  return (
    <p className="mb-2 flex flex-wrap gap-1.5">
      {disciplines.slice(0, max).map((d) => (
        <span key={d} className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase backdrop-blur-sm">
          {t.team.discipline[d]}
        </span>
      ))}
    </p>
  )
}

/**
 * Portrait card. On hover (desktop) the portrait cross-fades to the member's favourite frame, so
 * visitors see both the person and their eye. Name and role sit on the photo, like a film credit.
 */
export function TeamCard({ member, priority, sizes }: { member: Team; priority?: boolean; sizes?: string }) {
  const { t, href } = getI18n()
  const signature = populated<MediaDoc>(member.signatureImage)
  const years = yearsOf(member)
  const imageSizes = sizes ?? '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
  return (
    <Link href={href(`/team/${member.slug}`)} className="group block" data-cta="team_profile">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-2 shadow-sm ring-1 ring-black/5 transition duration-500 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-black/10">
        <Media media={member.photo} fill priority={priority} sizes={imageSizes} className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]" />
        {signature && (
          <Media
            media={signature}
            fill
            alt=""
            sizes={imageSizes}
            className="object-cover opacity-0 transition duration-700 ease-out group-hover:opacity-100 motion-reduce:hidden"
          />
        )}
        {years && (
          <span className="absolute top-4 right-4 rounded-full bg-page/90 px-3 py-1 text-xs font-semibold text-fg shadow-sm backdrop-blur">
            {fmt(t.team.yearsShort, { n: years })}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-5 pt-20 pb-5 text-white">
          <DisciplineChips member={member} />
          <h3 className="text-xl font-bold">{member.name}</h3>
          <p className="text-sm text-white/85">{member.role}</p>
        </div>
      </div>
      <p className="mt-4 line-clamp-2 text-sm text-muted">{member.shortBio}</p>
      <TopSkills member={member} className="mt-4" />
      <p className="mt-4 text-sm font-medium text-accent">
        {t.team.profile} <span aria-hidden className="inline-block transition group-hover:translate-x-1">→</span>
      </p>
    </Link>
  )
}

/** Wide card for a team of one or two: portrait beside the story, so the page never looks empty. */
export function TeamFeatureCard({ member, priority }: { member: Team; priority?: boolean }) {
  const { t, href } = getI18n()
  const years = yearsOf(member)
  return (
    <Link
      href={href(`/team/${member.slug}`)}
      data-cta="team_profile"
      className="group grid overflow-hidden rounded-3xl border border-line bg-surface shadow-sm transition duration-500 hover:shadow-xl hover:shadow-black/10 sm:grid-cols-[minmax(0,17rem)_1fr]"
    >
      <div className="relative aspect-[4/5] bg-surface-2 sm:aspect-auto sm:min-h-[22rem]">
        <Media media={member.photo} fill priority={priority} sizes="(min-width: 640px) 17rem, 100vw" className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]" />
        {years && (
          <span className="absolute top-4 left-4 rounded-full bg-page/90 px-3 py-1 text-xs font-semibold text-fg shadow-sm backdrop-blur">
            {fmt(t.team.yearsShort, { n: years })}
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-col p-6 sm:p-8">
        <p className="eyebrow mb-2">{((member.disciplines ?? []) as Discipline[]).map((d) => t.team.discipline[d]).join(' · ')}</p>
        <h3 className="text-2xl font-bold sm:text-3xl">{member.name}</h3>
        <p className="mt-1 text-muted">{member.role}</p>
        <p className="mt-4 text-fg/85">{member.shortBio}</p>
        <TopSkills member={member} max={3} className="mt-6" />
        <p className="mt-auto pt-6 text-sm font-medium text-accent">
          {t.team.profile} <span aria-hidden className="inline-block transition group-hover:translate-x-1">→</span>
        </p>
      </div>
    </Link>
  )
}

/** The people grid: adapts to the team's size so one person or twelve both look intended. */
export function TeamGrid({ members, priorityCount = 3 }: { members: Team[]; priorityCount?: number }) {
  if (members.length <= 2) {
    return (
      <div className={cn('grid gap-8', members.length === 2 ? 'lg:grid-cols-2' : 'max-w-4xl')}>
        {members.map((m, i) => (
          <TeamFeatureCard key={m.id} member={m} priority={i < priorityCount} />
        ))}
      </div>
    )
  }
  return (
    <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((m, i) => (
        <TeamCard key={m.id} member={m} priority={i < priorityCount} />
      ))}
    </div>
  )
}

/** "The team behind the camera" block for the About page, homepage and service pages. */
export function TeamSection({
  members,
  eyebrow,
  title,
  intro,
  showAllLink = true,
  className,
}: {
  members: Team[]
  eyebrow?: string
  title?: string
  intro?: string
  showAllLink?: boolean
  className?: string
}) {
  const { t, href } = getI18n()
  if (members.length === 0) return null
  const cols = members.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
  return (
    <section className={cn('container-x py-20', className)}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow={eyebrow ?? t.team.sectionEyebrow} title={title ?? t.team.sectionTitle}>
          {intro}
        </SectionHeading>
        {showAllLink && (
          <Link href={href('/team')} className="btn-ghost mb-12 shrink-0">
            {t.team.seeAll}
          </Link>
        )}
      </div>
      {members.length <= 2 ? (
        <TeamGrid members={members} priorityCount={0} />
      ) : (
        <div className={cn('grid gap-8 sm:grid-cols-2', cols)}>
          {members.map((m) => (
            <TeamCard key={m.id} member={m} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
          ))}
        </div>
      )}
    </section>
  )
}

/** Small "Project team" credit with round avatars, for portfolio projects. */
export function CrewCredit({ crew }: { crew: Array<Team | number> | null | undefined }) {
  const { t, href } = getI18n()
  const people = (crew ?? []).map((c) => populated<Team>(c)).filter((c): c is Team => Boolean(c && c.visible !== false))
  if (people.length === 0) return null
  return (
    <div>
      <p className="eyebrow mb-3">{t.team.crew}</p>
      <ul className="flex flex-wrap gap-3">
        {people.map((p) => (
          <li key={p.id}>
            <Link href={href(`/team/${p.slug}`)} className="group flex items-center gap-3 rounded-full border border-line bg-surface py-1.5 pr-4 pl-1.5 hover:border-accent">
              <span className="relative block h-10 w-10 overflow-hidden rounded-full bg-surface-2">
                <Media media={p.photo} fill sizes="40px" className="object-cover" />
              </span>
              <span className="text-sm leading-tight">
                <span className="block font-semibold group-hover:text-accent">{p.name}</span>
                <span className="block text-xs text-muted">{p.role}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Overlapping round portraits: "these people share this skill", without singling anyone out. */
export function AvatarStack({ members, max = 4, ring = 'ring-[#16181a]' }: { members: Team[]; max?: number; ring?: string }) {
  const { t } = getI18n()
  if (members.length === 0) return null
  const shown = members.slice(0, max)
  return (
    <span role="img" aria-label={fmt(t.team.capMembers, { n: members.length })} className="flex items-center">
      {shown.map((m, i) => (
        <span key={m.id} className={cn('relative block h-8 w-8 overflow-hidden rounded-full bg-white/10 ring-2', ring, i > 0 && '-ml-2.5')}>
          <Media media={m.photo} fill alt="" sizes="32px" className="object-cover" />
        </span>
      ))}
      {members.length > max && (
        <span className={cn('-ml-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-[11px] font-semibold ring-2', ring)}>+{members.length - max}</span>
      )}
    </span>
  )
}

/**
 * The team's combined skills on one dark board: what the studio covers and at what level. Each
 * tile links to the matching service page (never to a booking for one person).
 */
export function CapabilityBoard({ capabilities }: { capabilities: Capability[] }) {
  const { t, href } = getI18n()
  if (capabilities.length === 0) return null
  return (
    <section aria-labelledby="capabilities-title" className="relative overflow-hidden bg-[#16181a] py-20 text-white sm:py-24">
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-32 h-96 w-96 rounded-full bg-accent/35 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute right-[-8rem] bottom-[-10rem] h-96 w-96 rounded-full bg-[#5eead4]/10 blur-3xl" />
      <div className="container-x relative">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#5eead4] uppercase">{t.team.capEyebrow}</p>
          <h2 id="capabilities-title" className="mt-3 text-2xl font-bold sm:text-4xl">
            {t.team.capTitle}
          </h2>
          <p className="mt-5 text-lg text-white/70">{t.team.capIntro}</p>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c) => (
            <li key={c.key} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20 hover:bg-white/[0.07] sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg leading-snug font-semibold">{c.name}</h3>
                <span className="mt-1 shrink-0 text-[11px] font-semibold tracking-wide text-[#5eead4] uppercase">{t.team.levels[c.level]}</span>
              </div>
              <div className="mt-4">
                <SkillMeter level={c.level} tone="dark" label={`${c.name}: ${t.team.levels[c.level]}`} />
              </div>
              <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                <AvatarStack members={c.members} />
                {c.service?.slug && (
                  <Link href={href(`/services/${c.service.slug}`)} data-cta="team_capability_service" className="text-sm text-[#5eead4] hover:text-white">
                    {t.team.seeService} <span aria-hidden>→</span>
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** A member's own skills. Links go to the service page, so interest turns into a studio inquiry. */
export function SkillsDashboard({ member }: { member: Team }) {
  const { t, href } = getI18n()
  const skills = member.skills ?? []
  if (skills.length === 0) return null
  const experts = skills.filter((s) => s.level === 'expert').length
  return (
    <section aria-labelledby="skills-title" className="relative mt-10 overflow-hidden rounded-3xl bg-[#16181a] p-6 text-white sm:p-8">
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-accent/40 blur-3xl" />
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-[#5eead4] uppercase">{t.team.skillsEyebrow}</p>
          <h2 id="skills-title" className="mt-2 text-2xl font-bold sm:text-3xl">
            {fmt(t.team.skillsTitle, { name: firstName(member) })}
          </h2>
        </div>
        {experts > 0 && (
          <p className="rounded-full bg-white/10 px-3.5 py-1.5 text-sm">
            <span className="font-semibold text-[#5eead4]">{experts}</span> {t.team.expertCount}
          </p>
        )}
      </div>
      <ul className="relative mt-8 grid gap-x-10 gap-y-6 md:grid-cols-2">
        {skills.map((s) => {
          const service = populated<Service>(s.service)
          return (
            <li key={s.id ?? s.name}>
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <span className="font-semibold">{s.name}</span>
                <span className="shrink-0 text-xs font-medium tracking-wide text-white/65 uppercase">{t.team.levels[s.level]}</span>
              </div>
              <SkillMeter level={s.level} tone="dark" label={`${s.name}: ${t.team.levels[s.level]}`} />
              {service?.slug && (
                <Link href={href(`/services/${service.slug}`)} data-cta="team_skill_service" className="mt-2.5 inline-flex items-center gap-1 text-sm text-[#5eead4] hover:text-white">
                  {t.team.seeService} <span aria-hidden>→</span>
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/** Hero collage: up to four portraits in two staggered columns (one large framed portrait for a team of one). */
export function PortraitMosaic({ members }: { members: Team[] }) {
  const shown = members.slice(0, 4)
  if (shown.length === 0) return null
  const tile = (m: Team, priority: boolean, sizes: string) => (
    <div key={m.id} className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-2 shadow-lg shadow-black/10 ring-1 ring-black/5">
      <Media media={m.photo} fill priority={priority} quality={80} sizes={sizes} className="object-cover" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pt-10 pb-3 text-white">
        <p className="text-sm leading-tight font-semibold">{m.name}</p>
        <p className="text-xs text-white/80">{m.role}</p>
      </div>
    </div>
  )
  if (shown.length === 1) {
    return (
      <div className="relative mx-auto w-full max-w-sm">
        <div aria-hidden className="absolute -inset-3 rotate-3 rounded-[2rem] bg-accent-soft sm:-inset-4" />
        <div className="relative">{tile(shown[0], true, '(min-width: 1024px) 24rem, 90vw')}</div>
      </div>
    )
  }
  const left = shown.filter((_, i) => i % 2 === 0)
  const right = shown.filter((_, i) => i % 2 === 1)
  const sizes = '(min-width: 1024px) 18rem, 45vw'
  return (
    <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4">
      <div aria-hidden className="absolute -inset-4 -rotate-2 rounded-[2rem] bg-accent-soft" />
      <div className="relative space-y-3 sm:space-y-4">{left.map((m, i) => tile(m, i === 0, sizes))}</div>
      <div className="relative space-y-3 pt-10 sm:space-y-4 sm:pt-14">{right.map((m, i) => tile(m, i === 0, sizes))}</div>
    </div>
  )
}

const icon = (path: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-5 w-5">
    {path}
  </svg>
)

/** "One team, one way of working": the studio-level promises that replace per-person selling. */
export function TeamWays({ businessName, hasPhotoAndVideo, languages }: { businessName: string; hasPhotoAndVideo: boolean; languages: string | null }) {
  const { t } = getI18n()
  const items = [
    { ...t.team.ways.standard, icon: icon(<path d="M5 12.5l4.5 4.5L19 7.5" />) },
    { title: t.team.ways.contact.title, text: fmt(t.team.ways.contact.text, { name: businessName }), icon: icon(<path d="M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v7a2.5 2.5 0 01-2.5 2.5H11l-4.5 4v-4h0A2.5 2.5 0 014 13.5z" />) },
    ...(hasPhotoAndVideo
      ? [{ ...t.team.ways.together, icon: icon(<><rect x="3" y="7" width="12" height="10" rx="2" /><path d="M15 10.5l6-3v9l-6-3" /></>) }]
      : []),
    ...(languages
      ? [{ title: fmt(t.team.ways.languages.title, { languages }), text: t.team.ways.languages.text, icon: icon(<><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17" /></>) }]
      : []),
  ]
  return (
    <section className="bg-accent-soft py-20">
      <div className="container-x">
        <SectionHeading eyebrow={t.team.waysEyebrow} title={t.team.waysTitle} />
        <ul className={cn('grid gap-5 sm:grid-cols-2', items.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3')}>
          {items.map((item) => (
            <li key={item.title} className="rounded-2xl border border-accent/10 bg-surface p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white">{item.icon}</span>
              <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
