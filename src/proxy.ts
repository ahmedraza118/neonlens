import { type NextRequest, NextResponse } from 'next/server'

import { defaultLocale, isLocale, isTranslatedInternalSegment, LOCALE_COOKIE, parsePublicPath, withLocale } from '@/i18n/config'

/**
 * Language routing. Pages live under app/(frontend)/[lang] with English folder names:
 *  - /en/...          → English, served as is
 *  - /servicii/...    → Romanian (main language): rewritten internally to /ro/services/...
 *  - /ro/...          → redirected to the Romanian URL without prefix (one address per page)
 *  - /services/...    → old English URLs (before Romanian became the main language): → /en/services/...
 * Visitors who picked English in the language switcher (cookie) are sent to /en/... on Romanian URLs.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  // One URL per page: /SERVICII or /Servicii → /servicii (all our URLs are lowercase).
  if (pathname !== pathname.toLowerCase()) {
    const url = req.nextUrl.clone()
    url.pathname = pathname.toLowerCase()
    return NextResponse.redirect(url, 308)
  }
  const first = pathname.split('/')[1] ?? ''
  const redirect = (to: string) => {
    const url = req.nextUrl.clone()
    url.pathname = to
    return NextResponse.redirect(url, 308)
  }

  if (isLocale(first) && first !== defaultLocale) return NextResponse.next()
  if (first === defaultLocale) return redirect(withLocale(pathname.slice(defaultLocale.length + 1) || '/', defaultLocale))
  if (isTranslatedInternalSegment(first)) return redirect(`/en${pathname}`)

  const { path } = parsePublicPath(pathname)
  const preferred = req.cookies.get(LOCALE_COOKIE)?.value
  if (isLocale(preferred) && preferred !== defaultLocale) {
    const url = req.nextUrl.clone()
    url.pathname = withLocale(path, preferred)
    return NextResponse.redirect(url, 307)
  }

  const url = req.nextUrl.clone()
  url.pathname = `/${defaultLocale}${path === '/' ? '' : path}`
  return NextResponse.rewrite(url)
}

export const config = {
  // Skip the CMS, its API (uploads must not pass through here), Next internals and root-level files.
  matcher: ['/((?!api|admin|_next|og|webhooks|sitemap.xml|robots.txt|manifest.webmanifest|icon.svg|favicon.ico|llms.txt).*)'],
}
