'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { useI18n } from '@/i18n/client'
import { pulse } from '@/lib/pulse'

// The conversation UI is only downloaded when someone opens the chat, so it costs visitors nothing.
const ChatPanel = dynamic(() => import('./ChatPanel').then((m) => m.ChatPanel), { ssr: false })

const NUDGE_KEY = 'nl_chat_nudged'
const NUDGE_AFTER_MS = 25_000

export function ChatLauncher({ hasWhatsApp }: { hasWhatsApp: boolean }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [everOpened, setEverOpened] = useState(false)
  const [nudge, setNudge] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (sessionStorage.getItem(NUDGE_KEY)) return
        sessionStorage.setItem(NUDGE_KEY, '1')
      } catch {
        return
      }
      setNudge(true)
    }, NUDGE_AFTER_MS)
    return () => clearTimeout(timer)
  }, [])

  const show = () => {
    setOpen(true)
    setEverOpened(true)
    setNudge(false)
    pulse('chat_open')
  }

  // Phones: beside the WhatsApp button, low enough not to cover content. Larger screens: above it.
  const position = hasWhatsApp
    ? 'right-[4.5rem] bottom-[max(1rem,env(safe-area-inset-bottom))] sm:right-4 sm:bottom-[calc(max(1rem,env(safe-area-inset-bottom))+4.25rem)]'
    : 'right-4 bottom-[max(1rem,env(safe-area-inset-bottom))]'

  return (
    <>
      {!open && (
        <div className={`float-action fixed z-40 flex flex-col items-end gap-2 sm:flex-row sm:items-center ${position}`}>
          {nudge && (
            <div className="flex max-w-[min(14rem,calc(100vw-6rem))] items-start gap-2 rounded-2xl border border-line bg-surface py-2 pr-2 pl-3 text-sm shadow-lg shadow-black/15">
              <button type="button" onClick={show} className="text-left">{t.chat.nudge}</button>
              <button type="button" onClick={() => setNudge(false)} aria-label={t.chat.dismiss} className="-m-1 p-1 text-muted">✕</button>
            </div>
          )}
          <button type="button" onClick={show} aria-label={t.chat.open} className="grid h-12 w-12 place-items-center rounded-full bg-accent text-white shadow-lg shadow-black/30 transition-transform hover:scale-105 sm:h-14 sm:w-14">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden>
              <path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
            </svg>
          </button>
        </div>
      )}
      {everOpened && <ChatPanel open={open} onClose={() => setOpen(false)} />}
    </>
  )
}
