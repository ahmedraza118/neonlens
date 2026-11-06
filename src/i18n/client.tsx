'use client'

import { createContext, type ReactNode, useContext, useMemo } from 'react'

import { type Locale, withLocale } from './config'
import type { Dictionary } from './dictionaries/en'

type I18n = { lang: Locale; t: Dictionary }
const I18nContext = createContext<I18n | null>(null)

/**
 * Makes the page language and its interface text available to client components. The server
 * passes only the current language's dictionary, so the other language is never downloaded.
 */
export function I18nProvider({ lang, dict, children }: { lang: Locale; dict: Dictionary; children: ReactNode }) {
  const value = useMemo(() => ({ lang, t: dict }), [lang, dict])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): { lang: Locale; t: Dictionary; href: (path: string) => string } {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  const { lang, t } = ctx
  return useMemo(() => ({ lang, t, href: (path: string) => withLocale(path, lang) }), [lang, t])
}
