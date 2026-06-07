import { mapMediaAsset, mapPost } from '@/registry/mappers/mapPost'

const imageMedia = {
	id: 'media-1',
	title: 'Hero image',
	type: 'image',
	alt: 'A hero image',
	caption: 'A hero image',
	tags: [{ id: 'tag-1', title: 'Product', slug: 'product' }],
	url: 'https://cdn.sanity.io/image.webp',
}

const videoMedia = {
	id: 'media-2',
	title: 'Demo video',
	type: 'video',
	caption: 'A demo video',
	durationSeconds: 12,
	url: 'https://cdn.sanity.io/video.mp4',
}

const postPayload = {
	id: 'post-1',
	type: 'article',
	slug: 'hello',
	title: 'Hello',
	status: 'published',
	blocks: [
		{ type: 'heading', level: 2, text: 'Intro' },
		{ type: 'image', media: imageMedia, aspectRatio: 'portrait' },
		{ type: 'carousel', mediaItems: [imageMedia] },
		{ type: 'video', media: videoMedia, aspectRatio: 'wide' },
	],
}

describe('mapMediaAsset', () => {
	it('projection된 image media를 앱 MediaAsset으로 확인한다', () => {
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

	it('projection된 video media를 앱 MediaAsset으로 확인한다', () => {
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
			type: 'article',
			slug: 'hello',
			title: 'Hello',
			status: 'published',
		})
		expect(post.blocks).toHaveLength(4)
		expect(post.blocks[1]).toMatchObject({
			type: 'image',
			aspectRatio: 'portrait',
			media: { id: 'media-1', url: 'https://cdn.sanity.io/image.webp' },
		})
		expect(post.blocks[3]).toMatchObject({
			type: 'video',
			aspectRatio: 'wide',
			media: { id: 'media-2', url: 'https://cdn.sanity.io/video.mp4' },
		})
	})

	it('지원하지 않는 media block aspectRatio는 실패한다', () => {
		expect(() =>
			mapPost({
				...postPayload,
				blocks: [{ type: 'image', media: imageMedia, aspectRatio: 'cinema' }],
			}),
		).toThrow('imageBlock.aspectRatio has unsupported value')
	})

	it('지원하지 않는 block type은 실패한다', () => {
		expect(() =>
			mapPost({
				...postPayload,
				blocks: [{ type: 'unknownBlock' }],
			}),
		).toThrow('unsupported block type unknownBlock')
	})

	it('media reference가 펼쳐지지 않은 block은 실패한다', () => {
		expect(() =>
			mapPost({
				...postPayload,
				blocks: [{ type: 'image', media: { _ref: 'media-1' }, aspectRatio: 'video' }],
			}),
		).toThrow('media.id must be a non-empty string')
	})
})
