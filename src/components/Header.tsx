import Link from 'next/link'

import { NAV } from '@/lib/site'

import { MobileMenu } from './MobileMenu'

export function Header({ businessName }: { businessName: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-page/90 backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-fg focus:px-3 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <div className="container-x flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-accent" />
          {businessName}
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 text-sm font-medium lg:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted transition-colors hover:text-fg">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/book" className="btn-primary hidden !px-5 !py-2.5 sm:inline-flex">
            Book a date
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
