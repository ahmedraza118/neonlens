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

export function formatMoney(amount: number, currency = 'EUR', locale = 'en-GB'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(value: string | Date, locale = 'en-GB'): string {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(
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
  'prose prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-neon-2 prose-img:rounded-xl prose-li:marker:text-neon'
