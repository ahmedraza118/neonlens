import { Suspense } from 'react'

import { getI18n } from '@/i18n/server'
import { getServices } from '@/lib/queries'

import { InquiryForm } from './InquiryForm'

/** Inquiry block placed above the footer on every page. */
export async function InquirySection({
  heading,
  subheading,
  defaultService,
  defaultLocation,
  defaultMessage,
}: {
  heading?: string
  subheading?: string
  defaultService?: string
  defaultLocation?: string
  defaultMessage?: string
}) {
  const services = await getServices()
  const { t } = getI18n()
  return (
    <section id="inquire" className="relative overflow-hidden border-t border-line py-20">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      <div className="container-x relative grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="eyebrow mb-3">{t.inquiry.eyebrow}</p>
          <h2 className="text-3xl font-bold sm:text-5xl">{heading ?? t.inquiry.heading}</h2>
          <p className="mt-5 text-lg text-muted">{subheading ?? t.inquiry.subheading}</p>
        </div>
        <Suspense>
          <InquiryForm services={services.map((s) => ({ title: s.title }))} defaultService={defaultService} defaultLocation={defaultLocation} defaultMessage={defaultMessage} />
        </Suspense>
      </div>
    </section>
  )
}
