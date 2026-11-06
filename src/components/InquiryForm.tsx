'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useActionState, useEffect, useRef } from 'react'

import { type InquiryState, submitInquiry } from '@/actions/inquiry'
import { useI18n } from '@/i18n/client'
import { track } from '@/lib/consent'
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
  const { lang, t, href } = useI18n()
  const BUDGETS = t.inquiry.budgets

  // Filled after hydration (not during render) so server and client HTML match, and again after
  // every submission (React resets the form, which clears these hidden fields).
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now())
    const entries = [...searchParams.entries()].filter(([k]) => k.startsWith('utm_'))
    if (utmRef.current && entries.length) utmRef.current.value = JSON.stringify(Object.fromEntries(entries))
  }, [searchParams, state])

  // After a failed submission React resets the form to its default values, so the defaults are
  // what the visitor typed: nothing they wrote is lost.
  const v = (field: string, fallback = '') => state.values?.[field] ?? fallback
  const today = new Date().toISOString().slice(0, 10)

  // GA4 key event: a real lead (the success state appears only once per submission).
  useEffect(() => {
    if (state.ok) track('generate_lead', { form: quoteSummary ? 'quote' : 'inquiry', page: pathname })
  }, [state.ok, quoteSummary, pathname])

  if (state.ok) {
    return (
      <div role="status" tabIndex={-1} ref={(el) => el?.focus()} className="card p-8 text-center outline-none">
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
        <input id="inq-name" name="name" required autoComplete="name" defaultValue={v('name')} className="input" aria-invalid={!!state.errors?.name} aria-describedby={state.errors?.name ? 'name-error' : undefined} />
        {err('name')}
      </div>
      <div>
        <label htmlFor="inq-email" className="label">{t.inquiry.email}</label>
        <input id="inq-email" name="email" type="email" required autoComplete="email" defaultValue={v('email')} className="input" aria-invalid={!!state.errors?.email} aria-describedby={state.errors?.email ? 'email-error' : undefined} />
        {err('email')}
      </div>
      <div>
        <label htmlFor="inq-service" className="label">{t.inquiry.need}</label>
        <select id="inq-service" name="service" className="input" defaultValue={v('service', defaultService ?? '')}>
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
        <input id="inq-date" name="eventDate" type="date" min={today} defaultValue={v('eventDate')} className="input" />
      </div>
      {!compact && (
        <>
          <div>
            <label htmlFor="inq-phone" className="label">{t.inquiry.phone}</label>
            <input id="inq-phone" name="phone" type="tel" autoComplete="tel" defaultValue={v('phone')} className="input" />
          </div>
          <div>
            <label htmlFor="inq-location" className="label">{t.inquiry.location}</label>
            <input id="inq-location" name="location" defaultValue={v('location', defaultLocation ?? '')} className="input" />
          </div>
        </>
      )}
      <div className={cn(compact && 'sm:col-span-2')}>
        <label htmlFor="inq-budget" className="label">{t.inquiry.budget}</label>
        <select id="inq-budget" name="budget" className="input" defaultValue={v('budget', budget ?? '')}>
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
        <textarea id="inq-message" name="message" rows={compact ? 3 : 5} defaultValue={v('message')} className="input" placeholder={t.inquiry.placeholder} />
      </div>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          {t.inquiry.promise}{' '}
          {t.inquiry.privacyNote.split('{link}')[0]}
          <Link href={href('/privacy')} className="underline underline-offset-2 hover:text-fg">
            {t.inquiry.privacyLink}
          </Link>
          {t.inquiry.privacyNote.split('{link}')[1]}
        </p>
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
