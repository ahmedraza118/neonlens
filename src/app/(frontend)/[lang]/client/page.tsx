import type { Metadata } from 'next'

import { localeFromParams } from '@/i18n/server'

import { UnlockForm } from './UnlockForm'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await localeFromParams(params)
  return { title: t.client.metaLogin, robots: { index: false, follow: false } }
}

export default async function ClientLoginPage({ params }: Props) {
  const { t } = await localeFromParams(params)
  return (
    <section className="container-x py-24 text-center">
      <p className="eyebrow">{t.client.eyebrow}</p>
      <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{t.client.title}</h1>
      <p className="mx-auto mt-4 max-w-lg text-muted">{t.client.intro}</p>
      <UnlockForm />
    </section>
  )
}
