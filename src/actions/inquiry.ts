'use server'

import { headers } from 'next/headers'
import { z } from 'zod'

import { fmt, toLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { notifyStudio, rowsToHtml, sendEmail } from '@/lib/notify'
import { getPayloadClient } from '@/lib/payload'
import { getSettings } from '@/lib/queries'

export type InquiryState = { ok: boolean; message: string; errors?: Partial<Record<string, string>> }

const schemaFor = (t: ReturnType<typeof getDictionary>) => z.object({
  name: z.string().trim().min(2, t.actions.nameRequired).max(120),
  email: z.email(t.actions.emailInvalid).max(200),
  phone: z.string().trim().max(40).optional(),
  service: z.string().trim().max(120).optional(),
  eventDate: z.string().trim().max(20).optional(),
  location: z.string().trim().max(120).optional(),
  budget: z.string().trim().max(60).optional(),
  message: z.string().trim().max(5000).optional(),
  quoteSummary: z.string().trim().max(3000).optional(),
  sourcePage: z.string().trim().max(300).optional(),
  utm: z.string().max(1000).optional(),
})

export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const locale = toLocale(formData.get('lang'))
  const t = getDictionary(locale)
  // Spam traps: a hidden field humans never fill, and a minimum time on page.
  if (formData.get('company_website')) return { ok: true, message: t.actions.thanksSpam }
  const startedAt = Number(formData.get('startedAt') || 0)
  if (startedAt && Date.now() - startedAt < 2500) {
    return { ok: false, message: t.actions.tooQuick }
  }

  const raw = Object.fromEntries(
    [...formData.entries()].filter(([k, v]) => k !== 'lang' && typeof v === 'string' && v !== '').map(([k, v]) => [k, v]),
  )
  const parsed = schemaFor(t).safeParse(raw)
  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message
    return { ok: false, message: t.actions.fixFields, errors }
  }
  const data = parsed.data

  let utm: Record<string, string> | undefined
  try {
    utm = data.utm ? JSON.parse(data.utm) : undefined
  } catch {
    utm = undefined
  }

  const payload = await getPayloadClient()
  const referrer = (await headers()).get('referer') ?? undefined
  const eventDate = data.eventDate && !Number.isNaN(Date.parse(data.eventDate)) ? new Date(data.eventDate).toISOString() : undefined

  await payload.create({
    collection: 'inquiries',
    data: { ...data, eventDate, utm, referrer, locale, status: 'new' },
  })

  const settings = await getSettings(locale)
  // Studio alert in English; the client's copy uses their language.
  const rows: Array<[string, string | undefined]> = [
    ['Name', data.name],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Service', data.service],
    ['Date', data.eventDate],
    ['Location', data.location],
    ['Budget', data.budget],
    ['Message', data.message],
    ['Quote', data.quoteSummary],
    ['Page', data.sourcePage],
    ['Language', locale.toUpperCase()],
  ]
  const r = t.actions.rows
  const clientRows: Array<[string, string | undefined]> = [
    [r.phone, data.phone],
    [r.service, data.service],
    [r.date, data.eventDate],
    [r.location, data.location],
    [r.budget, data.budget],
    [r.message, data.message],
    [r.quote, data.quoteSummary],
  ]

  await Promise.allSettled([
    notifyStudio(`New inquiry: ${data.name}${data.service ? ` — ${data.service}` : ''}`, rows, data.email),
    // Instant auto-reply: fast responses win bookings.
    sendEmail({
      to: data.email,
      subject: fmt(t.actions.autoReplySubject, { name: settings.businessName }),
      replyTo: settings.email,
      html: `<p style="font-family:sans-serif">${fmt(t.actions.autoReplyHi, { name: data.name.split(' ')[0].replace(/[<>&]/g, '') })}</p>
<p style="font-family:sans-serif">${t.actions.autoReplyBody}</p>
${rowsToHtml(t.actions.autoReplyTitle, clientRows)}
<p style="font-family:sans-serif">${t.actions.autoReplySignoff}<br>${settings.businessName}<br>${settings.phone}</p>`,
    }),
  ])

  return { ok: true, message: t.actions.thanks }
}
