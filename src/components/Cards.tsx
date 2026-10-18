import Link from 'next/link'

import { populated } from '@/lib/populated'
import { formatDate, formatMoney } from '@/lib/utils'
import type { Location, Post, Project, Service, Testimonial } from '@/payload-types'

import { Media } from './Media'

export function ProjectCard({ project, priority }: { project: Project; priority?: boolean }) {
  const service = populated<Service>(project.service)
  const location = populated<Location>(project.location)
  return (
    <Link href={`/portfolio/${project.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-2">
        <Media
          media={project.coverImage}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <p className="mt-4 text-sm text-muted">{[service?.title, location?.name].filter(Boolean).join(' · ')}</p>
      <h3 className="mt-1 text-lg font-semibold group-hover:text-accent">{project.title}</h3>
    </Link>
  )
}

export function ServiceCard({ service, currency }: { service: Service; currency: string }) {
  return (
    <Link href={`/services/${service.slug}`} className="group card relative flex flex-col overflow-hidden transition hover:shadow-lg hover:shadow-black/5">
      <div className="relative aspect-[3/2] overflow-hidden">
        <Media media={service.heroImage} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold">{service.title}</h3>
        <p className="mt-2 flex-1 text-sm text-muted">{service.excerpt}</p>
        <p className="mt-5 text-sm">
          <span className="text-muted">from </span>
          <span className="font-semibold text-fg">{formatMoney(service.startingPrice, currency)}</span>
          <span aria-hidden className="float-right text-accent transition group-hover:translate-x-1">→</span>
        </p>
      </div>
    </Link>
  )
}

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-amber-500" role="img" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(Math.round(rating))}
      <span className="text-line">{'★'.repeat(5 - Math.round(rating))}</span>
    </span>
  )
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="card flex h-full flex-col p-7">
      <Stars rating={testimonial.rating} />
      <blockquote className="mt-4 flex-1 text-fg/90">“{testimonial.quote}”</blockquote>
      <figcaption className="mt-6 text-sm">
        <span className="font-semibold">{testimonial.name}</span>
        {testimonial.role && <span className="text-muted"> — {testimonial.role}</span>}
      </figcaption>
    </figure>
  )
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-surface">
        <Media media={post.coverImage} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
      </div>
      <p className="mt-4 text-xs text-muted">
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      </p>
      <h3 className="mt-1 text-lg font-semibold group-hover:text-accent">{post.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
    </Link>
  )
}
