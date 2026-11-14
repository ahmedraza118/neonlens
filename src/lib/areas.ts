import type { Location, Service } from '@/payload-types'

import { populated } from './populated'

/** The location's own copy for a service ("Wedding photography in Snagov"), if written in the CMS. */
export function serviceLocationNote(location: Location | null | undefined, serviceId: number): string | null {
  const note = location?.serviceNotes?.find((n) => populated<Service>(n.service)?.id === serviceId || n.service === serviceId)
  return note?.content ?? null
}

/**
 * Whether a service × area landing page exists (/servicii/fotograf-nunta/snagov).
 *
 * Only when the area has its own text for that service in the CMS (Locations → Service notes), so
 * every landing page is genuinely local, not a copy-paste "doorway" page Google would demote.
 * The primary city (Bucharest) has none: the main service page already targets it, and a second
 * page would compete with it for the same searches.
 */
export function hasAreaPage(location: Location, serviceId: number): boolean {
  return !location.isPrimary && Boolean(serviceLocationNote(location, serviceId))
}

/**
 * Whether Google may index a service × area page. Off by default: until an area page has its own
 * photos and substantial text of its own, it repeats most of the main service page and would split
 * that page's ranking. The page still works for visitors and passes its links on ("noindex, follow").
 * Switch it on per page in the CMS: Locations → Service notes → "indexable".
 */
export function areaPageIndexable(location: Location, serviceId: number): boolean {
  if (!hasAreaPage(location, serviceId)) return false
  const note = location.serviceNotes?.find((n) => populated<Service>(n.service)?.id === serviceId || n.service === serviceId)
  return note?.indexable === true
}

/** "Snagov, Ilfov" — without repeating the region when it equals the name ("București"). */
export function placeName(location: Pick<Location, 'name' | 'region'>): string {
  return location.region && location.region !== location.name ? `${location.name}, ${location.region}` : location.name
}
