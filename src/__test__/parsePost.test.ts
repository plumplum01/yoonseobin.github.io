import { parseMediaAsset, parsePost } from '@/registry/mappers/parsePost'

const imageMedia = {
	id: 'media-1',
	title: 'Hero image',
	type: 'image',
	alt: 'A hero image',
	caption: 'A hero image',
	tags: [{ id: 'tag-1', title: 'Product', slug: 'product' }],
	url: 'https://cdn.sanity.io/image.webp',
	dimensions: {
		width: 1200,
		height: 800,
		aspectRatio: 1.5,
	},
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
		{ type: 'imageStack', mediaItems: [imageMedia] },
		{ type: 'carousel', mediaItems: [imageMedia] },
		{ type: 'video', media: videoMedia, aspectRatio: 'wide' },
	],
}

describe('parseMediaAsset', () => {
	it('projection된 image media를 앱 MediaAsset으로 확인한다', () => {
		expect(parseMediaAsset(imageMedia)).toEqual({
			id: 'media-1',
			title: 'Hero image',
			type: 'image',
			url: 'https://cdn.sanity.io/image.webp',
			alt: 'A hero image',
			caption: 'A hero image',
			tags: [{ id: 'tag-1', title: 'Product', slug: 'product' }],
			dimensions: {
				width: 1200,
				height: 800,
				aspectRatio: 1.5,
			},
		})
	})

	it('projection된 video media를 앱 MediaAsset으로 확인한다', () => {
		expect(parseMediaAsset(videoMedia)).toMatchObject({
			id: 'media-2',
			type: 'video',
			url: 'https://cdn.sanity.io/video.mp4',
			durationSeconds: 12,
		})
	})

	it('지원하지 않는 media type은 실패한다', () => {
		expect(() => parseMediaAsset({ ...imageMedia, type: 'audio' })).toThrow(
			'media.type has unsupported media value',
		)
	})

	it('select projection에서 url이 누락된 media는 실패한다', () => {
		const { url: _url, ...withoutUrl } = imageMedia
		expect(() => parseMediaAsset({ ...withoutUrl, url: null })).toThrow(
			'media.url must be a non-empty string',
		)
	})
})

describe('parsePost', () => {
	it('Sanity post payload를 앱 PostDetail view model로 변환한다', () => {
		const post = parsePost(postPayload)

		expect(post).toMatchObject({
			id: 'post-1',
			type: 'article',
			slug: 'hello',
			title: 'Hello',
			status: 'published',
		})
		expect(post.blocks).toHaveLength(5)
		expect(post.blocks[1]).toMatchObject({
			type: 'image',
			aspectRatio: 'portrait',
			media: { id: 'media-1', url: 'https://cdn.sanity.io/image.webp' },
		})
		expect(post.blocks[2]).toMatchObject({
			type: 'imageStack',
			mediaItems: [{ id: 'media-1', url: 'https://cdn.sanity.io/image.webp' }],
		})
		expect(post.blocks[4]).toMatchObject({
			type: 'video',
			aspectRatio: 'wide',
			media: { id: 'media-2', url: 'https://cdn.sanity.io/video.mp4' },
		})
	})

	it('지원하지 않는 media block aspectRatio는 실패한다', () => {
		expect(() =>
			parsePost({
				...postPayload,
				blocks: [{ type: 'image', media: imageMedia, aspectRatio: 'cinema' }],
			}),
		).toThrow('imageBlock.aspectRatio has unsupported value')
	})

	it('image block은 natural aspectRatio를 허용한다', () => {
		const post = parsePost({
			...postPayload,
			blocks: [{ type: 'image', media: imageMedia, aspectRatio: 'natural' }],
		})

		expect(post.blocks[0]).toMatchObject({
			type: 'image',
			aspectRatio: 'natural',
			media: {
				dimensions: {
					aspectRatio: 1.5,
				},
			},
		})
	})

	it('video block은 natural aspectRatio를 허용하지 않는다', () => {
		expect(() =>
			parsePost({
				...postPayload,
				blocks: [{ type: 'video', media: videoMedia, aspectRatio: 'natural' }],
			}),
		).toThrow('videoBlock.aspectRatio has unsupported value')
	})

	it('지원하지 않는 block type은 실패한다', () => {
		expect(() =>
			parsePost({
				...postPayload,
				blocks: [{ type: 'unknownBlock' }],
			}),
		).toThrow('unsupported block type unknownBlock')
	})

	it('asset url이 비어있는 media block은 제외하고 나머지 block을 변환한다', () => {
		const { url: _url, ...mediaWithoutUrl } = imageMedia
		const post = parsePost({
			...postPayload,
			blocks: [
				{ type: 'heading', level: 2, text: 'Intro' },
				{ type: 'image', media: { ...mediaWithoutUrl, url: null }, aspectRatio: 'portrait' },
				{ type: 'image', media: imageMedia, aspectRatio: 'wide' },
			],
		})

		expect(post.blocks).toHaveLength(2)
		expect(post.blocks[0]).toMatchObject({ type: 'heading', text: 'Intro' })
		expect(post.blocks[1]).toMatchObject({
			type: 'image',
			media: { id: 'media-1', url: 'https://cdn.sanity.io/image.webp' },
		})
	})

	it('media reference가 펼쳐지지 않은 block은 실패한다', () => {
		expect(() =>
			parsePost({
				...postPayload,
				blocks: [{ type: 'image', media: { _ref: 'media-1' }, aspectRatio: 'video' }],
			}),
		).toThrow('media.id must be a non-empty string')
	})
})
