import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Stars, TestimonialCard } from '@/components/Cards'
import { InquirySection } from '@/components/InquirySection'
import { aggregateRating, getSettings, getTestimonials } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return buildMetadata({
    title: 'Client Reviews',
    description: `What couples and brands say about working with ${settings.businessName}.`,
    path: '/reviews',
  })
}

export default async function ReviewsPage() {
  const [settings, testimonials] = await Promise.all([getSettings(), getTestimonials()])
  const rating =
    settings.googleRating?.value && settings.googleRating.count
      ? { value: settings.googleRating.value, count: settings.googleRating.count }
      : aggregateRating(testimonials)
  return (
    <>
      <section className="container-x pt-12 pb-20">
        <Breadcrumbs items={[{ name: 'Reviews', path: '/reviews' }]} />
        <div className="mt-10 flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="eyebrow mb-4">Reviews</p>
            <h1 className="text-4xl font-bold sm:text-5xl">Kind words</h1>
            {rating && (
              <p className="mt-4 flex items-center gap-3 text-lg">
                <Stars rating={rating.value} />
                <span>
                  {rating.value} from {rating.count} reviews
                </span>
              </p>
            )}
          </div>
          {settings.googleReviewUrl && (
            <a href={settings.googleReviewUrl} target="_blank" rel="noopener" className="btn-primary">
              Leave us a Google review
            </a>
          )}
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </section>
      <InquirySection />
    </>
  )
}
