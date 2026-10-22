'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { NAV } from '@/lib/site'

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? 'Close menu' : 'Open menu'}
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
            id="mobile-nav"
            aria-label="Mobile"
            className="fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto bg-page px-4 py-6"
          >
            <ul className="space-y-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-line py-4 text-xl font-semibold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/book"
                  onClick={() => setOpen(false)}
                  className="btn-primary mt-6 w-full"
                >
                  Book a date
                </Link>
              </li>
            </ul>
          </nav>,
          document.body,
        )}
    </div>
  )
}
