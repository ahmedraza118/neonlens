'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import { useI18n } from '@/i18n/client'

/** Branded, translated error page (inside the site layout) instead of the bare framework screen. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t, href } = useI18n()
  useEffect(() => {
    console.error(error)
  }, [error])
  return (
    <section className="container-x grid min-h-[60vh] place-items-center py-24 text-center">
      <div className="max-w-xl">
        <p className="eyebrow">500</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{t.error.title}</h1>
        <p className="mt-4 text-muted">{t.error.text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn-primary">
            {t.error.retry}
          </button>
          <Link href={href('/contact')} className="btn-ghost">
            {t.nav.contact}
          </Link>
        </div>
      </div>
    </section>
  )
}
