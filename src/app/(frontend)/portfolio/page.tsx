import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ProjectCard } from '@/components/Cards'
import { InquirySection } from '@/components/InquirySection'
import { SectionHeading } from '@/components/SectionHeading'
import { getProjects, getServices, getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { cn } from '@/lib/utils'

export const revalidate = 3600

type Props = { searchParams: Promise<{ service?: string }> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { service } = await searchParams
  const settings = await getSettings()
  return buildMetadata({
    title: 'Portfolio — Weddings, Brands & Events',
    description: `Real projects and case studies by ${settings.businessName}: wedding photography, brand films, events and portraits.`,
    path: '/portfolio',
    // Filtered views are variations of the same page; keep them out of the index.
    noIndex: Boolean(service),
  })
}

export default async function PortfolioPage({ searchParams }: Props) {
  const { service: filter } = await searchParams
  const services = await getServices()
  const active = services.find((s) => s.slug === filter)
  const projects = await getProjects({ serviceId: active?.id })

  return (
    <>
      <section className="container-x pt-12 pb-24">
        <Breadcrumbs items={[{ name: 'Portfolio', path: '/portfolio' }]} />
        <div className="mt-8">
          <SectionHeading as="h1" eyebrow="Portfolio" title="Stories we've told">
            Every project is a case study — the brief, how we approached it, and what the client got.
          </SectionHeading>
        </div>
        <nav aria-label="Filter projects" className="mb-10 flex flex-wrap gap-2">
          <Link href="/portfolio" scroll={false} className={cn('rounded-full border px-4 py-2 text-sm', !active ? 'border-accent bg-accent/10' : 'border-line text-muted hover:text-fg')}>
            All
          </Link>
          {services.map((s) => (
            <Link
              key={s.id}
              href={`/portfolio?service=${s.slug}`}
              scroll={false}
              className={cn('rounded-full border px-4 py-2 text-sm', active?.id === s.id ? 'border-accent bg-accent/10' : 'border-line text-muted hover:text-fg')}
            >
              {s.title}
            </Link>
          ))}
        </nav>
        {projects.length === 0 ? (
          <p className="text-muted">No projects here yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} priority={i < 3} />
            ))}
          </div>
        )}
      </section>
      <InquirySection />
    </>
  )
}
