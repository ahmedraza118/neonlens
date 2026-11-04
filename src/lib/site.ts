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
