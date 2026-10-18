import type { Media } from '@/payload-types'

/** Relationship fields come back as either an ID or a populated doc. */
export function populated<T extends object>(value: T | number | string | null | undefined): T | null {
  return value && typeof value === 'object' ? value : null
}

export function asMedia(value: Media | number | null | undefined): Media | null {
  return populated(value)
}
