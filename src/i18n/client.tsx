'use client'

import { createContext, type ReactNode, useContext, useMemo } from 'react'

import { type Locale, withLocale } from './config'
import { type Dictionary, getDictionary } from './dictionaries'

const I18nContext = createContext<Locale>('en')

/** Makes the page language available to client components. */
export function I18nProvider({ lang, children }: { lang: Locale; children: ReactNode }) {
  return <I18nContext.Provider value={lang}>{children}</I18nContext.Provider>
}

export function useI18n(): { lang: Locale; t: Dictionary; href: (path: string) => string } {
  const lang = useContext(I18nContext)
  return useMemo(() => ({ lang, t: getDictionary(lang), href: (path: string) => withLocale(path, lang) }), [lang])
}
