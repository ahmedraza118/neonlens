'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useState } from 'react'

import { useI18n } from '@/i18n/client'
import { fmt } from '@/i18n/config'
import type { Media as MediaDoc } from '@/payload-types'

// Mux Player is ~200 kB, so it is only downloaded when a visitor actually presses play.
const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), { ssr: false })

type Props = {
  provider: 'mux' | 'youtube' | 'upload' | 'none' | null | undefined
  muxPlaybackId?: string | null
  youtubeId?: string | null
  /** Video file uploaded to the media library (provider "upload"). */
  file?: MediaDoc | number | null
  title: string
  posterUrl?: string
}

const asDoc = (m: MediaDoc | number | null | undefined) => (m && typeof m === 'object' ? m : null)

/** Click-to-load video facade: shows a poster image first, keeping the page fast. */
export function VideoPlayer({ provider, muxPlaybackId, youtubeId, file, title, posterUrl }: Props) {
  const [active, setActive] = useState(false)
  const { t } = useI18n()
  const upload = asDoc(file)
  if (provider === 'mux' && !muxPlaybackId) return null
  if (provider === 'youtube' && !youtubeId) return null
  if (provider === 'upload' && !upload?.url) return null
  if (provider !== 'mux' && provider !== 'youtube' && provider !== 'upload') return null

  const poster =
    posterUrl ??
    (provider === 'mux'
      ? `https://image.mux.com/${muxPlaybackId}/thumbnail.webp?width=1920`
      : provider === 'youtube'
        ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` // maxresdefault does not exist for every video
        : (asDoc(upload?.poster)?.url ?? undefined))

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-line bg-black">
      {active ? (
        provider === 'mux' ? (
          <MuxPlayer
            playbackId={muxPlaybackId!}
            streamType="on-demand"
            autoPlay
            accentColor="#0f766e"
            // Start at the highest rendition the connection allows instead of ramping up from low.
            minResolution="720p"
            maxResolution="2160p"
            metadata={{ video_title: title }}
            style={{ width: '100%', height: '100%' }}
          />
        ) : provider === 'youtube' ? (
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&vq=hd1080`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <video className="h-full w-full bg-black object-contain" src={upload!.url!} poster={poster} controls autoPlay playsInline preload="auto" />
        )
      ) : (
        <button type="button" onClick={() => setActive(true)} className="group absolute inset-0" aria-label={fmt(t.common.playVideo, { title })}>
          {poster ? (
            <Image src={poster} alt="" fill sizes="(min-width: 1024px) 1152px, 100vw" quality={90} className="object-cover opacity-80 transition group-hover:opacity-100" unoptimized={provider !== 'upload'} />
          ) : (
            // No poster uploaded: the browser shows the first frame.
            <video className="absolute inset-0 h-full w-full object-cover opacity-80" src={`${upload!.url}#t=0.1`} preload="metadata" muted playsInline />
          )}
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
