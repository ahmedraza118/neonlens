import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ProjectCard, Stars } from '@/components/Cards'
import { InquirySection } from '@/components/InquirySection'
import { JsonLd } from '@/components/JsonLd'
import { Media } from '@/components/Media'
import { PageHero } from '@/components/PageHero'
import { Paragraphs } from '@/components/Paragraphs'
import { VideoPlayer } from '@/components/VideoPlayer'
import { projectSchema, videoSchema } from '@/lib/jsonld'
import { getProject, getProjects, populated } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { formatDate, PROSE } from '@/lib/utils'
import type { Location, Media as MediaDoc, Service, Testimonial } from '@/payload-types'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return {}
  const service = populated<Service>(project.service)
  const location = populated<Location>(project.location)
  return buildMetadata({
    title: [project.title, service && location ? `${service.title} in ${location.name}` : service?.title].filter(Boolean).join(' — '),
    description: project.excerpt,
    path: `/portfolio/${project.slug}`,
    image: populated(project.coverImage),
    seo: project.seo,
    type: 'article',
    publishedTime: project.date,
  })
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()

  const service = populated<Service>(project.service)
  const location = populated<Location>(project.location)
  const testimonial = populated<Testimonial>(project.testimonial)
  const gallery = (project.gallery ?? []).map((m) => populated<MediaDoc>(m)).filter((m): m is MediaDoc => !!m)
  const related = service ? await getProjects({ serviceId: service.id, exclude: project.id, limit: 3 }) : []

  const facts: Array<[string, string | null | undefined]> = [
    ['Service', service?.title],
    ['Location', [project.venue, location?.name].filter(Boolean).join(', ')],
    ['Client', project.clientType],
    ['Date', formatDate(project.date)],
  ]

  return (
    <>
      <article>
        <PageHero
          crumbs={[{ name: 'Portfolio', path: '/portfolio' }, { name: project.title, path: `/portfolio/${project.slug}` }]}
          eyebrow={[service?.title, location?.name].filter(Boolean).join(' · ')}
          title={project.title}
          subtitle={project.excerpt}
          image={project.coverImage}
        />

        <section className="container-x grid gap-12 py-16 lg:grid-cols-[1fr_2fr]">
          <dl className="card h-fit divide-y divide-line">
            {facts
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 p-4 text-sm">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right font-medium">
                    {k === 'Service' && service ? <Link href={`/services/${service.slug}`} className="hover:text-accent">{v}</Link> : v}
                  </dd>
                </div>
              ))}
            {project.deliverables && project.deliverables.length > 0 && (
              <div className="p-4 text-sm">
                <dt className="mb-2 text-muted">Deliverables</dt>
                <dd>
                  <ul className="space-y-1">
                    {project.deliverables.map((d) => (
                      <li key={d}>✦ {d}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
          <div className="space-y-10">
            <section>
              <h2 className="eyebrow mb-3">The brief</h2>
              <Paragraphs text={project.brief} className="text-lg leading-relaxed text-fg/85" />
            </section>
            {project.approach && (
              <section>
                <h2 className="eyebrow mb-3">Our approach</h2>
                <RichText data={project.approach} className={PROSE} />
              </section>
            )}
            {project.result && (
              <section>
                <h2 className="eyebrow mb-3">The result</h2>
                <Paragraphs text={project.result} className="text-lg leading-relaxed text-fg/85" />
              </section>
            )}
          </div>
        </section>

        {project.video?.provider && project.video.provider !== 'none' && (
          <section className="container-x py-8">
            <VideoPlayer
              provider={project.video.provider}
              muxPlaybackId={project.video.muxPlaybackId}
              youtubeId={project.video.youtubeId}
              title={project.video.title || project.title}
            />
          </section>
        )}

        {gallery.length > 0 && (
          <section className="container-x py-12" aria-label="Gallery">
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
              {gallery.map((m) => (
                <figure key={m.id} className="mb-4 break-inside-avoid overflow-hidden rounded-xl">
                  <Media media={m} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="h-auto w-full" />
                  {m.caption && <figcaption className="mt-2 text-xs text-muted">{m.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </section>
        )}

        {testimonial && (
          <section className="container-x py-16">
            <figure className="card mx-auto max-w-3xl p-10 text-center">
              <Stars rating={testimonial.rating} />
              <blockquote className="mt-6 font-display text-2xl leading-snug sm:text-3xl">“{testimonial.quote}”</blockquote>
              <figcaption className="mt-6 text-muted">
                {testimonial.name}
                {testimonial.role && ` — ${testimonial.role}`}
              </figcaption>
            </figure>
          </section>
        )}
      </article>

      {related.length > 0 && (
        <section className="container-x py-16">
          <h2 className="mb-8 text-3xl font-bold">More {service?.title.toLowerCase()}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      <InquirySection heading="Want something like this?" defaultService={service?.title} defaultLocation={location?.name} />
      <JsonLd
        data={[
          projectSchema(project),
          videoSchema(project.video, { name: project.title, description: project.excerpt, thumbnail: project.coverImage, uploadDate: project.date }),
        ]}
      />
    </>
  )
}
