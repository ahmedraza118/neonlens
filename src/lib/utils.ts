import { intlLocale, type Locale } from '@/i18n/config'

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

export function formatMoney(amount: number, currency = 'EUR', lang: Locale = 'en'): string {
  return new Intl.NumberFormat(intlLocale[lang], {
    style: 'currency',
    currency,
    // "€" rather than "EUR" in every language (ro-RO would otherwise print "1.200 EUR").
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(value: string | Date, lang: Locale = 'en'): string {
  return new Intl.DateTimeFormat(intlLocale[lang], { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(value),
  )
}

/** Camera-default file names (IMG_1234.jpg, DSC0042.jpg …) are useless for image SEO. */
export function isGenericFilename(name: string): boolean {
  return /^(img|dsc|dscf|dscn|pxl|mvi|gopr|_mg|p\d{3}|image|photo|untitled)[-_ ]?\d*/i.test(name)
}

/** Builds an absolute URL on the public site. */
export function absoluteUrl(path = '/'): string {
  const base = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')
  return path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`
}

/** Typography classes for rich text / long-form content. */
export const PROSE =
  'prose max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-accent-strong prose-img:rounded-xl prose-li:marker:text-accent'
