import type { Dictionary } from '@/i18n/dictionaries'

/** Main navigation; labels come from the dictionary (t.nav[key]). */
export const NAV = [
  { href: '/portfolio', key: 'portfolio' },
  { href: '/services', key: 'services' },
  { href: '/pricing', key: 'pricing' },
  { href: '/about', key: 'about' },
  { href: '/blog', key: 'journal' },
  { href: '/contact', key: 'contact' },
] as const satisfies ReadonlyArray<{ href: string; key: keyof Dictionary['nav'] }>

/** Content-driven pages: hidden from menus and the sitemap while they are empty. */
export const CONTENT_PAGES = { '/portfolio': 'portfolio', '/blog': 'blog', '/reviews': 'reviews' } as const
export type ContentPage = (typeof CONTENT_PAGES)[keyof typeof CONTENT_PAGES]

export const isShown = (path: string, presence: Partial<Record<ContentPage, boolean>> | undefined) => {
  const key = CONTENT_PAGES[path as keyof typeof CONTENT_PAGES]
  return !key || !presence || presence[key] !== false
}
