'use client'

import { usePathname } from 'next/navigation'
import { useReportWebVitals } from 'next/web-vitals'
import { useEffect } from 'react'

import { track } from '@/lib/consent'
import { flushPulse, isReturningVisit, pulse } from '@/lib/pulse'

const reportVital = (metric: { name: string; value: number }) => {
  if (!['LCP', 'INP', 'CLS', 'FCP', 'TTFB'].includes(metric.name)) return
  pulse('vital', { value: Math.round(metric.value * 1000) / 1000, label: metric.name })
  // CLS and INP are final only when the page is hidden, when a delayed send would never run.
  if (document.hidden) flushPulse()
}

/**
 * Measures how visitors really use the site: pages, attention time, scroll depth, real-user speed
 * and every call, WhatsApp, email and main-button click (one delegated listener, so links inside
 * CMS content count too). Time is only counted while the tab is visible and the visitor is active.
 */
export function Pulse() {
  const pathname = usePathname()
  useReportWebVitals(reportVital)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null
      const link = target?.closest?.('a[href]') as HTMLAnchorElement | null
      const href = link?.getAttribute('href') ?? ''
      const page = window.location.pathname
      if (href.startsWith('tel:')) track('click_call', { page })
      else if (href.startsWith('mailto:')) track('click_email', { page })
      else if (/wa\.me|whatsapp\.com/.test(href)) track('click_whatsapp', { page })
      const button = target?.closest?.('[data-cta], .btn-primary') as HTMLElement | null
      if (button) pulse('cta', { label: button.dataset.cta ?? button.textContent?.trim().slice(0, 60) })
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  useEffect(() => {
    const path = pathname
    pulse('pageview', { path, label: isReturningVisit() ? 'returning' : undefined })

    let seconds = 0
    let maxScroll = 0
    let lastActive = Date.now()
    let sent = false
    const markActive = () => (lastActive = Date.now())
    const readScroll = () => {
      markActive()
      const doc = document.documentElement
      const depth = Math.min(100, Math.round(((window.scrollY + window.innerHeight) / Math.max(doc.scrollHeight, 1)) * 100))
      if (depth > maxScroll) maxScroll = depth
    }
    readScroll()
    const tick = setInterval(() => {
      if (!document.hidden && Date.now() - lastActive < 30_000) seconds++
    }, 1000)

    const report = () => {
      if (sent) return
      sent = true
      pulse('engage', { path, value: seconds, label: String(maxScroll) })
      flushPulse()
    }
    // Phones often kill the page without an unload event; leaving the tab is the reliable last signal.
    const onHidden = () => {
      if (!document.hidden) {
        sent = false
        return
      }
      if (seconds > 0) {
        report()
        seconds = 0
      }
    }
    window.addEventListener('scroll', readScroll, { passive: true })
    window.addEventListener('pointermove', markActive, { passive: true })
    window.addEventListener('keydown', markActive)
    document.addEventListener('visibilitychange', onHidden)
    return () => {
      report()
      clearInterval(tick)
      window.removeEventListener('scroll', readScroll)
      window.removeEventListener('pointermove', markActive)
      window.removeEventListener('keydown', markActive)
      document.removeEventListener('visibilitychange', onHidden)
    }
  }, [pathname])

  return null
}
