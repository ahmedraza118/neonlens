'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useActionState, useEffect, useRef } from 'react'

import { type InquiryState, submitInquiry } from '@/actions/inquiry'
import { useI18n } from '@/i18n/client'
import { cn } from '@/lib/utils'

type Props = {
  services: Array<{ title: string }>
  compact?: boolean
  defaultService?: string
  defaultLocation?: string
  quoteSummary?: string
  budget?: string
}

export function InquiryForm({ services, compact, defaultService, defaultLocation, quoteSummary, budget }: Props) {
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, { ok: false, message: '' })
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const startedAtRef = useRef<HTMLInputElement>(null)
  const utmRef = useRef<HTMLInputElement>(null)
  const { lang, t } = useI18n()
  const BUDGETS = t.inquiry.budgets

  // Filled after hydration (not during render) so server and client HTML match.
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now())
    const entries = [...searchParams.entries()].filter(([k]) => k.startsWith('utm_'))
    if (utmRef.current && entries.length) utmRef.current.value = JSON.stringify(Object.fromEntries(entries))
  }, [searchParams])

  if (state.ok) {
    return (
      <div role="status" className="card p-8 text-center">
        <p className="font-display text-2xl font-bold">{t.inquiry.received}</p>
        <p className="mt-2 text-muted">{state.message}</p>
      </div>
    )
  }

  const err = (field: string) =>
    state.errors?.[field] ? (
      <p id={`${field}-error`} className="mt-1 text-xs text-accent">
        {state.errors[field]}
      </p>
    ) : null

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2" noValidate>
      <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue="" />
      <input type="hidden" name="sourcePage" value={pathname} />
      <input ref={utmRef} type="hidden" name="utm" defaultValue="" />
      <input type="hidden" name="lang" value={lang} />
      {quoteSummary && <input type="hidden" name="quoteSummary" value={quoteSummary} />}
      {/* Honeypot: hidden from humans and screen readers */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          {t.inquiry.honeypot}
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="inq-name" className="label">{t.inquiry.name}</label>
        <input id="inq-name" name="name" required autoComplete="name" className="input" aria-invalid={!!state.errors?.name} aria-describedby="name-error" />
        {err('name')}
      </div>
      <div>
        <label htmlFor="inq-email" className="label">{t.inquiry.email}</label>
        <input id="inq-email" name="email" type="email" required autoComplete="email" className="input" aria-invalid={!!state.errors?.email} aria-describedby="email-error" />
        {err('email')}
      </div>
      <div>
        <label htmlFor="inq-service" className="label">{t.inquiry.need}</label>
        <select id="inq-service" name="service" className="input" defaultValue={defaultService ?? ''}>
          <option value="">{t.inquiry.chooseService}</option>
          {services.map((s) => (
            <option key={s.title} value={s.title}>
              {s.title}
            </option>
          ))}
          <option value="Other">{t.inquiry.other}</option>
        </select>
      </div>
      <div>
        <label htmlFor="inq-date" className="label">{t.inquiry.date}</label>
        <input id="inq-date" name="eventDate" type="date" className="input" />
      </div>
      {!compact && (
        <>
          <div>
            <label htmlFor="inq-phone" className="label">{t.inquiry.phone}</label>
            <input id="inq-phone" name="phone" type="tel" autoComplete="tel" className="input" />
          </div>
          <div>
            <label htmlFor="inq-location" className="label">{t.inquiry.location}</label>
            <input id="inq-location" name="location" defaultValue={defaultLocation} className="input" />
          </div>
        </>
      )}
      <div className={cn(compact && 'sm:col-span-2')}>
        <label htmlFor="inq-budget" className="label">{t.inquiry.budget}</label>
        <select id="inq-budget" name="budget" className="input" defaultValue={budget ?? ''}>
          <option value="">{t.inquiry.selectRange}</option>
          {budget && !BUDGETS.includes(budget) && <option value={budget}>{budget}</option>}
          {BUDGETS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      {compact && (
        <input type="hidden" name="location" value={defaultLocation ?? ''} />
      )}
      <div className="sm:col-span-2">
        <label htmlFor="inq-message" className="label">{t.inquiry.message}</label>
        <textarea id="inq-message" name="message" rows={compact ? 3 : 5} className="input" placeholder={t.inquiry.placeholder} />
      </div>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">{t.inquiry.promise}</p>
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? t.inquiry.sending : t.inquiry.submit}
        </button>
      </div>
      {state.message && !state.ok && (
        <p role="alert" className="text-sm text-accent sm:col-span-2">
          {state.message}
        </p>
      )}
    </form>
  )
}
