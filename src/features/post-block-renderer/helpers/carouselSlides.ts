import type { MediaAsset } from '@portfolio/types'

export type CarouselSlideModel =
  | {
      id: string
      kind: 'image'
      src: string
      alt: string
      caption?: string
    }
  | {
      id: string
      kind: 'video'
      src: string
      title: string
      caption?: string
    }

export function toCarouselSlide(media: MediaAsset): CarouselSlideModel {
  if (media.type === 'video') {
    return {
      id: media.id,
      kind: 'video',
      src: media.url,
      title: media.title,
      ...(media.caption ? { caption: media.caption } : {}),
    }
  }

  return {
    id: media.id,
    kind: 'image',
    src: media.url,
    alt: media.alt ?? media.caption ?? media.title,
    ...(media.caption ? { caption: media.caption } : {}),
  }
}
