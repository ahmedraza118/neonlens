import Link from 'next/link'

import type { Discipline } from '@/collections/Team'
import { fmt } from '@/i18n/config'
import { getI18n } from '@/i18n/server'
import { populated } from '@/lib/populated'
import { cn } from '@/lib/utils'
import type { Media as MediaDoc, Team } from '@/payload-types'

import { Media } from './Media'
import { SectionHeading } from './SectionHeading'

/** Years since the member started, or null when not set. */
export const yearsOf = (member: Pick<Team, 'since'>) => (member.since ? Math.max(1, new Date().getFullYear() - member.since) : null)

export const firstName = (member: Pick<Team, 'name'>) => member.name.trim().split(/\s+/)[0]

/**
 * Portrait card. On hover (desktop) the portrait cross-fades to the member's favourite frame, so
 * visitors see both the person and their eye. Name and role sit on the photo, like a film credit.
 */
export function TeamCard({ member, priority, sizes }: { member: Team; priority?: boolean; sizes?: string }) {
  const { t, href } = getI18n()
  const signature = populated<MediaDoc>(member.signatureImage)
  const years = yearsOf(member)
  const disciplines = (member.disciplines ?? []) as Discipline[]
  return (
    <Link href={href(`/team/${member.slug}`)} className="group block" data-cta="team_profile">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-2">
        <Media
          media={member.photo}
          fill
          priority={priority}
          sizes={sizes ?? '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
        {signature && (
          <Media
            media={signature}
            fill
            alt=""
            sizes={sizes ?? '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
            className="object-cover opacity-0 transition duration-700 ease-out group-hover:opacity-100 motion-reduce:hidden"
          />
        )}
        {years && (
          <span className="absolute top-4 right-4 rounded-full bg-page/90 px-3 py-1 text-xs font-semibold text-fg shadow-sm backdrop-blur">
            {fmt(t.team.yearsShort, { n: years })}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-5 pt-16 pb-5 text-white">
          {disciplines.length > 0 && (
            <p className="mb-2 flex flex-wrap gap-1.5">
              {disciplines.slice(0, 3).map((d) => (
                <span key={d} className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase backdrop-blur-sm">
                  {t.team.discipline[d]}
                </span>
              ))}
            </p>
          )}
          <h3 className="text-xl font-bold">{member.name}</h3>
          <p className="text-sm text-white/85">{member.role}</p>
        </div>
      </div>
      <p className="mt-4 line-clamp-2 text-sm text-muted">{member.shortBio}</p>
      <TopSkills member={member} />
      <p className="mt-4 text-sm font-medium text-accent">
        {t.team.profile} <span aria-hidden className="inline-block transition group-hover:translate-x-1">→</span>
      </p>
    </Link>
  )
}

/** "Meet the team" block for the About page, homepage and service pages. */
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
  const cols = members.length >= 4 ? 'lg:grid-cols-4' : members.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2 lg:max-w-4xl'
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
      <div className={cn('grid gap-8 sm:grid-cols-2', cols)}>
        {members.map((m) => (
          <TeamCard key={m.id} member={m} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
        ))}
      </div>
    </section>
  )
}

/** Small "Captured by" credit with round avatars, for portfolio projects. */
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

type Skill = NonNullable<Team['skills']>[number]
const LEVEL_STEPS: Record<Skill['level'], number> = { expert: 5, advanced: 4, experienced: 3, growing: 2 }

/** Five-step meter. `tone="dark"` for the dashboard card, `"light"` for team cards. */
export function SkillMeter({ level, tone = 'light', label }: { level: Skill['level']; tone?: 'light' | 'dark'; label: string }) {
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

/** Top skills on a team card: lets visitors compare people at a glance. */
export function TopSkills({ member, max = 2 }: { member: Team; max?: number }) {
  const { t } = getI18n()
  const skills = (member.skills ?? []).slice(0, max)
  if (skills.length === 0) return null
  return (
    <ul className="mt-4 space-y-2.5">
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

/**
 * The skills dashboard on a profile. Dark, high-contrast card so it reads like a spec sheet; every
 * skill linked to a service gets a booking shortcut, turning "she's great at weddings" into a click.
 */
export function SkillsDashboard({ member }: { member: Team }) {
  const { t, href } = getI18n()
  const skills = member.skills ?? []
  if (skills.length === 0) return null
  const name = firstName(member)
  const experts = skills.filter((s) => s.level === 'expert').length
  return (
    <section aria-labelledby="skills-title" className="relative mt-10 overflow-hidden rounded-3xl bg-[#16181a] p-6 text-white sm:p-8">
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-accent/40 blur-3xl" />
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-[#5eead4] uppercase">{t.team.skillsEyebrow}</p>
          <h2 id="skills-title" className="mt-2 text-2xl font-bold sm:text-3xl">
            {fmt(t.team.skillsTitle, { name })}
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
          const service = populated<{ slug?: string | null; title?: string }>(s.service as never)
          return (
            <li key={s.id ?? s.name}>
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <span className="font-semibold">{s.name}</span>
                <span className="shrink-0 text-xs font-medium tracking-wide text-white/65 uppercase">{t.team.levels[s.level]}</span>
              </div>
              <SkillMeter level={s.level} tone="dark" label={`${s.name}: ${t.team.levels[s.level]}`} />
              {service?.slug && (
                <Link
                  href={href(`/book?service=${service.slug}`)}
                  data-cta="team_skill_book"
                  className="mt-2.5 inline-flex items-center gap-1 text-sm text-[#5eead4] hover:text-white"
                >
                  {fmt(t.team.bookFor, { name })} <span aria-hidden>→</span>
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
