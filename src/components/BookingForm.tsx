'use client'

import { useActionState, useEffect, useRef, useState } from 'react'

import { type BookingState, createBooking } from '@/actions/booking'
import { useI18n } from '@/i18n/client'
import { fmt as fill } from '@/i18n/config'
import { track } from '@/lib/consent'
import { pulse } from '@/lib/pulse'
import { depositFor } from '@/lib/quote'
import { formatDate, formatMoney } from '@/lib/utils'

import { Calendar } from './Calendar'

type Pkg = { id: string; name: string; price: number; hours?: number | null; includes?: string[] | null; popular?: boolean | null }
type Props = {
  services: Array<{ slug: string; title: string; packages: Pkg[] }>
  rules: { blockedDates: string[]; blockedWeekdays: number[]; minDate: string; maxDate: string }
  depositPercent: number
  currency: string
  onlinePayments: boolean
  initialService?: string
  initialPackage?: string
  initialDate?: string
}

export function BookingForm({ services, rules, depositPercent, currency, onlinePayments, initialService, initialPackage, initialDate }: Props) {
  const [state, action, pending] = useActionState<BookingState, FormData>(createBooking, { message: '' })
  const { lang, t, href } = useI18n()
  // Defaults = what was submitted, so a server-side error never clears the visitor's details.
  const v = (field: string) => state.values?.[field] ?? ''
  const invalid = (field: string) => ({
    'aria-invalid': Boolean(state.errors?.[field]),
    'aria-describedby': state.errors?.[field] ? `b-${field}-error` : undefined,
  })
  const [serviceSlug, setServiceSlug] = useState(services.find((s) => s.slug === initialService)?.slug ?? services[0]?.slug ?? '')
  const service = services.find((s) => s.slug === serviceSlug)
  const [pkgId, setPkgId] = useState(
    service?.packages.find((p) => p.id === initialPackage || p.name === initialPackage)?.id ??
      service?.packages.find((p) => p.popular)?.id ??
      service?.packages[0]?.id ??
      '',
  )
  const [date, setDate] = useState<string | null>(initialDate ?? null)
  const startedAtRef = useRef<HTMLInputElement>(null)
  const detailsTracked = useRef(false)
  // Filled after hydration, and again after a failed submission (React resets the form).
  const firstSeenAt = useRef(0)
  useEffect(() => {
    firstSeenAt.current ||= Date.now()
    if (startedAtRef.current) startedAtRef.current.value = String(firstSeenAt.current)
  }, [state])
  useEffect(() => pulse('booking_start'), [])
  const chooseDate = (iso: string) => {
    setDate(iso)
    pulse('booking_step', { label: 'date' })
  }
  const pkg = service?.packages.find((p) => p.id === pkgId)
  const deposit = pkg ? depositFor(pkg.price, depositPercent) : 0
  const fmt = (n: number) => formatMoney(n, currency, lang)
  const err = (f: string) => state.errors?.[f] && <p id={`b-${f}-error`} className="mt-1 text-xs text-accent">{state.errors[f]}</p>

  return (
    <form
      action={action}
      onSubmit={() => track('begin_checkout', { service: serviceSlug, package: pkg?.name, label: serviceSlug, value: deposit, currency })}
      className="grid gap-8 lg:grid-cols-[1.4fr_1fr]"
    >
      <input type="hidden" name="lang" value={lang} />
      <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue="" />
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>{t.inquiry.honeypot}<input type="text" name="company_website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="space-y-8">
        <fieldset className="card p-4 sm:p-6">
          <legend className="sr-only">{t.book.servicePackage}</legend>
          <p className="label">{t.book.step1}</p>
          <select
            name="service"
            className="input"
            value={serviceSlug}
            onChange={(e) => {
              const next = services.find((s) => s.slug === e.target.value)
              setServiceSlug(e.target.value)
              setPkgId(next?.packages.find((p) => p.popular)?.id ?? next?.packages[0]?.id ?? '')
            }}
          >
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>{s.title}</option>
            ))}
          </select>
          <p className="label mt-6">{t.book.step2}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {service?.packages.map((p) => (
              // Compact rows on phones (name + hours left, price right), cards from sm up.
              <label key={p.id} className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent has-[:focus-visible]:ring-offset-2 sm:block sm:p-4 ${p.id === pkgId ? 'border-accent bg-accent/10' : 'border-line hover:border-fg/40'}`}>
                <input type="radio" name="packageId" value={p.id} checked={p.id === pkgId} onChange={() => setPkgId(p.id)} className="sr-only" />
                <span className="min-w-0">
                  <span className="block font-semibold">{p.name}</span>
                  {p.hours && <span className="block text-xs text-muted sm:hidden">{fill(t.common.hours, { hours: p.hours })}</span>}
                </span>
                <span className="shrink-0 font-display text-lg font-bold sm:mt-1 sm:block sm:text-xl">{fmt(p.price)}</span>
                {p.hours && <span className="hidden text-xs text-muted sm:block">{fill(t.common.hours, { hours: p.hours })}</span>}
              </label>
            ))}
          </div>
          {err('packageId')}
        </fieldset>

        <div className="card p-4 sm:p-6">
          <p className="label">{t.book.step3}</p>
          <input type="hidden" name="date" value={date ?? ''} />
          <Calendar value={date} onChange={chooseDate} {...rules} />
          {err('date')}
        </div>

        <fieldset
          className="card grid gap-4 p-4 sm:grid-cols-2 sm:p-6"
          onFocus={() => {
            if (detailsTracked.current) return
            detailsTracked.current = true
            pulse('booking_step', { label: 'details' })
          }}
        >
          <legend className="sr-only">{t.book.details}</legend>
          <p className="label sm:col-span-2">{t.book.step4}</p>
          <div>
            <label htmlFor="b-name" className="label">{t.book.name}</label>
            <input id="b-name" name="name" required autoComplete="name" defaultValue={v('name')} className="input" {...invalid('name')} />
            {err('name')}
          </div>
          <div>
            <label htmlFor="b-email" className="label">{t.book.email}</label>
            <input id="b-email" name="email" type="email" required autoComplete="email" defaultValue={v('email')} className="input" {...invalid('email')} />
            {err('email')}
          </div>
          <div>
            <label htmlFor="b-phone" className="label">{t.book.phone}</label>
            <input id="b-phone" name="phone" type="tel" autoComplete="tel" defaultValue={v('phone')} className="input" />
          </div>
          <div>
            <label htmlFor="b-location" className="label">{t.book.venue}</label>
            <input id="b-location" name="location" defaultValue={v('location')} className="input" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="b-notes" className="label">{t.book.notes}</label>
            <textarea id="b-notes" name="notes" rows={3} defaultValue={v('notes')} className="input" />
          </div>
        </fieldset>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="card p-4 sm:p-6">
          <p className="label">{t.book.summary}</p>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3"><dt className="shrink-0 text-muted">{t.book.service}</dt><dd className="min-w-0 text-right">{service?.title}</dd></div>
            <div className="flex justify-between gap-3"><dt className="shrink-0 text-muted">{t.book.package}</dt><dd className="min-w-0 text-right">{pkg?.name}</dd></div>
            <div className="flex justify-between gap-3"><dt className="shrink-0 text-muted">{t.book.date}</dt><dd className="min-w-0 text-right">{date ? formatDate(`${date}T12:00:00Z`, lang) : '—'}</dd></div>
            <div className="flex justify-between gap-3"><dt className="shrink-0 text-muted">{t.book.total}</dt><dd className="min-w-0 text-right">{pkg ? fmt(pkg.price) : '—'}</dd></div>
          </dl>
          <div className="mt-6 border-t border-line pt-6">
            <p className="text-sm text-muted">{fill(onlinePayments ? t.book.depositToday : t.book.depositLater, { percent: depositPercent })}</p>
            <p className="text-3xl font-bold">{fmt(deposit)}</p>
          </div>
          <label className="mt-6 flex gap-3 text-xs text-muted">
            <input type="checkbox" name="terms" required className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-accent)]" />
            <span>
              {t.book.terms.split('{link}')[0]}
              <a href={href('/privacy')} className="underline">{t.book.privacy}</a>
              {t.book.terms.split('{link}')[1]}
            </span>
          </label>
          {err('terms')}
          {!date && <p className="mt-6 text-center text-sm text-muted">{t.book.pickDateHint}</p>}
          <button type="submit" disabled={pending || !date || !pkg} className={`btn-primary w-full ${date ? 'mt-6' : 'mt-3'}`}>
            {pending ? t.book.redirecting : onlinePayments ? fill(t.book.pay, { amount: fmt(deposit) }) : t.book.request}
          </button>
          {state.message && <p role="alert" className="mt-3 text-sm text-accent">{state.message}</p>}
          {onlinePayments && <p className="mt-3 text-center text-xs text-muted">{t.book.secure}</p>}
        </div>
      </aside>
    </form>
  )
}
