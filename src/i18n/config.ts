/**
 * Site languages. Romanian is the main language (the studio works in Bucharest & Ilfov) and lives
 * at the root with Romanian URLs (/servicii/fotograf-nunta). English is prefixed (/en/services/…).
 *
 * In code, internal paths always use the English route names (the folder names under
 * app/(frontend)/[lang]); withLocale() turns them into the public URL for a language.
 * The CMS uses the same language codes for its localized fields.
 */
export const locales = ['ro', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'ro'

/** Cookie remembering the language a visitor picked in the switcher. */
export const LOCALE_COOKIE = 'NEXT_LOCALE'

export const localeNames: Record<Locale, string> = { ro: 'Română', en: 'English' }
/** BCP 47 tags for Intl date/number formatting and `inLanguage`. */
export const intlLocale: Record<Locale, string> = { ro: 'ro-RO', en: 'en-GB' }
/** Open Graph locale codes. */
export const ogLocale: Record<Locale, string> = { ro: 'ro_RO', en: 'en_GB' }

/** The other language: CMS fields not translated yet fall back to it. */
export const otherLocale = (lang: Locale): Locale => (lang === 'ro' ? 'en' : 'ro')

/**
 * Translated first URL segments: internal (English folder name) → public Romanian segment.
 * Segments not listed (contact, blog) are the same in both languages.
 */
const RO_SEGMENTS: Record<string, string> = {
  services: 'servicii',
  portfolio: 'portofoliu',
  pricing: 'preturi',
  about: 'despre-noi',
  book: 'rezervare',
  reviews: 'recenzii',
  faq: 'intrebari-frecvente',
  locations: 'zone',
  privacy: 'confidentialitate',
  client: 'galerie-client',
}
/** Second-level segments that are translated too (book/success → rezervare/confirmare). */
const RO_SUB_SEGMENTS: Record<string, Record<string, string>> = { book: { success: 'confirmare' } }

const invert = (map: Record<string, string>) => Object.fromEntries(Object.entries(map).map(([k, v]) => [v, k]))
const EN_SEGMENTS = invert(RO_SEGMENTS)
const EN_SUB_SEGMENTS = Object.fromEntries(Object.entries(RO_SUB_SEGMENTS).map(([k, v]) => [k, invert(v)]))

/** English internal first segments whose public Romanian URL is different (old English URLs). */
export function isTranslatedInternalSegment(segment: string): boolean {
  return segment in RO_SEGMENTS
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
}

export function toLocale(value: unknown): Locale {
  return isLocale(value) ? value : defaultLocale
}

function splitPath(path: string): [string, string] {
  const i = path.search(/[?#]/)
  return i === -1 ? [path, ''] : [path.slice(0, i), path.slice(i)]
}

function mapSegments(pathname: string, first: Record<string, string>, sub: Record<string, Record<string, string>>): string {
  const parts = pathname.split('/')
  const original = parts[1]
  if (original && first[original]) parts[1] = first[original]
  if (original && parts[2] && sub[original]?.[parts[2]]) parts[2] = sub[original][parts[2]]
  return parts.join('/')
}

/**
 * Public URL of an internal path in a language:
 * ('/services/fotograf-nunta', 'ro') → '/servicii/fotograf-nunta'; ('/services/x', 'en') → '/en/services/x'.
 */
export function withLocale(path: string, lang: Locale): string {
  if (!path.startsWith('/')) return path
  const [pathname, rest] = splitPath(path)
  if (lang === defaultLocale) return mapSegments(pathname, RO_SEGMENTS, RO_SUB_SEGMENTS) + rest
  return (pathname === '/' ? `/${lang}` : `/${lang}${pathname}`) + rest
}

/**
 * Language and internal path of a public pathname:
 * '/servicii/x' → { lang: 'ro', path: '/services/x' }; '/en/about' → { lang: 'en', path: '/about' }.
 */
export function parsePublicPath(pathname: string): { lang: Locale; path: string } {
  const match = pathname.match(/^\/([a-z]{2})(?=\/|$)/)
  if (match && isLocale(match[1]) && match[1] !== defaultLocale) {
    return { lang: match[1], path: pathname.slice(match[0].length) || '/' }
  }
  return { lang: defaultLocale, path: mapSegments(pathname || '/', EN_SEGMENTS, EN_SUB_SEGMENTS) }
}

/** Fills {placeholders} in a dictionary string. */
export function fmt(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => (key in vars ? String(vars[key]) : `{${key}}`))
}
