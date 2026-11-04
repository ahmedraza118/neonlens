/** Pure quote maths, shared by the calculator UI and its tests. */

export type Rate = { serviceId: number; baseFee: number; hourlyRate: number; minHours: number; maxHours: number }
export type AddOn = { id: string; name: string; price: number; unit: 'flat' | 'perHour'; serviceIds: number[] }

export type QuoteInput = {
  rate: Rate
  hours: number
  addOns: AddOn[]
  travelFee?: number
  spreadPercent?: number
  /** Line labels in the visitor's language; `{hours}`/`{rate}` are filled in. */
  labels?: { baseFee: string; coverage: string; travel: string }
}

const DEFAULT_LABELS = { baseFee: 'Base fee (planning & editing)', coverage: 'Coverage — {hours} h × {rate}', travel: 'Travel' }

export type QuoteResult = {
  hours: number
  lines: Array<{ label: string; amount: number }>
  total: number
  low: number
  high: number
}

export function clampHours(rate: Rate, hours: number): number {
  if (!Number.isFinite(hours)) return rate.minHours
  return Math.min(rate.maxHours, Math.max(rate.minHours, Math.round(hours * 2) / 2))
}

export function availableAddOns(addOns: AddOn[], serviceId: number): AddOn[] {
  return addOns.filter((a) => a.serviceIds.length === 0 || a.serviceIds.includes(serviceId))
}

export function calculateQuote({ rate, hours, addOns, travelFee = 0, spreadPercent = 10, labels = DEFAULT_LABELS }: QuoteInput): QuoteResult {
  const h = clampHours(rate, hours)
  const lines: QuoteResult['lines'] = [
    { label: labels.baseFee, amount: rate.baseFee },
    { label: labels.coverage.replace('{hours}', String(h)).replace('{rate}', String(rate.hourlyRate)), amount: rate.hourlyRate * h },
  ]
  for (const addOn of availableAddOns(addOns, rate.serviceId)) {
    lines.push({ label: addOn.name, amount: addOn.unit === 'perHour' ? addOn.price * h : addOn.price })
  }
  if (travelFee > 0) lines.push({ label: labels.travel, amount: travelFee })

  const total = lines.reduce((sum, l) => sum + l.amount, 0)
  const spread = Math.max(0, spreadPercent) / 100
  const round = (n: number) => Math.round(n / 10) * 10
  return { hours: h, lines, total, low: round(total * (1 - spread)), high: round(total * (1 + spread)) }
}

export function depositFor(price: number, depositPercent: number): number {
  return Math.round((price * Math.min(100, Math.max(0, depositPercent))) / 100)
}
