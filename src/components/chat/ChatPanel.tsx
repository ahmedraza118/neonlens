'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type FormEvent, useEffect, useRef, useState } from 'react'

import { useI18n } from '@/i18n/client'
import type { ChatAction } from '@/lib/chat/rules'
import { track } from '@/lib/consent'
import { pulse } from '@/lib/pulse'

type Message = { role: 'user' | 'assistant'; text: string; actions?: ChatAction[] }
type Saved = { token?: string; messages: Message[]; leadSent?: boolean }

/** One saved chat per language: its answers and links are in the language it was held in. */
const storeKey = (lang: string) => `nl_chat_${lang}`
const load = (lang: string): Saved | null => {
  try {
    return JSON.parse(sessionStorage.getItem(storeKey(lang)) ?? 'null')
  } catch {
    return null
  }
}

function LeadForm({ prefill, token, onDone }: { prefill: Extract<ChatAction, { type: 'lead_form' }>; token?: string; onDone: () => void }) {
  const { lang, t, href } = useI18n()
  const pathname = usePathname()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!token) return
    setBusy(true)
    setError('')
    const form = new FormData(e.currentTarget)
    const value = (k: string) => String(form.get(k) ?? '').trim() || undefined
    const res = await fetch('/api/chat/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, name: value('name'), email: value('email'), phone: value('phone'), eventDate: value('eventDate'), service: prefill.service, location: prefill.location, company_website: value('company_website'), lang, page: pathname }),
    }).catch(() => null)
    setBusy(false)
    if (res?.ok) {
      track('chat_lead')
      onDone()
    } else setError(res?.status === 429 ? t.chat.tooMany : t.chat.formError)
  }

  return (
    <form onSubmit={submit} className="mt-2 space-y-2 rounded-xl border border-line bg-surface p-3">
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>{t.inquiry.honeypot}<input type="text" name="company_website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <input name="name" required minLength={2} autoComplete="name" placeholder={t.chat.name} aria-label={t.chat.name} className="input !py-2" />
      <input name="email" type="email" required autoComplete="email" placeholder={t.chat.email} aria-label={t.chat.email} className="input !py-2" />
      <input name="phone" type="tel" autoComplete="tel" placeholder={t.chat.phone} aria-label={t.chat.phone} className="input !py-2" />
      <input name="eventDate" type="date" defaultValue={prefill.date} aria-label={t.chat.date} className="input !py-2" />
      {error && <p role="alert" className="text-xs text-accent">{error}</p>}
      <button type="submit" disabled={busy} data-cta="chat_lead_submit" className="btn-primary w-full !py-2.5">{busy ? t.chat.sending : t.chat.send}</button>
      <p className="text-[11px] text-muted">{t.chat.formNote} <Link href={href('/privacy')} className="underline">{t.inquiry.privacyLink}</Link></p>
    </form>
  )
}

export function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang, t } = useI18n()
  const pathname = usePathname()
  const [saved] = useState(() => load(lang))
  const [token, setToken] = useState(saved?.token)
  const [messages, setMessages] = useState<Message[]>(saved?.messages ?? [])
  const [leadSent, setLeadSent] = useState(saved?.leadSent ?? false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      sessionStorage.setItem(storeKey(lang), JSON.stringify({ token, messages, leadSent }))
    } catch {
      /* private mode: the chat still works for this page */
    }
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [token, messages, leadSent, lang])

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const send = async (text: string) => {
    const message = text.trim().slice(0, 1000)
    if (!message || busy) return
    setInput('')
    setBusy(true)
    setMessages((m) => [...m, { role: 'user', text: message }])
    pulse('chat_message')
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, message, lang, page: pathname }) })
      if (res.status === 429) throw new Error('limit')
      if (!res.ok) throw new Error('failed')
      const data = (await res.json()) as { token: string; reply: { text: string; actions: ChatAction[] } }
      setToken(data.token)
      setMessages((m) => [...m, { role: 'assistant', text: data.reply.text, actions: data.reply.actions }])
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', text: (err as Error).message === 'limit' ? t.chat.tooMany : t.chat.error }])
    } finally {
      setBusy(false)
      inputRef.current?.focus({ preventScroll: true })
    }
  }

  if (!open) return null
  const lastLeadForm = messages.reduce((last, m, i) => (m.actions?.some((a) => a.type === 'lead_form') ? i : last), -1)
  return (
    <section role="dialog" aria-label={t.chat.title} className="fixed inset-x-2 top-2 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-50 flex flex-col overflow-hidden rounded-2xl border border-line bg-page shadow-2xl shadow-black/30 sm:inset-x-auto sm:top-auto sm:right-4 sm:bottom-4 sm:h-[min(36rem,calc(100dvh-2rem))] sm:w-96">
      <header className="flex items-center justify-between gap-3 bg-accent px-4 py-3 text-white">
        <div className="min-w-0">
          <p className="font-semibold">{t.chat.title}</p>
          <p className="text-xs text-white/80">{t.chat.subtitle}</p>
        </div>
        <button type="button" onClick={onClose} aria-label={t.chat.close} className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-white/15">✕</button>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
        <div className="max-w-[88%] rounded-2xl rounded-bl-sm bg-surface-2 px-3.5 py-2.5 text-sm">{t.chat.hello}</div>
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {t.chat.quick.map((q) => (
              <button key={q} type="button" onClick={() => send(q)} className="rounded-full border border-accent/40 px-3 py-1.5 text-sm text-accent-strong hover:bg-accent-soft">{q}</button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i}>
            <div className={m.role === 'user' ? 'ml-auto w-fit max-w-[88%] rounded-2xl rounded-br-sm bg-accent px-3.5 py-2.5 text-sm text-white' : 'w-fit max-w-[88%] rounded-2xl rounded-bl-sm bg-surface-2 px-3.5 py-2.5 text-sm whitespace-pre-line'}>{m.text}</div>
            {m.actions?.map((a, j) =>
              a.type === 'link' ? (
                <Link key={j} href={a.href} data-cta="chat_link" className="btn-ghost mt-2 mr-2 !px-4 !py-2">{a.label}</Link>
              ) : i === lastLeadForm && !leadSent && token ? (
                <LeadForm key={j} prefill={a} token={token} onDone={() => { setLeadSent(true); setMessages((all) => [...all, { role: 'assistant', text: t.chat.thanks }]) }} />
              ) : null,
            )}
          </div>
        ))}
        {busy && <p className="text-sm text-muted">{t.chat.typing}</p>}
        <div ref={endRef} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); void send(input) }} className="border-t border-line p-3">
        <div className="flex gap-2">
          <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} maxLength={1000} placeholder={t.chat.placeholder} aria-label={t.chat.placeholder} className="input !py-2.5" />
          <button type="submit" disabled={busy || !input.trim()} className="btn-primary !px-4">{t.chat.sendShort}</button>
        </div>
        <p className="mt-2 text-[11px] text-muted">{t.chat.disclosure}</p>
      </form>
    </section>
  )
}
