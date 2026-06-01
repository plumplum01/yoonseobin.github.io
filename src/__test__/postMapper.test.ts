import { mapMediaAsset, mapPost } from '../registry/mappers/postMapper'

const imageMedia = {
  id: 'media-1',
  title: 'Hero image',
  type: 'image',
  alt: 'A hero image',
  caption: 'A hero image',
  tags: [{ id: 'tag-1', title: 'Product', slug: 'product' }],
  imageUrl: 'https://cdn.sanity.io/image.webp',
}

const videoMedia = {
  id: 'media-2',
  title: 'Demo video',
  type: 'video',
  caption: 'A demo video',
  durationSeconds: 12,
  videoUrl: 'https://cdn.sanity.io/video.mp4',
}

const postPayload = {
  id: 'post-1',
  type: 'blog',
  slug: 'hello',
  title: 'Hello',
  status: 'published',
  blocks: [
    { _type: 'headingBlock', level: 2, text: 'Intro' },
    { _type: 'imageBlock', media: imageMedia },
    { _type: 'carouselBlock', mediaItems: [imageMedia] },
    { _type: 'videoBlock', media: videoMedia },
  ],
}

describe('mapMediaAsset', () => {
  it('caption을 alt로 받은 image media를 앱 MediaAsset으로 변환한다', () => {
    expect(mapMediaAsset(imageMedia)).toEqual({
      id: 'media-1',
      title: 'Hero image',
      type: 'image',
      url: 'https://cdn.sanity.io/image.webp',
      alt: 'A hero image',
      caption: 'A hero image',
      tags: [{ id: 'tag-1', title: 'Product', slug: 'product' }],
    })
  })

  it('video media는 videoUrl을 url로 사용한다', () => {
    expect(mapMediaAsset(videoMedia)).toMatchObject({
      id: 'media-2',
      type: 'video',
      url: 'https://cdn.sanity.io/video.mp4',
      durationSeconds: 12,
    })
  })
})

describe('mapPost', () => {
  it('Sanity post payload를 앱 PostDetail view model로 변환한다', () => {
    const post = mapPost(postPayload)

    expect(post).toMatchObject({
      id: 'post-1',
      type: 'blog',
      slug: 'hello',
      title: 'Hello',
      status: 'published',
    })
    expect(post.blocks).toHaveLength(4)
    expect(post.blocks[1]).toMatchObject({
      type: 'image',
      media: { id: 'media-1', url: 'https://cdn.sanity.io/image.webp' },
    })
  })

  it('지원하지 않는 block type은 실패한다', () => {
    expect(() =>
      mapPost({
        ...postPayload,
        blocks: [{ _type: 'unknownBlock' }],
      }),
    ).toThrow('unsupported block type unknownBlock')
  })

  it('media reference가 펼쳐지지 않은 block은 실패한다', () => {
    expect(() =>
      mapPost({
        ...postPayload,
        blocks: [{ _type: 'imageBlock', media: { _ref: 'media-1' } }],
      }),
    ).toThrow('media.id must be a non-empty string')
  })
})
