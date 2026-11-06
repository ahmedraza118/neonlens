'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

import { useI18n } from '@/i18n/client'
import { LOCALE_COOKIE, type Locale, localeNames, locales, parsePublicPath, withLocale } from '@/i18n/config'
import { cn } from '@/lib/utils'

function rememberLocale(next: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
}

/**
 * The translated URL of the current page. Slugs differ per language, so the page's own hreflang
 * links (in <head>) are the source of truth; route names alone are the fallback.
 */
function useTranslatedHrefs(): Record<Locale, string> | null {
  const pathname = usePathname()
  const search = useSearchParams().toString()
  const query = search ? `?${search}` : ''
  const { path } = parsePublicPath(pathname)
  const computed = Object.fromEntries(locales.map((l) => [l, withLocale(path, l) + query])) as Record<Locale, string>
  // null until mounted: the server does not know a page's translated slug, so the link to the
  // other language is only rendered once the real URL is known (crawlers use the hreflang tags).
  const [fromHead, setFromHead] = useState<Partial<Record<Locale, string>> | null>(null)

  useEffect(() => {
    const read = () => {
      const found: Partial<Record<Locale, string>> = {}
      for (const l of locales) {
        const href = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${l}"]`)?.href
        if (href) found[l] = new URL(href).pathname + query
      }
      setFromHead(found)
    }
    read()
    // Metadata can stream in after the first paint on client-side navigations.
    const observer = new MutationObserver(read)
    observer.observe(document.head, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [pathname, query])

  return fromHead && { ...computed, ...fromHead }
}

/** RO | EN toggle. Remembers the choice in a cookie so the proxy can send the visitor back to it. */
function Switcher({ className }: { className?: string }) {
  const { lang, t } = useI18n()
  const hrefs = useTranslatedHrefs()
  const pathname = usePathname()

  return (
    <div role="group" aria-label={t.nav.language} className={cn('items-center rounded-full border border-line bg-surface p-0.5 text-xs font-semibold', className)}>
      {locales.map((l) => (
        // A full page load (not <Link>): the <html lang> and every CMS text change with the language.
        <a
          key={l}
          href={hrefs?.[l] ?? (l === lang ? pathname : undefined)}
          hrefLang={l}
          lang={l}
          onClick={() => rememberLocale(l)}
          aria-current={l === lang ? 'true' : undefined}
          title={localeNames[l]}
          className={cn(
            'rounded-full px-3 py-2 uppercase transition-colors sm:px-2.5 sm:py-1',
            l === lang ? 'bg-fg text-white' : 'text-muted hover:text-fg',
          )}
        >
          {l}
        </a>
      ))}
    </div>
  )
}

export function LanguageSwitcher({ className }: { className?: string }) {
  return (
    <Suspense fallback={<div className={cn('h-7 w-[76px]', className)} />}>
      <Switcher className={className ?? 'flex'} />
    </Suspense>
  )
}
