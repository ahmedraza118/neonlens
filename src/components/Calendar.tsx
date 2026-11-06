'use client'

import { useMemo, useState } from 'react'

import { useI18n } from '@/i18n/client'
import { intlLocale } from '@/i18n/config'
import { cn } from '@/lib/utils'

type Props = {
  value: string | null
  onChange: (iso: string) => void
  blockedDates: string[]
  blockedWeekdays: number[]
  minDate: string
  maxDate: string
}

const pad = (n: number) => String(n).padStart(2, '0')
const iso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`

/** Lightweight accessible month calendar with unavailable dates greyed out. */
export function Calendar({ value, onChange, blockedDates, blockedWeekdays, minDate, maxDate }: Props) {
  const start = value ?? minDate
  const [cursor, setCursor] = useState(() => ({ y: Number(start.slice(0, 4)), m: Number(start.slice(5, 7)) - 1 }))
  const blocked = useMemo(() => new Set(blockedDates), [blockedDates])
  const { lang, t } = useI18n()

  const first = new Date(Date.UTC(cursor.y, cursor.m, 1))
  const daysInMonth = new Date(Date.UTC(cursor.y, cursor.m + 1, 0)).getUTCDate()
  const offset = (first.getUTCDay() + 6) % 7 // Monday-first grid
  const label = first.toLocaleDateString(intlLocale[lang], { month: 'long', year: 'numeric', timeZone: 'UTC' })

  const canPrev = iso(cursor.y, cursor.m, 1) > minDate.slice(0, 8) + '01'
  const canNext = iso(cursor.y, cursor.m, daysInMonth) < maxDate
  const move = (delta: number) =>
    setCursor(({ y, m }) => {
      const d = new Date(Date.UTC(y, m + delta, 1))
      return { y: d.getUTCFullYear(), m: d.getUTCMonth() }
    })

  return (
    <div className="rounded-2xl border border-line bg-surface-2 p-4">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={() => move(-1)} disabled={!canPrev} className="h-9 w-9 rounded-full hover:bg-accent-soft disabled:opacity-30" aria-label={t.calendar.prev}>
          ‹
        </button>
        <p className="font-semibold" aria-live="polite">{label}</p>
        <button type="button" onClick={() => move(1)} disabled={!canNext} className="h-9 w-9 rounded-full hover:bg-accent-soft disabled:opacity-30" aria-label={t.calendar.next}>
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted">
        {t.calendar.weekdays.map((d) => (
          <span key={d} className="py-1">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: offset }).map((_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const date = iso(cursor.y, cursor.m, day)
          const weekday = new Date(Date.UTC(cursor.y, cursor.m, day)).getUTCDay()
          const disabled = date < minDate || date > maxDate || blocked.has(date) || blockedWeekdays.includes(weekday)
          const selected = value === date
          return (
            <button
              key={date}
              type="button"
              disabled={disabled}
              onClick={() => onChange(date)}
              aria-pressed={selected}
              aria-label={`${new Date(`${date}T12:00:00Z`).toLocaleDateString(intlLocale[lang], { dateStyle: 'full', timeZone: 'UTC' })}${disabled ? t.calendar.unavailable : ''}`}
              className={cn(
                'aspect-square rounded-lg text-sm transition',
                selected ? 'bg-accent font-semibold text-white' : 'hover:bg-accent-soft',
                disabled && 'cursor-not-allowed text-muted/40 line-through hover:bg-transparent',
              )}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
