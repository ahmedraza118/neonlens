import Image, { type ImageProps } from 'next/image'

import type { Media as MediaDoc } from '@/payload-types'

type Props = Omit<ImageProps, 'src' | 'alt' | 'width' | 'height' | 'placeholder' | 'blurDataURL'> & {
  media: MediaDoc | number | null | undefined
  alt?: string
}

/**
 * next/image for CMS uploads: responsive srcset, AVIF/WebP, lazy-loading and a blur-up
 * placeholder generated at upload time. Pass `fill` + `sizes` for fluid layouts, or `priority`
 * for the LCP image above the fold.
 */
export function Media({ media, alt, fill, sizes, ...rest }: Props) {
  if (!media || typeof media !== 'object' || !media.url) return null
  const common = {
    src: media.url,
    alt: alt ?? media.alt,
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
