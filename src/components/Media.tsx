import Image, { type ImageProps } from 'next/image'

import type { Media as MediaDoc } from '@/payload-types'

type Props = Omit<ImageProps, 'src' | 'alt' | 'width' | 'height' | 'placeholder' | 'blurDataURL'> & {
  media: MediaDoc | number | null | undefined
  alt?: string
}

export const isVideo = (media: MediaDoc | null | undefined) => Boolean(media?.mimeType?.startsWith('video/'))

/**
 * Renders a CMS upload at full quality.
 *
 * Images: next/image builds a responsive srcset (up to 4K) in AVIF/WebP from the untouched
 * original, with lazy-loading and a blur-up placeholder. Pass `fill` + `sizes` for fluid layouts,
 * `priority` for the LCP image above the fold, and `quality` (75 default, 90 for heroes).
 *
 * Videos: a muted, looping, inline <video> (for showreels/backgrounds), using the poster image.
 * For films with sound, use <VideoPlayer> instead.
 */
export function Media({ media, alt, fill, sizes, quality, ...rest }: Props) {
  if (!media || typeof media !== 'object' || !media.url) return null

  if (isVideo(media)) {
    const poster = typeof media.poster === 'object' ? media.poster?.url : undefined
    return (
      <video
        src={media.url}
        poster={poster ?? undefined}
        aria-label={alt ?? media.alt}
        className={rest.className}
        style={{ ...(fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%' } : {}), objectFit: 'cover' }}
        autoPlay
        muted
        loop
        playsInline
        preload={rest.priority ? 'auto' : 'metadata'}
      />
    )
  }

  const common = {
    src: media.url,
    alt: alt ?? media.alt,
    quality: quality ?? 85,
    placeholder: media.blurDataURL ? ('blur' as const) : ('empty' as const),
    blurDataURL: media.blurDataURL ?? undefined,
    sizes: sizes ?? (fill ? '100vw' : undefined),
    style: media.focalX != null && media.focalY != null ? { objectPosition: `${media.focalX}% ${media.focalY}%` } : undefined,
    ...rest,
  }
  const altText = alt ?? media.alt
  if (fill) return <Image {...common} alt={altText} fill />
  return <Image {...common} alt={altText} width={media.width ?? 1600} height={media.height ?? 1067} />
}
