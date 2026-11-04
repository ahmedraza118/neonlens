'use client'

import Link from 'next/link'

import { useI18n } from '@/i18n/client'

export default function NotFound() {
  const { t, href } = useI18n()
  return (
    <section className="container-x grid min-h-[60vh] place-items-center py-24 text-center">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-5xl font-bold">{t.notFound.title}</h1>
        <p className="mt-4 text-muted">{t.notFound.text}</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href={href('/portfolio')} className="btn-primary">{t.common.seeWork}</Link>
          <Link href={href('/')} className="btn-ghost">{t.common.home}</Link>
        </div>
      </div>
    </section>
  )
}
