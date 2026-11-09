import Link from 'next/link'

import { fmt } from '@/i18n/config'
import { getI18n } from '@/i18n/server'
import { NAV } from '@/lib/site'

import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileMenu } from './MobileMenu'

export function Header({ businessName, phone }: { businessName: string; phone?: string | null }) {
  const { t, href } = getI18n()
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-page/90 backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-fg focus:px-3 focus:py-2 focus:text-white">
        {t.nav.skip}
      </a>
      <div className="container-x flex h-16 items-center justify-between gap-3 sm:gap-6">
        <Link href={href('/')} className="flex min-w-0 items-center gap-2 text-[15px] font-bold tracking-tight min-[400px]:text-base sm:text-lg">
          <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
          <span className="truncate">{businessName}</span>
        </Link>
        <nav aria-label={t.nav.main} className="hidden items-center gap-7 text-sm font-medium lg:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={href(item.href)} className="text-muted transition-colors hover:text-fg">
              {t.nav[item.key]}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LanguageSwitcher className="flex" />
          {/* One-tap call on phones: many clients in Romania prefer to call straight away. */}
          {phone && (
            <a
              href={`tel:${phone.replace(/[^\d+]/g, '')}`}
              aria-label={fmt(t.nav.call, { phone })}
              className="grid h-10 w-10 place-items-center rounded-full bg-accent text-white max-[359px]:hidden sm:hidden"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
                <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8Z" />
              </svg>
            </a>
          )}
          <Link href={href('/book')} className="btn-primary hidden !px-5 !py-2.5 sm:inline-flex">
            {t.nav.book}
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
