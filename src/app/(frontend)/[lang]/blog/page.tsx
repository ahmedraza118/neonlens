import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { PostCard } from '@/components/Cards'
import { InquirySection } from '@/components/InquirySection'
import { SectionHeading } from '@/components/SectionHeading'
import { fmt } from '@/i18n/config'
import { localeFromParams } from '@/i18n/server'
import { getPosts, getSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, t } = await localeFromParams(params)
  const settings = await getSettings()
  return buildMetadata({
    title: t.blog.metaTitle,
    description: fmt(t.blog.metaDescription, { name: settings.businessName }),
    path: '/blog',
    lang,
  })
}

export default async function BlogPage({ params }: Props) {
  const { t } = await localeFromParams(params)
  const posts = await getPosts()
  return (
    <>
      <section className="container-x pt-12 pb-24">
        <Breadcrumbs items={[{ name: t.nav.journal, path: '/blog' }]} />
        <div className="mt-8">
          <SectionHeading as="h1" eyebrow={t.blog.eyebrow} title={t.blog.title}>
            {t.blog.intro}
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
