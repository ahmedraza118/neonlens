'use server'

import { headers } from 'next/headers'
import { z } from 'zod'

import { notifyStudio, rowsToHtml, sendEmail } from '@/lib/notify'
import { getPayloadClient } from '@/lib/payload'
import { getSettings } from '@/lib/queries'

export type InquiryState = { ok: boolean; message: string; errors?: Partial<Record<string, string>> }

const schema = z.object({
  name: z.string().trim().min(2, 'Please tell us your name').max(120),
  email: z.email('Please enter a valid email').max(200),
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
  // Spam traps: a hidden field humans never fill, and a minimum time on page.
  if (formData.get('company_website')) return { ok: true, message: 'Thanks! We will be in touch shortly.' }
  const startedAt = Number(formData.get('startedAt') || 0)
  if (startedAt && Date.now() - startedAt < 2500) {
    return { ok: false, message: 'That was quick! Please check the form and submit again.' }
  }

  const raw = Object.fromEntries(
    [...formData.entries()].filter(([, v]) => typeof v === 'string' && v !== '').map(([k, v]) => [k, v]),
  )
  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message
    return { ok: false, message: 'Please fix the highlighted fields.', errors }
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
    data: { ...data, eventDate, utm, referrer, status: 'new' },
  })

  const settings = await getSettings()
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
  ]

  await Promise.allSettled([
    notifyStudio(`New inquiry: ${data.name}${data.service ? ` — ${data.service}` : ''}`, rows, data.email),
    // Instant auto-reply: fast responses win bookings.
    sendEmail({
      to: data.email,
      subject: `Thanks for reaching out to ${settings.businessName}`,
      replyTo: settings.email,
      html: `<p style="font-family:sans-serif">Hi ${data.name.split(' ')[0].replace(/[<>&]/g, '')},</p>
<p style="font-family:sans-serif">Thanks for your message — we reply to every inquiry within 24 hours (usually much sooner). Here is a copy of what you sent:</p>
${rowsToHtml('Your inquiry', rows.slice(2))}
<p style="font-family:sans-serif">Talk soon,<br>${settings.businessName}<br>${settings.phone}</p>`,
    }),
  ])

  return { ok: true, message: 'Thank you! Your message is in — we usually reply within a few hours.' }
}
