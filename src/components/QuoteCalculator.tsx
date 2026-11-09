'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { useI18n } from '@/i18n/client'
import { fmt as fill } from '@/i18n/config'
import { track } from '@/lib/consent'
import { type AddOn, availableAddOns, calculateQuote, type Rate } from '@/lib/quote'
import { formatMoney } from '@/lib/utils'

import { InquiryForm } from './InquiryForm'

type Props = {
  services: Array<{ id: number; title: string; slug: string }>
  locations: Array<{ slug: string; name: string; travelFee: number }>
  rates: Rate[]
  addOns: AddOn[]
  currency: string
  spreadPercent: number
  initialService?: string
  initialLocation?: string
}

export function QuoteCalculator({
  services,
  locations,
  rates,
  addOns,
  currency,
  spreadPercent,
  initialService,
  initialLocation,
}: Props) {
  const { lang, t, href } = useI18n()
  const priced = services.filter((s) => rates.some((r) => r.serviceId === s.id))
  const [serviceSlug, setServiceSlug] = useState(
    priced.find((s) => s.slug === initialService)?.slug ?? priced[0]?.slug,
  )
  const [locationSlug, setLocationSlug] = useState(
    locations.find((l) => l.slug === initialLocation)?.slug ?? locations[0]?.slug,
  )
  const service = priced.find((s) => s.slug === serviceSlug)
  const rate = rates.find((r) => r.serviceId === service?.id)
  const [hours, setHours] = useState(rate ? Math.max(rate.minHours, Math.min(8, rate.maxHours)) : 4)
  const [selected, setSelected] = useState<string[]>([])
  const [showForm, setShowForm] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)
  // Bring the form into view (it opens below the calculator) and put the cursor in the name field.
  useEffect(() => {
    if (!showForm || !formRef.current) return
    formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    formRef.current
      .querySelector<HTMLInputElement>('input[name="name"]')
      ?.focus({ preventScroll: true })
  }, [showForm])
  const location = locations.find((l) => l.slug === locationSlug)

  const options = rate ? availableAddOns(addOns, rate.serviceId) : []
  const quote = rate
    ? calculateQuote({
        rate,
        hours,
        addOns: options.filter((a) => selected.includes(a.id)),
        travelFee: location?.travelFee ?? 0,
        spreadPercent,
        labels: {
          baseFee: t.quote.baseFee,
          coverage: t.quote.coverageLine,
          travel: t.quote.travel,
        },
      })
    : null

  if (!rate || !service || !quote) return <p className="text-muted">{t.quote.updating}</p>

  const fmt = (n: number) => formatMoney(n, currency, lang)
  const summary = [
    `${service.title} — ${quote.hours}h${location ? fill(t.quote.summaryIn, { city: location.name }) : ''}`,
    ...quote.lines.map((l) => `${l.label}: ${fmt(l.amount)}`),
    fill(t.quote.summaryEstimate, { low: fmt(quote.low), high: fmt(quote.high) }),
  ].join('\n')

  return (
    <div className="space-y-8">
      {/* The sticky estimate lives in its own grid: anything rendered below it (the quote form) is
        outside its sticky area, so the card can never slide over it while scrolling. */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:gap-8">
        <div className="card space-y-8 p-6 sm:p-8">
          <fieldset>
            <legend className="label">{t.quote.service}</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {priced.map((s) => (
                <label
                  key={s.id}
                  className={`cursor-pointer rounded-xl border px-4 py-3 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent has-[:focus-visible]:ring-offset-2 ${s.slug === serviceSlug ? 'border-accent bg-accent/10' : 'border-line hover:border-fg/40'}`}
                >
                  <input
                    type="radio"
                    name="service"
                    value={s.slug}
                    checked={s.slug === serviceSlug}
                    onChange={() => {
                      const r = rates.find((x) => x.serviceId === s.id)
                      setServiceSlug(s.slug)
                      setSelected([])
                      if (r) setHours((h) => Math.min(r.maxHours, Math.max(r.minHours, h)))
                    }}
                    className="sr-only"
                  />
                  {s.title}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="hours" className="label">
              {t.quote.coverage}{' '}
              <span className="text-fg">{fill(t.quote.hoursValue, { hours: quote.hours })}</span>
            </label>
            <input
              id="hours"
              type="range"
              min={rate.minHours}
              max={rate.maxHours}
              step={0.5}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="mt-3 w-full accent-[var(--color-accent)]"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>{rate.minHours}h</span>
              <span>{rate.maxHours}h</span>
            </div>
          </div>

          {locations.length > 0 && (
            <div>
              <label htmlFor="loc" className="label">
                {t.quote.location}
              </label>
              <select
                id="loc"
                className="input"
                value={locationSlug}
                onChange={(e) => setLocationSlug(e.target.value)}
              >
                {locations.map((l) => (
                  <option key={l.slug} value={l.slug}>
                    {l.name}
                    {l.travelFee ? fill(t.quote.travelSuffix, { price: fmt(l.travelFee) }) : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {options.length > 0 && (
            <fieldset>
              <legend className="label">{t.quote.extras}</legend>
              <div className="mt-2 space-y-2">
                {options.map((a) => (
                  <label
                    key={a.id}
                    className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-line px-4 py-3 text-sm hover:border-fg/40"
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(a.id)}
                        onChange={(e) =>
                          setSelected((cur) =>
                            e.target.checked ? [...cur, a.id] : cur.filter((id) => id !== a.id),
                          )
                        }
                        className="h-4 w-4 accent-[var(--color-accent)]"
                      />
                      {a.name}
                    </span>
                    <span className="text-muted">
                      {fmt(a.price)}
                      {a.unit === 'perHour' ? t.quote.perHour : ''}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6 sm:p-8" aria-live="polite">
            <p className="label">{t.quote.estimate}</p>
            <p className="text-3xl font-bold sm:text-4xl">
              {fmt(quote.low)} <span className="text-muted">–</span> {fmt(quote.high)}
            </p>
            <dl className="mt-6 space-y-2 border-t border-line pt-6 text-sm">
              {quote.lines.map((l) => (
                <div key={l.label} className="flex justify-between gap-4">
                  <dt className="text-muted">{l.label}</dt>
                  <dd>{fmt(l.amount)}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-xs text-muted">{t.quote.disclaimer}</p>
            <div className="mt-6 grid gap-3">
              <button type="button" className="btn-primary" onClick={() => { setShowForm(true); track('quote_used', { label: service.slug, value: quote.total }) }}>
                {t.quote.send}
              </button>
              <Link href={href(`/book?service=${service.slug}`)} className="btn-ghost">
                {t.quote.book}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div ref={formRef} className="card scroll-mt-24 p-6 sm:p-8">
          <h2 className="mb-6 text-2xl font-bold">{t.quote.where}</h2>
          <InquiryForm
            services={services}
            compact
            defaultService={service.title}
            defaultLocation={location?.name}
            quoteSummary={summary}
            budget={`${fmt(quote.low)} – ${fmt(quote.high)}`}
          />
        </div>
      )}
    </div>
  )
}
