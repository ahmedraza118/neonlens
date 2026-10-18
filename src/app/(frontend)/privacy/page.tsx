import type { Metadata } from 'next'

import { getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { PROSE } from '@/lib/utils'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: 'Privacy Policy', description: 'How we handle the data you send us.', path: '/privacy' })
}

export default async function PrivacyPage() {
  const settings = await getSettings()
  return (
    <section className="container-x py-20">
      <div className={`${PROSE} mx-auto max-w-3xl`}>
        <h1>Privacy policy</h1>
        <p>
          {settings.businessName} (“we”) only collects the information you choose to send us through the inquiry, booking and client
          gallery forms: your name, contact details, event details and messages. We use it solely to respond to you, prepare quotes
          and deliver the services you book.
        </p>
        <h2>Payments</h2>
        <p>Deposits are processed by Stripe. We never see or store your card details.</p>
        <h2>Client galleries</h2>
        <p>Private galleries are password-protected and not indexed by search engines. We keep them for the period agreed in your contract.</p>
        <h2>Analytics & cookies</h2>
        <p>We may use privacy-friendly analytics to understand which pages are useful. Client gallery access uses one essential cookie.</p>
        <h2>Your rights</h2>
        <p>
          You can ask us to access, correct or delete your data at any time: <a href={`mailto:${settings.email}`}>{settings.email}</a>.
        </p>
        <p className="text-sm">
          <em>This is a starting template — have it reviewed for your jurisdiction (e.g. GDPR) before launch.</em>
        </p>
      </div>
    </section>
  )
}
