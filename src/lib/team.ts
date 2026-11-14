import type { Service, Team } from '@/payload-types'

import { populated } from './populated'

export type SkillLevel = NonNullable<Team['skills']>[number]['level']

export const LEVEL_STEPS: Record<SkillLevel, number> = { expert: 5, advanced: 4, experienced: 3, growing: 2 }

/** Years since the member started, or null when not set. */
export const yearsOf = (member: Pick<Team, 'since'>) => (member.since ? Math.max(1, new Date().getFullYear() - member.since) : null)

export const firstName = (member: Pick<Team, 'name'>) => member.name.trim().split(/\s+/)[0]

/** One thing the team can do, with the best level anyone holds and who shares it. */
export type Capability = {
  key: string
  name: string
  level: SkillLevel
  members: Team[]
  service: Pick<Service, 'id' | 'slug' | 'title'> | null
}

/**
 * The team's skills merged into one list: people who list the same skill are grouped, and the
 * strongest level counts. This is what the team page leads with — clients book the studio, so the
 * page shows what the team covers together rather than ranking people against each other.
 */
export function teamCapabilities(members: Team[]): Capability[] {
  const byKey = new Map<string, Capability>()
  for (const member of members) {
    for (const skill of member.skills ?? []) {
      const key = skill.name.trim().toLocaleLowerCase()
      if (!key) continue
      const service = populated<Service>(skill.service)
      const existing = byKey.get(key)
      if (!existing) {
        byKey.set(key, { key, name: skill.name.trim(), level: skill.level, members: [member], service: service ? { id: service.id, slug: service.slug, title: service.title } : null })
        continue
      }
      if (!existing.members.some((m) => m.id === member.id)) existing.members.push(member)
      if (LEVEL_STEPS[skill.level] > LEVEL_STEPS[existing.level]) existing.level = skill.level
      if (!existing.service && service) existing.service = { id: service.id, slug: service.slug, title: service.title }
    }
  }
  // Strongest first; ties go to the skill more people share. Array.sort is stable, so the order
  // people and skills were entered in the CMS breaks any remaining tie.
  return [...byKey.values()].sort((a, b) => LEVEL_STEPS[b.level] - LEVEL_STEPS[a.level] || b.members.length - a.members.length)
}

/** Numbers for the team page: only what the CMS data supports, nothing estimated. */
export function teamStats(members: Team[]) {
  return {
    people: members.length,
    years: members.reduce((sum, m) => sum + (yearsOf(m) ?? 0), 0),
    languages: [...new Set(members.flatMap((m) => m.languages ?? []))],
    skills: teamCapabilities(members).length,
  }
}
