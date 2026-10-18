'use client'

import dynamic from 'next/dynamic'
import { useSyncExternalStore } from 'react'

const MuxVideo = dynamic(() => import('@mux/mux-player-react').then((m) => m.default), { ssr: false })

/**
 * Muted looping showreel behind the hero. The poster image renders first (fast LCP); the
 * video only loads on larger screens, without data-saver, and when motion is allowed.
 */
const noopSubscribe = () => () => {}

function canPlayBackgroundVideo(): boolean {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const wide = window.matchMedia('(min-width: 768px)').matches
  return !reduce && wide && !conn?.saveData
}

export function HeroVideo({ playbackId }: { playbackId: string }) {
  const enabled = useSyncExternalStore(noopSubscribe, canPlayBackgroundVideo, () => false)
  if (!enabled) return null
  return (
    <MuxVideo
      playbackId={playbackId}
      streamType="on-demand"
      autoPlay="muted"
      loop
      muted
      nohotkeys
      className="absolute inset-0 h-full w-full [--controls:none] [--media-object-fit:cover]"
      style={{ ['--controls' as string]: 'none', ['--media-object-fit' as string]: 'cover', aspectRatio: 'auto' }}
    />
  )
}
