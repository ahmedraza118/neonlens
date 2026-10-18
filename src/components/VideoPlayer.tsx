'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useState } from 'react'

// Mux Player is ~200 kB, so it is only downloaded when a visitor actually presses play.
const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), { ssr: false })

type Props = {
  provider: 'mux' | 'youtube' | 'none' | null | undefined
  muxPlaybackId?: string | null
  youtubeId?: string | null
  title: string
  posterUrl?: string
}

/** Click-to-load video facade: shows a poster image first, keeping the page fast. */
export function VideoPlayer({ provider, muxPlaybackId, youtubeId, title, posterUrl }: Props) {
  const [active, setActive] = useState(false)
  if (provider === 'mux' && !muxPlaybackId) return null
  if (provider === 'youtube' && !youtubeId) return null
  if (provider !== 'mux' && provider !== 'youtube') return null

  const poster =
    posterUrl ??
    (provider === 'mux'
      ? `https://image.mux.com/${muxPlaybackId}/thumbnail.webp?width=1600`
      : `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`)

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-line bg-black">
      {active ? (
        provider === 'mux' ? (
          <MuxPlayer
            playbackId={muxPlaybackId!}
            streamType="on-demand"
            autoPlay
            accentColor="#0f766e"
            metadata={{ video_title: title }}
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        )
      ) : (
        <button type="button" onClick={() => setActive(true)} className="group absolute inset-0" aria-label={`Play video: ${title}`}>
          <Image src={poster} alt="" fill sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover opacity-80 transition group-hover:opacity-100" unoptimized />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-accent text-3xl text-white transition group-hover:scale-110">
              ▶
            </span>
          </span>
        </button>
      )}
    </div>
  )
}
