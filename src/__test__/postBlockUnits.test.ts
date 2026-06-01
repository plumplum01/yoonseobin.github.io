import { describe, expect, it } from 'vitest'
import { aspectRatioClassName } from '../components/blocks/post/MediaFrame'
import { toCarouselSlide } from '../features/post-block-renderer/helpers/carouselSlides'

describe('post block unit helpers', () => {
  it('maps image media into a carousel slide with alt fallback', () => {
    expect(
      toCarouselSlide({
        id: 'media-1',
        title: 'Image title',
        type: 'image',
        url: 'https://cdn.sanity.io/image.webp',
        caption: 'Image caption',
        tags: [],
      }),
    ).toEqual({
      id: 'media-1',
      kind: 'image',
      src: 'https://cdn.sanity.io/image.webp',
      alt: 'Image caption',
      caption: 'Image caption',
    })
  })

  it('maps video media into a carousel slide', () => {
    expect(
      toCarouselSlide({
        id: 'media-2',
        title: 'Demo video',
        type: 'video',
        url: 'https://cdn.sanity.io/video.mp4',
        tags: [],
      }),
    ).toEqual({
      id: 'media-2',
      kind: 'video',
      src: 'https://cdn.sanity.io/video.mp4',
      title: 'Demo video',
    })
  })

  it('keeps media aspect ratio classes in one mapping', () => {
    expect(aspectRatioClassName).toEqual({
      portrait: 'aspect-[4/5]',
      square: 'aspect-square',
      video: 'aspect-video',
      wide: 'aspect-[21/9]',
    })
  })

})
