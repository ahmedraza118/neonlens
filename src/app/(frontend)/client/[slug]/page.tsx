import type { Metadata } from 'next'

import { lockGalleries } from '@/actions/gallery'
import { VideoPlayer } from '@/components/VideoPlayer'
import { findGalleryBySlug, getUnlockedGallery, isExpired } from '@/lib/galleries'
import { getPayloadClient } from '@/lib/payload'
import { formatDate } from '@/lib/utils'

import { UnlockForm } from '../UnlockForm'
import { GalleryGrid } from './GalleryGrid'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Client Gallery', robots: { index: false, follow: false } }

const STATUS: Record<string, string> = {
  editing: 'We are still editing — check back soon.',
  proofing: 'Tap ♥ on your favourites, then submit your selection.',
  submitted: 'Selection received — we are working on your final edits.',
  delivered: 'Your final photos are ready. Enjoy!',
}

export default async function ClientGalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const gallery = await getUnlockedGallery(slug)

  if (!gallery || isExpired(gallery)) {
    const exists = await findGalleryBySlug(slug)
    return (
      <section className="container-x py-24 text-center">
        <h1 className="text-4xl font-bold">{exists ? exists.title : 'Private gallery'}</h1>
        <p className="mt-3 text-muted">{gallery && isExpired(gallery) ? 'This gallery has expired — contact us to reopen it.' : 'Enter your password to continue.'}</p>
        {!gallery && <UnlockForm slug={slug} />}
      </section>
    )
  }

  const payload = await getPayloadClient()
  const photos = await payload.find({
    collection: 'client-media',
    where: { gallery: { equals: gallery.id } },
    limit: 2000,
    sort: 'filename',
    depth: 0,
  })
  const favourites = ((gallery.favourites ?? []) as Array<number | { id: number }>).map((f) => (typeof f === 'object' ? f.id : f))

  return (
    <section className="container-x py-12">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="eyebrow">Client gallery · {gallery.clientName}</p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{gallery.title}</h1>
          {gallery.eventDate && <p className="mt-2 text-muted">{formatDate(gallery.eventDate)}</p>}
          <p className="mt-4 rounded-xl border border-line bg-surface px-4 py-3 text-sm">{STATUS[gallery.status ?? 'proofing']}</p>
          {gallery.message && <p className="mt-4 max-w-2xl whitespace-pre-line text-fg/85">{gallery.message}</p>}
        </div>
        <form action={lockGalleries}>
          <button type="submit" className="btn-ghost !py-2 text-xs">Log out</button>
        </form>
      </div>

      {gallery.videoPlaybackId && (
        <div className="mt-10">
          <VideoPlayer provider="mux" muxPlaybackId={gallery.videoPlaybackId} title={gallery.title} />
        </div>
      )}

      <GalleryGrid
        slug={gallery.slug!}
        photos={photos.docs.map((p) => ({
          id: p.id,
          thumb: p.sizes?.thumb?.url ?? p.url!,
          preview: p.sizes?.preview?.url ?? p.url!,
          original: p.url!,
          filename: p.filename ?? `photo-${p.id}.jpg`,
          width: p.width ?? 3,
          height: p.height ?? 2,
        }))}
        initialFavourites={favourites}
        canSelect={gallery.status === 'proofing'}
        allowDownloads={Boolean(gallery.allowDownloads)}
        selectionLimit={gallery.selectionLimit ?? null}
        initialNotes={gallery.clientNotes ?? ''}
      />
    </section>
  )
}
