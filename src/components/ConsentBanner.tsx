'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { useI18n } from '@/i18n/client'
import { CONSENT_COOKIE, CONSENT_OPEN_EVENT } from '@/lib/consent'

type Gtag = (...args: unknown[]) => void

function hasChoice() {
  return new RegExp(`(?:^|; )${CONSENT_COOKIE}=(granted|denied)`).test(document.cookie)
}

/**
 * GDPR cookie banner for analytics. "Accept" and "Refuse" are equally prominent (as Romanian/EU
 * regulators require); the choice is kept for 6 months and can be changed from the footer.
 */
export function ConsentBanner() {
  const { t, href } = useI18n()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Shown only after hydration, so it never shifts the server-rendered layout or the LCP image.
    const show = () => setOpen(true)
    if (!hasChoice()) show()
    window.addEventListener(CONSENT_OPEN_EVENT, show)
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, show)
  }, [])

  const choose = (value: 'granted' | 'denied') => {
    document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${60 * 60 * 24 * 180}; samesite=lax`
    const gtag = (window as unknown as { gtag?: Gtag }).gtag
    gtag?.('consent', 'update', { ad_storage: value, ad_user_data: value, ad_personalization: value, analytics_storage: value })
    if (value === 'denied') {
      try {
        localStorage.removeItem('nl_vid')
        localStorage.removeItem('nl_last')
      } catch {
        /* storage unavailable: nothing was kept */
      }
    }
    setOpen(false)
  }

  if (!open) return null
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-2xl border border-line bg-surface p-5 shadow-2xl shadow-black/15 sm:bottom-5"
    >
      <p id="consent-title" className="font-semibold">
        {t.consent.title}
      </p>
      <p className="mt-1.5 text-sm text-muted">
        {t.consent.text}{' '}
        <Link href={href('/privacy')} className="underline underline-offset-2 hover:text-fg">
          {t.consent.privacy}
        </Link>
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => choose('denied')} className="btn-ghost">
          {t.consent.reject}
        </button>
        <button type="button" onClick={() => choose('granted')} className="btn-primary">
          {t.consent.accept}
        </button>
      </div>
    </div>
  )
}

/** Footer link that reopens the banner. */
export function ConsentSettingsButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))} className="hover:text-fg">
      {label}
    </button>
  )
}
