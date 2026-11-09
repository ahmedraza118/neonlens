'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useI18n } from '@/i18n/client'
import { LOCALE_COOKIE, type Locale, localeNames, locales, parsePublicPath, withLocale } from '@/i18n/config'
import { cn } from '@/lib/utils'

function rememberLocale(next: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
}

/**
 * The translated URL of the current page. Route names are translated here, so the links work before
 * JavaScript has loaded; a page reached with the other language's slug redirects to its proper URL.
 * Once mounted, the page's hreflang tags give the exact URL and avoid that redirect.
 */
function useTranslatedHrefs(): Record<Locale, string> {
  const pathname = usePathname()
  const { lang } = useI18n()
  const { path } = parsePublicPath(pathname)
  const computed = Object.fromEntries(locales.map((l) => [l, withLocale(path, l)])) as Record<Locale, string>
  const [fromHead, setFromHead] = useState<Partial<Record<Locale, string>>>({})

  useEffect(() => {
    const read = () => {
      const found: Partial<Record<Locale, string>> = {}
      for (const l of locales) {
        const href = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${l}"]`)?.href
        if (href) found[l] = new URL(href).pathname
      }
      // During client-side navigation the head still describes the previous page for a moment.
      setFromHead(found[lang] === pathname ? found : {})
    }
    read()
    // React may reuse the tags and only change their href, so attributes are watched too.
    const observer = new MutationObserver(read)
    observer.observe(document.head, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] })
    return () => observer.disconnect()
  }, [pathname, lang])

  return { ...computed, ...fromHead }
}

/** RO | EN toggle. Remembers the choice in a cookie so the proxy can send the visitor back to it. */
function Switcher({ className }: { className?: string }) {
  const { lang, t } = useI18n()
  const hrefs = useTranslatedHrefs()

  return (
    <div role="group" aria-label={t.nav.language} className={cn('items-center rounded-full border border-line bg-surface p-0.5 text-xs font-semibold', className)}>
      {locales.map((l) => (
        // A full page load (not <Link>): the <html lang> and every CMS text change with the language.
        <a
          key={l}
          href={hrefs[l]}
          hrefLang={l}
          lang={l}
          onClick={(e) => {
            rememberLocale(l)
            // Added at click time: reading the query while rendering would keep these links out of
            // the pre-built HTML. Keeps the visitor's selection, e.g. ?service=… on the price page.
            e.currentTarget.search = window.location.search
          }}
          aria-current={l === lang ? 'true' : undefined}
          title={localeNames[l]}
          className={cn(
            'grid h-9 min-w-9 place-items-center rounded-full px-2.5 uppercase transition-colors',
            l === lang ? 'bg-fg text-white' : 'text-muted hover:text-fg',
          )}
        >
          {l}
        </a>
      ))}
    </div>
  )
}

export function LanguageSwitcher({ className = 'flex' }: { className?: string }) {
  return <Switcher className={className} />
}
