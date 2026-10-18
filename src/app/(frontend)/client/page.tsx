import type { Metadata } from 'next'

import { UnlockForm } from './UnlockForm'

export const metadata: Metadata = { title: 'Client Gallery Login', robots: { index: false, follow: false } }

export default function ClientLoginPage() {
  return (
    <section className="container-x py-24 text-center">
      <p className="eyebrow">Clients</p>
      <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Your private gallery</h1>
      <p className="mx-auto mt-4 max-w-lg text-muted">Enter the gallery code and password from your email to view, favourite and download your photos.</p>
      <UnlockForm />
    </section>
  )
}
