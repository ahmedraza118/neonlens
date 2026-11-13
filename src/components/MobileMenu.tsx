'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useI18n } from '@/i18n/client'
import { type ContentPage, isShown, NAV } from '@/lib/site'

export function MobileMenu({ presence }: { presence?: Record<ContentPage, boolean> }) {
  const [open, setOpen] = useState(false)
  const { t, href } = useI18n()
  const pathname = usePathname()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const navRef = useRef<HTMLElement>(null)

  // Close when the page changes (e.g. browser back button).
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    // While open: no page scroll, the page behind is inert (keyboard and screen readers stay in
    // the menu), focus starts on the first link, Escape closes and focus returns to the toggle.
    const background = [document.getElementById('main'), document.querySelector('footer')].filter(Boolean) as HTMLElement[]
    document.body.style.overflow = 'hidden'
    background.forEach((el) => el.setAttribute('inert', ''))
    navRef.current?.querySelector<HTMLElement>('a')?.focus()
    const toggle = toggleRef.current
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      background.forEach((el) => el.removeAttribute('inert'))
      window.removeEventListener('keydown', onKey)
      toggle?.focus()
    }
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
        onClick={() => setOpen((o) => !o)}
        className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface"
      >
        <span aria-hidden className="text-lg leading-none">
          {open ? '✕' : '☰'}
        </span>
      </button>
      {/* Portal to body: the header's backdrop-filter would otherwise become the containing block for `fixed` */}
      {open &&
        createPortal(
          <nav
            ref={navRef}
            id="mobile-nav"
            aria-label={t.nav.mobile}
            className="fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto bg-page px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
          >
            <ul className="space-y-1">
              {NAV.filter((item) => isShown(item.href, presence)).map((item) => (
                <li key={item.href}>
                  <Link
                    href={href(item.href)}
                    onClick={() => setOpen(false)}
                    className="block border-b border-line py-4 text-xl font-semibold"
                  >
                    {t.nav[item.key]}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={href('/book')}
                  onClick={() => setOpen(false)}
                  className="btn-primary mt-6 w-full"
                >
                  {t.nav.book}
                </Link>
              </li>
            </ul>
          </nav>,
          document.body,
        )}
    </div>
  )
}
