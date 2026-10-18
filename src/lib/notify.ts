import 'server-only'

import { Resend } from 'resend'

/**
 * Lead/booking notifications. Each channel is optional: if its env vars are missing, the
 * message is logged instead so nothing breaks in development.
 */

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

export function rowsToHtml(title: string, rows: Array<[string, string | null | undefined]>): string {
  const body = rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${escapeHtml(k)}</td><td>${escapeHtml(String(v)).replace(/\n/g, '<br>')}</td></tr>`)
    .join('')
  return `<h2 style="font-family:sans-serif">${escapeHtml(title)}</h2><table style="font-family:sans-serif;font-size:14px">${body}</table>`
}

export async function sendEmail(opts: { to: string; subject: string; html: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.info(`[notify] email (RESEND_API_KEY not set) → ${opts.to}: ${opts.subject}`)
    return
  }
  const resend = new Resend(key)
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'NeonLens <onboarding@resend.dev>',
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    replyTo: opts.replyTo,
  })
  if (error) console.error('[notify] email failed', error)
}

export async function sendWhatsApp(text: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_WHATSAPP_FROM
  const to = process.env.NOTIFY_WHATSAPP_TO
  if (!sid || !token || !from || !to) {
    console.info(`[notify] whatsapp (Twilio not configured): ${text.slice(0, 120)}`)
    return
  }
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ From: from, To: to, Body: text.slice(0, 1500) }),
  })
  if (!res.ok) console.error('[notify] whatsapp failed', res.status, await res.text())
}

/** Notify the studio on every channel at once; never throws. */
export async function notifyStudio(subject: string, rows: Array<[string, string | null | undefined]>, replyTo?: string) {
  const to = process.env.NOTIFY_EMAIL
  const text = `${subject}\n${rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n')}`
  await Promise.allSettled([
    to ? sendEmail({ to, subject, html: rowsToHtml(subject, rows), replyTo }) : Promise.resolve(console.info(`[notify] ${text}`)),
    sendWhatsApp(text),
  ])
}
