import Link from 'next/link'

import { getI18n } from '@/i18n/server'
import { breadcrumbSchema } from '@/lib/jsonld'

import { JsonLd } from './JsonLd'

type Crumb = { name: string; path: string }

/** `path`s are given without the language prefix; it is added here. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const { t, href } = getI18n()
  const all = [{ name: t.common.home, path: '/' }, ...items].map((c) => ({ ...c, path: href(c.path) }))
  return (
    <>
      <nav aria-label={t.common.breadcrumb} className="text-xs text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((c, i) => (
            <li key={c.path} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden>/</span>}
              {i === all.length - 1 ? (
                <span aria-current="page" className="text-fg/80">
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className="hover:text-fg">
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(all)} />
    </>
  )
}
