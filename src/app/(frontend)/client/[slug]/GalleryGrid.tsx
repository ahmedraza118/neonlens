'use client'

/* eslint-disable @next/next/no-img-element -- private images are served through Payload access control with the
   visitor's cookie, which the next/image optimizer cannot forward, so plain <img> is required here. */

import { useCallback, useEffect, useState, useTransition } from 'react'

import { submitSelection, toggleFavourite } from '@/actions/gallery'
import { cn } from '@/lib/utils'

type Photo = { id: number; thumb: string; preview: string; original: string; filename: string; width: number; height: number }
type Props = {
  slug: string
  photos: Photo[]
  initialFavourites: number[]
  canSelect: boolean
  allowDownloads: boolean
  selectionLimit: number | null
  initialNotes: string
}

export function GalleryGrid({ slug, photos, initialFavourites, canSelect, allowDownloads, selectionLimit, initialNotes }: Props) {
  const [favourites, setFavourites] = useState(initialFavourites)
  const [filter, setFilter] = useState<'all' | 'favourites'>('all')
  const [open, setOpen] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [notes, setNotes] = useState(initialNotes)
  const [submitted, setSubmitted] = useState(!canSelect)
  const [pending, startTransition] = useTransition()

  const visible = filter === 'favourites' ? photos.filter((p) => favourites.includes(p.id)) : photos
  const current = open !== null ? visible[open] : null

  const toggle = (id: number) => {
    if (submitted) return
    const optimistic = favourites.includes(id) ? favourites.filter((f) => f !== id) : [...favourites, id]
    setFavourites(optimistic)
    startTransition(async () => {
      const res = await toggleFavourite(slug, id)
      setError(res.error ?? '')
      setFavourites(res.favourites)
    })
  }

  const step = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + visible.length) % visible.length)), [visible.length])
  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, step])

  return (
    <div className="mt-10">
      <div className="sticky top-16 z-30 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-page/90 px-4 py-3 backdrop-blur">
        <div className="flex gap-2 text-sm">
          {(['all', 'favourites'] as const).map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} className={cn('rounded-full border px-4 py-1.5', filter === f ? 'border-accent bg-accent/10' : 'border-line text-muted')}>
              {f === 'all' ? `All (${photos.length})` : `♥ Favourites (${favourites.length}${selectionLimit ? `/${selectionLimit}` : ''})`}
            </button>
          ))}
        </div>
        {error && <p role="alert" className="text-sm text-accent">{error}</p>}
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-muted">{filter === 'favourites' ? 'No favourites yet — tap ♥ on the photos you love.' : 'Photos are on their way.'}</p>
      ) : (
        <ul className="mt-6 columns-2 gap-3 md:columns-3 lg:columns-4">
          {visible.map((p, i) => {
            const fav = favourites.includes(p.id)
            return (
              <li key={p.id} className="group relative mb-3 break-inside-avoid overflow-hidden rounded-lg bg-surface">
                <button type="button" onClick={() => setOpen(i)} className="block w-full" aria-label={`Open ${p.filename}`}>
                  <img src={p.thumb} alt={p.filename} width={p.width} height={p.height} loading="lazy" decoding="async" className="h-auto w-full" style={{ aspectRatio: `${p.width} / ${p.height}` }} />
                </button>
                {!submitted && (
                  <button
                    type="button"
                    onClick={() => toggle(p.id)}
                    aria-pressed={fav}
                    aria-label={fav ? 'Remove from favourites' : 'Add to favourites'}
                    className={cn('absolute top-2 right-2 grid h-9 w-9 place-items-center rounded-full text-lg backdrop-blur transition', fav ? 'bg-accent text-white' : 'bg-black/50 text-white/80 opacity-100 sm:opacity-0 sm:group-hover:opacity-100')}
                  >
                    ♥
                  </button>
                )}
                {submitted && fav && <span className="absolute top-2 right-2 rounded-full bg-accent px-2 text-xs">♥</span>}
              </li>
            )
          })}
        </ul>
      )}

      {!submitted && (
        <div className="card mt-12 p-6 sm:p-8">
          <h2 className="text-2xl font-bold">Ready? Submit your selection</h2>
          <p className="mt-2 text-sm text-muted">You have chosen {favourites.length} photo{favourites.length === 1 ? '' : 's'}. Add any notes for retouching or the album below.</p>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="input mt-4" placeholder="e.g. Please brighten #12, black & white version of #48…" />
          <button
            type="button"
            disabled={pending || favourites.length === 0}
            onClick={() =>
              startTransition(async () => {
                const res = await submitSelection(slug, notes)
                if (res.ok) setSubmitted(true)
                else setError(res.error ?? 'Something went wrong')
              })
            }
            className="btn-primary mt-4"
          >
            Submit {favourites.length} favourites
          </button>
        </div>
      )}

      {current && (
        <div role="dialog" aria-modal="true" aria-label={current.filename} className="fixed inset-0 z-50 flex flex-col bg-black/95">
          <div className="flex items-center justify-between p-4 text-sm">
            <span className="text-muted">
              {open! + 1} / {visible.length}
            </span>
            <div className="flex items-center gap-2">
              {!submitted && (
                <button type="button" onClick={() => toggle(current.id)} className={cn('rounded-full px-4 py-2', favourites.includes(current.id) ? 'bg-accent' : 'border border-line')}>
                  ♥ {favourites.includes(current.id) ? 'Favourited' : 'Favourite'}
                </button>
              )}
              {allowDownloads && (
                <a href={current.original} download={current.filename} className="rounded-full border border-line px-4 py-2">
                  Download
                </a>
              )}
              <button type="button" onClick={() => setOpen(null)} className="rounded-full border border-line px-4 py-2" aria-label="Close">
                ✕
              </button>
            </div>
          </div>
          <div className="relative flex flex-1 items-center justify-center p-4">
            <button type="button" onClick={() => step(-1)} className="absolute left-2 z-10 h-12 w-12 rounded-full bg-white/10 text-2xl" aria-label="Previous">‹</button>
            <img src={current.preview} alt={current.filename} className="max-h-full max-w-full object-contain" />
            <button type="button" onClick={() => step(1)} className="absolute right-2 z-10 h-12 w-12 rounded-full bg-white/10 text-2xl" aria-label="Next">›</button>
          </div>
        </div>
      )}
    </div>
  )
}
