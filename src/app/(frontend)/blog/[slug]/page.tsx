import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { PostCard } from '@/components/Cards'
import { Faq } from '@/components/Faq'
import { InquirySection } from '@/components/InquirySection'
import { JsonLd } from '@/components/JsonLd'
import { Media } from '@/components/Media'
import { articleSchema } from '@/lib/jsonld'
import { getPost, getPosts, getSettings, populated } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { formatDate, PROSE } from '@/lib/utils'
import type { Service } from '@/payload-types'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: populated(post.coverImage),
    seo: post.seo,
    type: 'article',
    publishedTime: post.publishedAt,
  })
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const [post, settings, all] = await Promise.all([getPost(slug), getSettings(), getPosts(4)])
  if (!post) notFound()
  const services = (post.relatedServices ?? []).map((s) => populated<Service>(s)).filter((s): s is Service => !!s)
  const more = all.filter((p) => p.id !== post.id).slice(0, 3)

  return (
    <>
      <article className="container-x pt-12 pb-16">
        <Breadcrumbs items={[{ name: 'Journal', path: '/blog' }, { name: post.title, path: `/blog/${post.slug}` }]} />
        <header className="mx-auto mt-10 max-w-3xl text-center">
          <p className="text-sm text-muted">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · {post.author}
          </p>
          <h1 className="mt-4 text-4xl font-bold sm:text-6xl">{post.title}</h1>
          <p className="mt-6 text-lg text-muted">{post.excerpt}</p>
        </header>
        <div className="relative mx-auto mt-12 aspect-[16/9] max-w-5xl overflow-hidden rounded-2xl">
          <Media media={post.coverImage} fill priority sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" />
        </div>
        <div className="mx-auto mt-12 max-w-3xl">
          <RichText data={post.content} className={`${PROSE} prose-lg`} />
          {services.length > 0 && (
            <aside className="card mt-12 p-6">
              <p className="eyebrow mb-3">Related services</p>
              <ul className="flex flex-wrap gap-3">
                {services.map((s) => (
                  <li key={s.id}>
                    <Link href={`/services/${s.slug}`} className="btn-ghost !py-2">
                      {s.title} →
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </article>
      <Faq faqs={post.faqs} />
      {more.length > 0 && (
        <section className="container-x py-16">
          <h2 className="mb-8 text-3xl font-bold">Keep reading</h2>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
      <InquirySection defaultService={services[0]?.title} />
      <JsonLd data={articleSchema(post, settings)} />
    </>
  )
}
