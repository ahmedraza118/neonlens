'use client'

import { useEffect } from 'react'

import { track } from '@/lib/consent'

/**
 * Reports contact clicks anywhere on the site as GA4 events (mark them as key events in GA4):
 * phone calls, WhatsApp chats and emails. One delegated listener, so every tel:/mailto:/wa.me
 * link counts, including ones inside CMS content.
 */
export function LeadTracking() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!link) return
      const href = link.getAttribute('href') ?? ''
      const page = window.location.pathname
      if (href.startsWith('tel:')) track('click_call', { page })
      else if (href.startsWith('mailto:')) track('click_email', { page })
      else if (/wa\.me|whatsapp\.com/.test(href)) track('click_whatsapp', { page })
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])
  return null
}
