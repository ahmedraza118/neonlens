import type { Metadata } from 'next'

import { fmt } from '@/i18n/config'
import { localeFromParams } from '@/i18n/server'
import { getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { PROSE } from '@/lib/utils'

export const revalidate = 86400

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, t } = await localeFromParams(params)
  return buildMetadata({ title: t.privacy.metaTitle, description: t.privacy.metaDescription, path: '/privacy', lang })
}

export default async function PrivacyPage({ params }: Props) {
  const { t } = await localeFromParams(params)
  const settings = await getSettings()
  return (
    <section className="container-x py-20">
      <div className={`${PROSE} mx-auto max-w-3xl`}>
        <h1>{t.privacy.title}</h1>
        <p>{fmt(t.privacy.intro, { name: settings.businessName })}</p>
        <h2>{t.privacy.paymentsTitle}</h2>
        <p>{t.privacy.payments}</p>
        <h2>{t.privacy.galleriesTitle}</h2>
        <p>{t.privacy.galleries}</p>
        <h2>{t.privacy.cookiesTitle}</h2>
        <p>{t.privacy.cookies}</p>
        <h2>{t.privacy.rightsTitle}</h2>
        <p>
          {t.privacy.rights} <a href={`mailto:${settings.email}`}>{settings.email}</a>.
        </p>
        <p className="text-sm">
          <em>{t.privacy.template}</em>
        </p>
      </div>
    </section>
  )
}
