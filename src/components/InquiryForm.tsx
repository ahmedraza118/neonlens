'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useActionState, useEffect, useRef } from 'react'

import { type InquiryState, submitInquiry } from '@/actions/inquiry'
import { cn } from '@/lib/utils'

type Props = {
  services: Array<{ title: string }>
  compact?: boolean
  defaultService?: string
  defaultLocation?: string
  quoteSummary?: string
  budget?: string
}

const BUDGETS = ['Under €1,000', '€1,000 – €2,000', '€2,000 – €3,500', '€3,500 – €5,000', '€5,000+', 'Not sure yet']

export function InquiryForm({ services, compact, defaultService, defaultLocation, quoteSummary, budget }: Props) {
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, { ok: false, message: '' })
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const startedAtRef = useRef<HTMLInputElement>(null)
  const utmRef = useRef<HTMLInputElement>(null)

  // Filled after hydration (not during render) so server and client HTML match.
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now())
    const entries = [...searchParams.entries()].filter(([k]) => k.startsWith('utm_'))
    if (utmRef.current && entries.length) utmRef.current.value = JSON.stringify(Object.fromEntries(entries))
  }, [searchParams])

  if (state.ok) {
    return (
      <div role="status" className="card p-8 text-center">
        <p className="font-display text-2xl font-bold">Message received ✦</p>
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
      {quoteSummary && <input type="hidden" name="quoteSummary" value={quoteSummary} />}
      {/* Honeypot: hidden from humans and screen readers */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company website
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="inq-name" className="label">Name *</label>
        <input id="inq-name" name="name" required autoComplete="name" className="input" aria-invalid={!!state.errors?.name} aria-describedby="name-error" />
        {err('name')}
      </div>
      <div>
        <label htmlFor="inq-email" className="label">Email *</label>
        <input id="inq-email" name="email" type="email" required autoComplete="email" className="input" aria-invalid={!!state.errors?.email} aria-describedby="email-error" />
        {err('email')}
      </div>
      <div>
        <label htmlFor="inq-service" className="label">What do you need?</label>
        <select id="inq-service" name="service" className="input" defaultValue={defaultService ?? ''}>
          <option value="">Choose a service</option>
          {services.map((s) => (
            <option key={s.title} value={s.title}>
              {s.title}
            </option>
          ))}
          <option value="Other">Something else</option>
        </select>
      </div>
      <div>
        <label htmlFor="inq-date" className="label">Date</label>
        <input id="inq-date" name="eventDate" type="date" className="input" />
      </div>
      {!compact && (
        <>
          <div>
            <label htmlFor="inq-phone" className="label">Phone / WhatsApp</label>
            <input id="inq-phone" name="phone" type="tel" autoComplete="tel" className="input" />
          </div>
          <div>
            <label htmlFor="inq-location" className="label">Location / venue</label>
            <input id="inq-location" name="location" defaultValue={defaultLocation} className="input" />
          </div>
        </>
      )}
      <div className={cn(compact && 'sm:col-span-2')}>
        <label htmlFor="inq-budget" className="label">Budget</label>
        <select id="inq-budget" name="budget" className="input" defaultValue={budget ?? ''}>
          <option value="">Select a range</option>
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
        <label htmlFor="inq-message" className="label">Tell us about it</label>
        <textarea id="inq-message" name="message" rows={compact ? 3 : 5} className="input" placeholder="Venue, number of guests, style you love, deliverables…" />
      </div>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">We reply within 24 hours. No spam, ever.</p>
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? 'Sending…' : 'Check availability'}
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
