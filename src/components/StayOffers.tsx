'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useI18n } from '@/i18n/client'
import { parsePublicPath } from '@/i18n/config'
import { pulse } from '@/lib/pulse'

import { DateChecker } from './DateChecker'

const OFFER_KEY = 'nl_leave_offer'
const MIN_SECONDS_ON_SITE = 15

/** Pages where the visitor is already acting, so nothing should compete for their attention. */
const isFocusedPage = (internal: string) => /^\/(book|contact|client|privacy)/.test(internal)

/** Phones: a slim bar with the main action, once the header's button has scrolled away. */
function MobileCta({ internal, hasWhatsApp }: { internal: string; hasWhatsApp: boolean }) {
  const { t, href } = useI18n()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (isFocusedPage(internal) || !visible) return null
  return (
    <div className={`float-action fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-30 sm:right-auto sm:w-72 lg:hidden ${hasWhatsApp ? 'right-[8rem]' : 'right-[4.5rem]'}`}>
      <Link href={href('/book')} data-cta="mobile_bar" className="btn-primary h-12 w-full !px-3 shadow-lg shadow-black/25 sm:h-14">
        {t.stay.mobile}
      </Link>
    </div>
  )
}

/**
 * Desktop: once per visit, when the pointer leaves for the tab bar, offers the most useful thing
 * on the site (a real date check). No discounts or countdowns: the offer has to be true.
 */
function LeaveOffer({ internal }: { internal: string }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (isFocusedPage(internal) || !window.matchMedia('(pointer: fine)').matches) return
    const startedAt = Date.now()
    const onLeave = (e: MouseEvent) => {
      if (e.clientY > 0 || e.relatedTarget || Date.now() - startedAt < MIN_SECONDS_ON_SITE * 1000) return
      try {
        if (sessionStorage.getItem(OFFER_KEY)) return
        sessionStorage.setItem(OFFER_KEY, '1')
      } catch {
        return
      }
      setOpen(true)
      pulse('leave_offer')
    }
    document.addEventListener('mouseout', onLeave)
    return () => document.removeEventListener('mouseout', onLeave)
  }, [internal])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!open) return null
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="leave-title" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-page p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id="leave-title" className="text-2xl font-bold">{t.stay.title}</h2>
          <button type="button" autoFocus onClick={() => setOpen(false)} aria-label={t.stay.close} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line">✕</button>
        </div>
        <p className="mt-2 mb-5 text-muted">{t.stay.text}</p>
        <DateChecker />
      </div>
    </div>
  )
}

export function StayOffers({ hasWhatsApp }: { hasWhatsApp: boolean }) {
  const pathname = usePathname()
  const internal = parsePublicPath(pathname).path
  return (
    <>
      <MobileCta internal={internal} hasWhatsApp={hasWhatsApp} />
      <LeaveOffer internal={internal} />
    </>
  )
}
