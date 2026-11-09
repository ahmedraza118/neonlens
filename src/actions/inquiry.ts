'use server'

import { headers } from 'next/headers'
import { z } from 'zod'

import { toLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { createLead } from '@/lib/leads'

/** `values` echoes what was submitted so the form can show it again after an error. */
export type InquiryState = { ok: boolean; message: string; errors?: Partial<Record<string, string>>; values?: Record<string, string> }

const ECHO_FIELDS = ['name', 'email', 'phone', 'service', 'eventDate', 'location', 'budget', 'message']
const echo = (formData: FormData) =>
  Object.fromEntries(ECHO_FIELDS.map((k) => [k, String(formData.get(k) ?? '').slice(0, 5000)]))

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
  // Bots post without running the page's script: a missing timestamp counts as too fast.
  const startedAt = Number(formData.get('startedAt') || 0)
  if (!startedAt || Date.now() - startedAt < 2500) {
    return { ok: false, message: t.actions.tooQuick, values: echo(formData) }
  }

  const raw = Object.fromEntries(
    [...formData.entries()].filter(([k, v]) => k !== 'lang' && typeof v === 'string' && v !== '').map(([k, v]) => [k, v]),
  )
  const parsed = schemaFor(t).safeParse(raw)
  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message
    return { ok: false, message: t.actions.fixFields, errors, values: echo(formData) }
  }
  const data = parsed.data

  let utm: Record<string, string> | undefined
  try {
    utm = data.utm ? JSON.parse(data.utm) : undefined
  } catch {
    utm = undefined
  }

  const referrer = (await headers()).get('referer') ?? undefined
  const { quoteSummary } = data
  await createLead({ ...data, utm, referrer, source: quoteSummary ? 'quote' : 'form' }, locale)

  return { ok: true, message: t.actions.thanks }
}
