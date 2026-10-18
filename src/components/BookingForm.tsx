'use client'

import { useActionState, useState } from 'react'

import { type BookingState, createBooking } from '@/actions/booking'
import { depositFor } from '@/lib/quote'
import { formatMoney } from '@/lib/utils'

import { Calendar } from './Calendar'

type Pkg = { name: string; price: number; hours?: number | null; includes?: string[] | null; popular?: boolean | null }
type Props = {
  services: Array<{ slug: string; title: string; packages: Pkg[] }>
  rules: { blockedDates: string[]; blockedWeekdays: number[]; minDate: string; maxDate: string }
  depositPercent: number
  currency: string
  onlinePayments: boolean
  initialService?: string
  initialPackage?: string
}

export function BookingForm({ services, rules, depositPercent, currency, onlinePayments, initialService, initialPackage }: Props) {
  const [state, action, pending] = useActionState<BookingState, FormData>(createBooking, { message: '' })
  const [serviceSlug, setServiceSlug] = useState(services.find((s) => s.slug === initialService)?.slug ?? services[0]?.slug ?? '')
  const service = services.find((s) => s.slug === serviceSlug)
  const [pkgName, setPkgName] = useState(service?.packages.find((p) => p.name === initialPackage)?.name ?? service?.packages.find((p) => p.popular)?.name ?? service?.packages[0]?.name ?? '')
  const [date, setDate] = useState<string | null>(null)
  const pkg = service?.packages.find((p) => p.name === pkgName)
  const deposit = pkg ? depositFor(pkg.price, depositPercent) : 0
  const fmt = (n: number) => formatMoney(n, currency)
  const err = (f: string) => state.errors?.[f] && <p className="mt-1 text-xs text-accent">{state.errors[f]}</p>

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-8">
        <fieldset className="card p-6">
          <legend className="sr-only">Service and package</legend>
          <p className="label">1. Service</p>
          <select
            name="service"
            className="input"
            value={serviceSlug}
            onChange={(e) => {
              const next = services.find((s) => s.slug === e.target.value)
              setServiceSlug(e.target.value)
              setPkgName(next?.packages.find((p) => p.popular)?.name ?? next?.packages[0]?.name ?? '')
            }}
          >
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>{s.title}</option>
            ))}
          </select>
          <p className="label mt-6">2. Package</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {service?.packages.map((p) => (
              <label key={p.name} className={`cursor-pointer rounded-xl border p-4 text-sm transition ${p.name === pkgName ? 'border-accent bg-accent/10' : 'border-line hover:border-fg/40'}`}>
                <input type="radio" name="packageName" value={p.name} checked={p.name === pkgName} onChange={() => setPkgName(p.name)} className="sr-only" />
                <span className="block font-semibold">{p.name}</span>
                <span className="mt-1 block font-display text-xl font-bold">{fmt(p.price)}</span>
                {p.hours && <span className="text-xs text-muted">{p.hours}h coverage</span>}
              </label>
            ))}
          </div>
          {err('packageName')}
        </fieldset>

        <div className="card p-6">
          <p className="label">3. Date</p>
          <input type="hidden" name="date" value={date ?? ''} />
          <Calendar value={date} onChange={setDate} {...rules} />
          {err('date')}
        </div>

        <fieldset className="card grid gap-4 p-6 sm:grid-cols-2">
          <legend className="sr-only">Your details</legend>
          <p className="label sm:col-span-2">4. Your details</p>
          <div>
            <label htmlFor="b-name" className="label">Name *</label>
            <input id="b-name" name="name" required autoComplete="name" className="input" />
            {err('name')}
          </div>
          <div>
            <label htmlFor="b-email" className="label">Email *</label>
            <input id="b-email" name="email" type="email" required autoComplete="email" className="input" />
            {err('email')}
          </div>
          <div>
            <label htmlFor="b-phone" className="label">Phone</label>
            <input id="b-phone" name="phone" type="tel" autoComplete="tel" className="input" />
          </div>
          <div>
            <label htmlFor="b-location" className="label">Venue / location</label>
            <input id="b-location" name="location" className="input" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="b-notes" className="label">Anything we should know?</label>
            <textarea id="b-notes" name="notes" rows={3} className="input" />
          </div>
        </fieldset>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="card p-6">
          <p className="label">Summary</p>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Service</dt><dd>{service?.title}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Package</dt><dd>{pkg?.name}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Date</dt><dd>{date ?? '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Total</dt><dd>{pkg ? fmt(pkg.price) : '—'}</dd></div>
          </dl>
          <div className="mt-6 border-t border-line pt-6">
            <p className="text-sm text-muted">{onlinePayments ? `Deposit today (${depositPercent}%)` : `Deposit (${depositPercent}%) — we'll send payment details`}</p>
            <p className="text-3xl font-bold">{fmt(deposit)}</p>
          </div>
          <label className="mt-6 flex gap-3 text-xs text-muted">
            <input type="checkbox" name="terms" className="mt-0.5 h-4 w-4 accent-[var(--color-accent)]" />
            <span>I understand the deposit reserves my date and is non-refundable if I cancel, and I accept the <a href="/privacy" className="underline">privacy policy</a>.</span>
          </label>
          {err('terms')}
          <button type="submit" disabled={pending || !date || !pkg} className="btn-primary mt-6 w-full">
            {pending ? 'Redirecting…' : onlinePayments ? `Pay ${fmt(deposit)} deposit` : 'Request booking'}
          </button>
          {state.message && <p role="alert" className="mt-3 text-sm text-accent">{state.message}</p>}
          {onlinePayments && <p className="mt-3 text-center text-xs text-muted">Secure payment by Stripe · cards, Apple Pay, Google Pay</p>}
        </div>
      </aside>
    </form>
  )
}
