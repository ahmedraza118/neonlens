import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { PostCard } from '@/components/Cards'
import { InquirySection } from '@/components/InquirySection'
import { SectionHeading } from '@/components/SectionHeading'
import { getPosts, getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return buildMetadata({
    title: 'Journal — Prices, Venues & Planning Guides',
    description: `Honest guides from ${settings.businessName}: what photography and video cost, the best venues and photo spots, and how to plan your shoot.`,
    path: '/blog',
  })
}

export default async function BlogPage() {
  const posts = await getPosts()
  return (
    <>
      <section className="container-x pt-12 pb-24">
        <Breadcrumbs items={[{ name: 'Journal', path: '/blog' }]} />
        <div className="mt-8">
          <SectionHeading as="h1" eyebrow="Journal" title="Straight answers before you book">
            Pricing breakdowns, venue guides and planning tips — the questions clients ask us every week.
          </SectionHeading>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      </section>
      <InquirySection />
    </>
  )
}
