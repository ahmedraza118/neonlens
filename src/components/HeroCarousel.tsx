'use client'

import Link from 'next/link'
import { type CSSProperties, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { useI18n } from '@/i18n/client'
import { fmt } from '@/i18n/config'
import { cn } from '@/lib/utils'
import type { Media as MediaDoc } from '@/payload-types'

import { HeroVideo } from './HeroVideo'
import { Media } from './Media'

export type HeroSlide = {
  id: string
  eyebrow: string
  title: string
  text?: string | null
  price?: string | null
  href: string
  ctaLabel: string
  image: MediaDoc | null
  video: MediaDoc | null
  muxPlaybackId?: string | null
}

type Props = {
  /** The page H1 (keyword heading), shown as the small line above every slide. */
  heading: string
  slides: HeroSlide[]
  intervalSeconds: number
}

const FADE_MS = 1000

// Autoplay stays off until the browser confirms motion is OK (and always for reduced motion).
const subscribeMotion = (cb: () => void) => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const subscribeVisibility = (cb: () => void) => {
  document.addEventListener('visibilitychange', cb)
  return () => document.removeEventListener('visibilitychange', cb)
}

/**
 * Home hero: a rounded photo card with the text bottom-left, cycling through the services.
 * Slides crossfade with a gentle zoom and advance automatically (timed by the active progress
 * bar's CSS animation, so pausing resumes exactly where it stopped). Pauses on hover/focus, in
 * background tabs and with the pause button; never autoplays for reduced-motion visitors.
 * Swipe (touch) and arrow keys also navigate.
 */
export function HeroCarousel({ heading, slides, intervalSeconds }: Props) {
  const { t } = useI18n()
  const [index, setIndex] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [hovering, setHovering] = useState(false)
  const reducedMotion = useSyncExternalStore(subscribeMotion, prefersReducedMotion, () => true)
  const hidden = useSyncExternalStore(subscribeVisibility, () => document.hidden, () => false)
  const playing = slides.length > 1 && !reducedMotion && !userPaused && !hovering && !hidden
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const count = slides.length

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count])

  // Only download slides that have been shown, plus the next one: the stacked, invisible slides
  // would otherwise all load at once and compete with the first (LCP) image.
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0, 1]))
  if (!seen.has(index) || !seen.has((index + 1) % Math.max(count, 1))) {
    setSeen(new Set([...seen, index, (index + 1) % Math.max(count, 1)]))
  }

  // Play the active slide's background video, pause the others (saves battery and data).
  const videos = useRef<Array<HTMLVideoElement | null>>([])
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return
      if (i === index && !reducedMotion) v.play().catch(() => undefined)
      else v.pause()
    })
  }, [index, reducedMotion])

  if (count === 0) return null
  const current = slides[index]

  return (
    <div
      aria-roledescription="carousel"
      aria-label={t.hero.carousel}
      className="relative isolate flex min-h-[78svh] items-end overflow-hidden rounded-2xl bg-neutral-900 text-white sm:min-h-[70svh] sm:rounded-3xl [@media(max-height:500px)]:min-h-0"
      style={{ '--hero-interval': `${intervalSeconds}s` } as CSSProperties}
      // Pause while the pointer or keyboard focus is anywhere in the hero, so a focused button never
      // disappears under the visitor (the slide it belongs to would become inert).
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHovering(false)
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(index + 1)
        if (e.key === 'ArrowLeft') go(index - 1)
      }}
      onTouchStart={(e) => (touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
      onTouchEnd={(e) => {
        const start = touchStart.current
        touchStart.current = null
        if (!start) return
        const dx = e.changedTouches[0].clientX - start.x
        const dy = e.changedTouches[0].clientY - start.y
        // Horizontal swipes only, so vertical page scrolling is never hijacked.
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(index + (dx < 0 ? 1 : -1))
      }}
    >
      {/* Backgrounds */}
      {slides.map((slide, i) => {
        const active = i === index
        return (
          <div
            key={slide.id}
            aria-hidden
            className="absolute inset-0 -z-20"
            style={{ opacity: active ? 1 : 0, transition: `opacity ${FADE_MS}ms ease-in-out` }}
          >
            <div
              className="absolute inset-0"
              style={{
                transform: active ? 'scale(1)' : 'scale(1.06)',
                // Slow zoom-out while active; reset only after the fade-out has finished.
                transition: active ? `transform ${intervalSeconds + 1.5}s ease-out` : `transform 0s linear ${FADE_MS}ms`,
              }}
            >
              {slide.image && seen.has(i) && (
                <Media
                  media={slide.image}
                  fill
                  priority={i === 0}
                  quality={i === 0 ? 90 : 85}
                  sizes="(min-width: 1152px) 1152px, 100vw"
                  className="object-cover"
                />
              )}
              {slide.video?.url && (
                <video
                  ref={(el) => {
                    videos.current[i] = el
                  }}
                  className="absolute inset-0 h-full w-full object-cover"
                  src={slide.video.url}
                  poster={typeof slide.video.poster === 'object' && slide.video.poster?.url ? slide.video.poster.url : undefined}
                  muted
                  loop
                  playsInline
                  preload={i === 0 ? 'auto' : 'none'}
                />
              )}
              {slide.muxPlaybackId && active && !reducedMotion && <HeroVideo playbackId={slide.muxPlaybackId} />}
            </div>
          </div>
        )
      })}

      {/* Dark gradient keeps white text readable on any photo */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/35 to-black/5" />

      <div className="w-full p-5 pb-10 sm:p-12 sm:pb-16 [@media(max-height:500px)]:p-6 [@media(max-height:500px)]:pb-12">
        {/* From lg the slide controls sit top-right: the heading must stop before them. */}
        <h1 className="mb-4 max-w-2xl text-sm font-semibold text-white/85 lg:max-w-[calc(100%-22rem)]">{heading}</h1>

        {/* All slide texts share one grid cell (no layout jump); only the active one is visible. */}
        <div className="grid">
          {slides.map((slide, i) => {
            const active = i === index
            const enter = (delay: number): CSSProperties => ({
              opacity: active ? 1 : 0,
              transform: active ? 'none' : 'translateY(12px)',
              transition: `opacity 600ms ease ${active ? delay : 0}ms, transform 700ms cubic-bezier(.2,.7,.2,1) ${active ? delay : 0}ms`,
            })
            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={fmt(t.hero.slideOf, { n: i + 1, total: count })}
                aria-hidden={!active}
                inert={!active}
                className={cn('[grid-area:1/1]', !active && 'pointer-events-none')}
              >
                <p style={enter(100)} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md sm:text-sm">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-teal-300" />
                  {slide.eyebrow}
                </p>
                <p style={enter(180)} className="mt-4 max-w-3xl font-display text-[clamp(1.75rem,1.2rem+3.4vw,3.75rem)] leading-[1.1] font-bold tracking-tight text-balance [@media(max-height:500px)]:text-3xl">
                  {slide.title}
                </p>
                {slide.text && (
                  <p style={enter(260)} className="mt-4 line-clamp-2 max-w-2xl text-base text-white/85 sm:mt-5 sm:line-clamp-none sm:text-lg [@media(max-height:500px)]:hidden">
                    {slide.text}
                  </p>
                )}
                <div style={enter(340)} className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
                  <Link href="#inquire" className="btn-primary w-full sm:w-auto">
                    {t.common.checkDate}
                  </Link>
                  <Link href={slide.href} className="btn w-full border border-white/60 text-white hover:bg-white/10 sm:w-auto">
                    {slide.ctaLabel}
                  </Link>
                  {slide.price && <span className="text-center text-sm text-white/75 sm:ml-2 sm:text-left">{slide.price}</span>}
                </div>
              </div>
            )
          })}
        </div>

        {count > 1 && (
          <div
            className="mt-6 flex items-center justify-between gap-2 sm:gap-3 lg:absolute lg:top-8 lg:right-8 lg:mt-0 lg:justify-end"
          >
            {/* One short progress bar per service; the active one fills up. */}
            <ol aria-label={t.hero.services} className="flex min-w-0 items-center gap-0.5 rounded-full bg-black/30 px-2 py-2.5 backdrop-blur-md sm:gap-1.5 sm:px-3">
              {slides.map((slide, i) => {
                const active = i === index
                return (
                  <li key={slide.id}>
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-current={active ? 'true' : undefined}
                      aria-label={`${fmt(t.hero.slideOf, { n: i + 1, total: count })}: ${slide.eyebrow}`}
                      className="group -my-2 block px-1 py-3.5 sm:px-1"
                    >
                      <span className={cn('relative block h-1 overflow-hidden rounded-full bg-white/35 transition-all duration-500', active ? 'w-7 sm:w-12' : 'w-3 group-hover:bg-white/60 sm:w-4')}>
                        {active && (
                          <span
                            key={index}
                            onAnimationEnd={() => playing && go(index + 1)}
                            className="hero-progress absolute inset-y-0 left-0 rounded-full bg-white"
                            style={{ animationPlayState: playing ? 'running' : 'paused', width: reducedMotion ? '100%' : undefined }}
                          />
                        )}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
            <div className="flex shrink-0 items-center gap-0.5 rounded-full bg-black/30 p-1 backdrop-blur-md sm:gap-1.5">
              <button type="button" onClick={() => go(index - 1)} aria-label={t.hero.prev} className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/15">
                <span aria-hidden>←</span>
              </button>
              {!reducedMotion && (
                <button
                  type="button"
                  onClick={() => setUserPaused((p) => !p)}
                  aria-label={userPaused ? t.hero.play : t.hero.pause}
                  aria-pressed={userPaused}
                  className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/15"
                >
                  <span aria-hidden className="text-[10px]">{userPaused ? '▶' : '❚❚'}</span>
                </button>
              )}
              <button type="button" onClick={() => go(index + 1)} aria-label={t.hero.next} className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/15">
                <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        )}
        {/* Announces manual slide changes; silent while autoplaying. */}
        <p className="sr-only" aria-live={playing ? 'off' : 'polite'}>
          {current.eyebrow}
        </p>
      </div>
    </div>
  )
}
