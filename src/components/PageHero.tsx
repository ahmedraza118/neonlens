import type { ReactNode } from 'react'

import type { Media as MediaDoc } from '@/payload-types'

import { Breadcrumbs } from './Breadcrumbs'
import { Media } from './Media'

type Props = {
  crumbs: Array<{ name: string; path: string }>
  eyebrow?: string | null
  title: ReactNode
  subtitle?: ReactNode
  image?: MediaDoc | number | null
  children?: ReactNode
}

/** Simple page header: text on the left, photo on the right (stacked on phones). */
export function PageHero({ crumbs, eyebrow, title, subtitle, image, children }: Props) {
  return (
    <section className="container-x pt-8 pb-12 sm:pb-16">
      <Breadcrumbs items={crumbs} />
      <div className="mt-8 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h1 className="text-3xl font-bold leading-tight sm:text-5xl">{title}</h1>
          {subtitle && <div className="mt-5 text-lg text-muted">{subtitle}</div>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
        {image && typeof image === 'object' && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-2">
            <Media media={image} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        )}
      </div>
    </section>
  )
}
