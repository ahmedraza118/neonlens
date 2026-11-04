import 'server-only'

import { cache } from 'react'

import { defaultLocale, type Locale, toLocale, withLocale } from './config'
import { getDictionary } from './dictionaries'

/**
 * Per-request language for server components. Every layout and page under [lang] calls
 * setRequestLocale() first; shared components then read it with getRequestLocale() instead of
 * receiving it through props. Outside a render (route handlers) it falls back to English.
 */
const store = cache(() => ({ locale: defaultLocale as Locale }))

export function setRequestLocale(value: unknown): Locale {
  const locale = toLocale(value)
  store().locale = locale
  return locale
}

export function getRequestLocale(): Locale {
  return store().locale
}

/** Locale, dictionary and a path helper in one call: `const { t, href } = getI18n()`. */
export function getI18n(lang: Locale = getRequestLocale()) {
  return { lang, t: getDictionary(lang), href: (path: string) => withLocale(path, lang) }
}

/** Resolves `params.lang` in pages: `const { lang, t, href } = await localeFromParams(params)`. */
export async function localeFromParams(params: Promise<{ lang: string }>) {
  return getI18n(setRequestLocale((await params).lang))
}
