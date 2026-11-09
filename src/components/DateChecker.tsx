'use client'

import Link from 'next/link'
import { type FormEvent, useId, useState } from 'react'

import { useI18n } from '@/i18n/client'
import { fmt, intlLocale } from '@/i18n/config'
import { track } from '@/lib/consent'
import { cn } from '@/lib/utils'

type Result = { date: string; status: 'available' | 'unavailable' | 'invalid' } | null

/** One-tap availability check: the question nearly every wedding client asks first. */
export function DateChecker({ service, className }: { service?: string; className?: string }) {
  const { lang, t, href } = useI18n()
  const [date, setDate] = useState('')
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)
  const [result, setResult] = useState<Result>(null)
  const today = new Date().toISOString().slice(0, 10)
  // The "before you go" offer can show a second checker on the same page.
  const inputId = useId()

  const check = async (e: FormEvent) => {
    e.preventDefault()
    if (!date) return
    setBusy(true)
    setFailed(false)
    try {
      const res = await fetch(`/api/availability?date=${encodeURIComponent(date)}`)
      if (!res.ok) throw new Error()
      const data = (await res.json()) as NonNullable<Result>
      setResult(data)
      track('date_check', { label: data.status })
    } catch {
      setFailed(true)
    } finally {
      setBusy(false)
    }
  }

  const readable = result ? new Date(`${result.date}T12:00:00Z`).toLocaleDateString(intlLocale[lang], { dateStyle: 'long', timeZone: 'UTC' }) : ''
  return (
    <div className={cn('card p-5 sm:p-6', className)}>
      <form onSubmit={check} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor={inputId} className="label">{t.dateCheck.label}</label>
          <input id={inputId} type="date" required min={today} value={date} onChange={(e) => { setDate(e.target.value); setResult(null) }} className="input" />
        </div>
        <button type="submit" disabled={busy || !date} data-cta="date_check" className="btn-primary sm:w-auto">
          {busy ? t.dateCheck.checking : t.dateCheck.button}
        </button>
      </form>
      <div aria-live="polite">
        {failed && <p className="mt-4 text-sm text-accent">{t.dateCheck.failed}</p>}
        {result?.status === 'available' && (
          <div className="mt-4 flex flex-col gap-3 rounded-xl bg-accent-soft p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium">{fmt(t.dateCheck.free, { date: readable })}</p>
            <Link href={href(`/book?date=${result.date}${service ? `&service=${service}` : ''}`)} data-cta="date_check_book" className="btn-primary shrink-0">{t.dateCheck.book}</Link>
          </div>
        )}
        {result?.status === 'unavailable' && (
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-line p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">{fmt(t.dateCheck.taken, { date: readable })}</p>
            <Link href={href('/contact')} data-cta="date_check_contact" className="btn-ghost shrink-0">{t.dateCheck.ask}</Link>
          </div>
        )}
        {result?.status === 'invalid' && <p className="mt-4 text-sm text-accent">{t.dateCheck.invalid}</p>}
      </div>
    </div>
  )
}
