import type { Location, Media, Post, Project, Service, SiteSetting, Testimonial } from '@/payload-types'

import { absoluteUrl } from './utils'

/**
 * Schema.org structured data. Google uses it for rich results (stars, FAQs, breadcrumbs,
 * video thumbnails) and to understand that this is a local business serving specific cities.
 */

type Json = Record<string, unknown>
const ORG_ID = absoluteUrl('/#business')

function imageUrl(media: Media | number | null | undefined): string | undefined {
  if (!media || typeof media !== 'object' || !media.url) return undefined
  return absoluteUrl(media.url)
}

export function imageObject(media: Media | number | null | undefined, extra: Json = {}): Json | undefined {
  if (!media || typeof media !== 'object' || !media.url) return undefined
  return {
    '@type': 'ImageObject',
    contentUrl: absoluteUrl(media.url),
    url: absoluteUrl(media.url),
    width: media.width ?? undefined,
    height: media.height ?? undefined,
    caption: media.caption || media.alt,
    description: media.alt,
    creator: { '@id': ORG_ID },
    copyrightNotice: '© NeonLens Studio',
    creditText: 'NeonLens Studio',
    acquireLicensePage: absoluteUrl('/contact'),
    ...extra,
  }
}

export function localBusiness(
  settings: SiteSetting,
  opts: { locations?: Location[]; services?: Service[]; rating?: { value: number; count: number } | null } = {},
): Json {
  const social = Object.values(settings.social ?? {}).filter((v): v is string => typeof v === 'string' && v.length > 0)
  if (settings.googleBusinessProfileUrl) social.push(settings.googleBusinessProfileUrl)

  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': ORG_ID,
    name: settings.businessName,
    description: settings.description,
    url: absoluteUrl('/'),
    email: settings.email,
    telephone: settings.phone,
    priceRange: settings.priceRange ?? undefined,
    image: imageUrl(settings.defaultOgImage),
    logo: imageUrl(settings.logo),
    foundingDate: settings.foundingYear ? String(settings.foundingYear) : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address?.street ?? undefined,
      addressLocality: settings.address?.city,
      addressRegion: settings.address?.region ?? undefined,
      postalCode: settings.address?.postalCode ?? undefined,
      addressCountry: settings.address?.country,
    },
    geo:
      settings.geo?.lat && settings.geo?.lng
        ? { '@type': 'GeoCoordinates', latitude: settings.geo.lat, longitude: settings.geo.lng }
        : undefined,
    areaServed: opts.locations?.map((l) => ({ '@type': 'City', name: l.name })),
    openingHoursSpecification: settings.openingHours?.map((o) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: o.days ?? [],
      opens: o.opens,
      closes: o.closes,
    })),
    sameAs: social.length ? social : undefined,
    aggregateRating: opts.rating
      ? { '@type': 'AggregateRating', ratingValue: opts.rating.value, reviewCount: opts.rating.count, bestRating: 5 }
      : undefined,
    hasOfferCatalog: opts.services?.length
      ? {
          '@type': 'OfferCatalog',
          name: 'Photography & videography services',
          itemListElement: opts.services.map((s) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: s.title, url: absoluteUrl(`/services/${s.slug}`) },
            priceSpecification: { '@type': 'PriceSpecification', minPrice: s.startingPrice, priceCurrency: settings.currency },
          })),
        }
      : undefined,
  }
}

export function website(settings: SiteSetting): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    url: absoluteUrl('/'),
    name: settings.businessName,
    publisher: { '@id': ORG_ID },
  }
}

export function serviceSchema(service: Service, settings: SiteSetting, location?: Location | null): Json {
  const path = location ? `/services/${service.slug}/${location.slug}` : `/services/${service.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': absoluteUrl(`${path}#service`),
    name: location ? `${service.title} in ${location.name}` : service.title,
    serviceType: service.title,
    description: service.excerpt,
    url: absoluteUrl(path),
    image: imageUrl(service.heroImage),
    provider: { '@id': ORG_ID },
    areaServed: location ? { '@type': 'City', name: location.name } : undefined,
    offers: (service.packages ?? []).map((p) => ({
      '@type': 'Offer',
      name: p.name,
      price: p.price,
      priceCurrency: settings.currency,
      description: p.description ?? undefined,
      url: absoluteUrl(`/book?service=${service.slug}`),
    })),
  }
}

export function faqSchema(faqs: Array<{ question: string; answer: string }> | null | undefined): Json | null {
  if (!faqs || faqs.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function reviewSchema(t: Testimonial): Json {
  return {
    '@type': 'Review',
    author: { '@type': 'Person', name: t.name },
    datePublished: t.date?.slice(0, 10),
    reviewBody: t.quote,
    reviewRating: { '@type': 'Rating', ratingValue: t.rating, bestRating: 5 },
    itemReviewed: { '@id': ORG_ID },
  }
}

export function videoSchema(
  video: Project['video'] | Service['video'],
  fallback: { name: string; description: string; thumbnail?: Media | number | null; uploadDate?: string },
): Json | null {
  if (!video || video.provider === 'none') return null
  const thumb =
    video.provider === 'mux' && video.muxPlaybackId
      ? `https://image.mux.com/${video.muxPlaybackId}/thumbnail.jpg?width=1280`
      : video.provider === 'youtube' && video.youtubeId
        ? `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`
        : imageUrl(fallback.thumbnail)
  const contentUrl =
    video.provider === 'mux' && video.muxPlaybackId ? `https://stream.mux.com/${video.muxPlaybackId}.m3u8` : undefined
  const embedUrl =
    video.provider === 'youtube' && video.youtubeId ? `https://www.youtube.com/embed/${video.youtubeId}` : undefined
  if (!contentUrl && !embedUrl) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title || fallback.name,
    description: video.description || fallback.description,
    thumbnailUrl: thumb ? [thumb] : undefined,
    uploadDate: fallback.uploadDate,
    duration: video.durationSeconds ? `PT${Math.round(video.durationSeconds)}S` : undefined,
    contentUrl,
    embedUrl,
  }
}

export function projectSchema(project: Project): Json {
  const gallery = (project.gallery ?? []).map((m) => imageObject(m)).filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': absoluteUrl(`/portfolio/${project.slug}#work`),
    name: project.title,
    headline: project.title,
    abstract: project.excerpt,
    dateCreated: project.date?.slice(0, 10),
    url: absoluteUrl(`/portfolio/${project.slug}`),
    creator: { '@id': ORG_ID },
    image: [imageObject(project.coverImage), ...gallery].filter(Boolean),
    locationCreated: project.location && typeof project.location === 'object' ? { '@type': 'Place', name: project.venue || project.location.name } : undefined,
    review: project.testimonial && typeof project.testimonial === 'object' ? reviewSchema(project.testimonial) : undefined,
  }
}

export function articleSchema(post: Post, settings: SiteSetting): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: imageUrl(post.coverImage),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Organization', name: post.author || settings.businessName },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  }
}
