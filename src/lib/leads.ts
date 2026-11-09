import 'server-only'

import { fmt, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

import { notifyStudio, rowsToHtml, sendEmail } from './notify'
import { getPayloadClient } from './payload'
import { getSettings } from './queries'

export type LeadInput = {
  name: string
  email: string
  phone?: string
  service?: string
  eventDate?: string
  location?: string
  budget?: string
  message?: string
  quoteSummary?: string
  sourcePage?: string
  referrer?: string
  utm?: Record<string, string>
  source: 'form' | 'quote' | 'chat'
}

/** Saves a lead, alerts the studio and sends the client's auto-reply. Shared by every lead channel. */
export async function createLead(input: LeadInput, locale: Locale) {
  const t = getDictionary(locale)
  const payload = await getPayloadClient()
  const eventDate = input.eventDate && !Number.isNaN(Date.parse(input.eventDate)) ? new Date(input.eventDate).toISOString() : undefined

  const lead = await payload.create({
    collection: 'inquiries',
    data: { ...input, eventDate, locale, status: 'new' },
  })

  const settings = await getSettings(locale)
  // Studio alert in English; the client's copy uses their language.
  const rows: Array<[string, string | undefined]> = [
    ['Name', input.name],
    ['Email', input.email],
    ['Phone', input.phone],
    ['Service', input.service],
    ['Date', input.eventDate],
    ['Location', input.location],
    ['Budget', input.budget],
    ['Message', input.message],
    ['Quote', input.quoteSummary],
    ['Page', input.sourcePage],
    ['Came through', input.source],
    ['Language', locale.toUpperCase()],
  ]
  const r = t.actions.rows
  // The copy sent to the visitor never repeats their free text (message/quote): otherwise the form
  // could be used to send any text "from" the studio's address to any inbox.
  const clientRows: Array<[string, string | undefined]> = [
    [r.phone, input.phone],
    [r.service, input.service],
    [r.date, input.eventDate],
    [r.location, input.location],
    [r.budget, input.budget],
  ]

  await Promise.allSettled([
    notifyStudio(`New inquiry: ${input.name}${input.service ? ` — ${input.service}` : ''}`, rows, input.email),
    // Instant auto-reply: fast responses win bookings.
    sendEmail({
      to: input.email,
      subject: fmt(t.actions.autoReplySubject, { name: settings.businessName }),
      replyTo: settings.email,
      html: `<p style="font-family:sans-serif">${fmt(t.actions.autoReplyHi, { name: input.name.split(' ')[0].replace(/[<>&]/g, '') })}</p>
<p style="font-family:sans-serif">${t.actions.autoReplyBody}</p>
${rowsToHtml(t.actions.autoReplyTitle, clientRows)}
<p style="font-family:sans-serif">${t.actions.autoReplySignoff}<br>${settings.businessName}<br>${settings.phone}</p>`,
    }),
  ])
  return lead
}
