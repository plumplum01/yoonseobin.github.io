import type {
	ClientCarouselPostBlock,
	ClientHeadingPostBlock,
	ClientImagePostBlock,
	ClientMediaAsset,
	ClientMediaTag,
	ClientPost,
	ClientPostBlock,
	ClientQuotePostBlock,
	ClientTextPostBlock,
	ClientVideoPostBlock,
	MediaAspectRatio,
	MediaAsset,
	MediaAssetType,
	PostBlock,
	PostDetail,
	PostStatus,
	PostType,
} from '@portfolio/types'
import {
	optionalRecordArray as readOptionalRecordArray,
	optionalString as readOptionalString,
	requirePayloadRecord,
	requireRecord as readRequiredRecord,
	requireRecordArray as readRequiredRecordArray,
	requireString as readRequiredString,
	type UnknownRecord,
} from './payloadGuards'

const PAYLOAD_NAME = 'post'

function requireString(record: UnknownRecord, key: string, context: string): string {
	return readRequiredString(record, key, context, PAYLOAD_NAME)
}

function optionalString(record: UnknownRecord, key: string): string | undefined {
	return readOptionalString(record, key, PAYLOAD_NAME)
}

function requireRecord(record: UnknownRecord, key: string, context: string): UnknownRecord {
	return readRequiredRecord(record, key, context, PAYLOAD_NAME)
}

function optionalRecordArray(record: UnknownRecord, key: string, context: string): UnknownRecord[] {
	return readOptionalRecordArray(record, key, context, PAYLOAD_NAME)
}

function requireRecordArray(record: UnknownRecord, key: string, context: string): UnknownRecord[] {
	return readRequiredRecordArray(record, key, context, PAYLOAD_NAME)
}

function assertPostType(value: string, context: string): PostType {
	if (value === 'blog' || value === 'shorts' || value === 'about') return value
	throw new Error(`Invalid post payload: ${context}.type has unsupported value`)
}

function assertPostStatus(value: string, context: string): PostStatus {
	if (value === 'draft' || value === 'published') return value
	throw new Error(`Invalid post payload: ${context}.status has unsupported value`)
}

function assertMediaType(value: string, context: string): MediaAssetType {
	if (value === 'image' || value === 'video') return value
	throw new Error(`Invalid post payload: ${context}.type has unsupported media value`)
}

function assertMediaAspectRatio(value: string | undefined, context: string): MediaAspectRatio {
	if (!value) return 'video'
	if (value === 'square' || value === 'video' || value === 'portrait' || value === 'wide') {
		return value
	}
	throw new Error(`Invalid post payload: ${context}.aspectRatio has unsupported value`)
}

function assertClientMediaTag(raw: UnknownRecord, index: number): ClientMediaTag {
	const context = `media.tags[${index}]`
	return {
		id: requireString(raw, 'id', context),
		title: requireString(raw, 'title', context),
		slug: requireString(raw, 'slug', context),
	}
}

export function assertClientMediaAsset(raw: unknown): ClientMediaAsset {
	const record = requirePayloadRecord(raw, PAYLOAD_NAME, 'media asset is missing')
	const context = 'media'
	const id = requireString(record, 'id', context)
	const type = assertMediaType(requireString(record, 'type', context), context)
	const alt = optionalString(record, 'alt')
	const caption = optionalString(record, 'caption')
	const imageUrl = optionalString(record, 'imageUrl')
	const videoUrl = optionalString(record, 'videoUrl')
	const createdAt = optionalString(record, 'createdAt')
	const updatedAt = optionalString(record, 'updatedAt')
	const tags = optionalRecordArray(record, 'tags', context).map(assertClientMediaTag)

	return {
		id,
		title: requireString(record, 'title', context),
		type,
		...(alt ? { alt } : {}),
		...(caption ? { caption } : {}),
		tags,
		...(typeof record.durationSeconds === 'number'
			? { durationSeconds: record.durationSeconds }
			: {}),
		...(imageUrl ? { imageUrl } : {}),
		...(videoUrl ? { videoUrl } : {}),
		...(createdAt ? { createdAt } : {}),
		...(updatedAt ? { updatedAt } : {}),
	}
}

export function mapClientMediaAsset(clientMedia: ClientMediaAsset): MediaAsset {
	const url = clientMedia.type === 'image' ? clientMedia.imageUrl : clientMedia.videoUrl
	if (!url) {
		throw new Error(
			`Invalid post payload: media.${clientMedia.type === 'image' ? 'imageUrl' : 'videoUrl'} must be a non-empty string`,
		)
	}

	return {
		id: clientMedia.id,
		title: clientMedia.title,
		type: clientMedia.type,
		url,
		...(clientMedia.alt ? { alt: clientMedia.alt } : {}),
		...(clientMedia.caption ? { caption: clientMedia.caption } : {}),
		tags: clientMedia.tags ?? [],
		...(typeof clientMedia.durationSeconds === 'number'
			? { durationSeconds: clientMedia.durationSeconds }
			: {}),
		...(clientMedia.createdAt ? { createdAt: clientMedia.createdAt } : {}),
		...(clientMedia.updatedAt ? { updatedAt: clientMedia.updatedAt } : {}),
	}
}

export function mapMediaAsset(raw: unknown): MediaAsset {
	return mapClientMediaAsset(assertClientMediaAsset(raw))
}

function assertClientTextBlock(raw: UnknownRecord): ClientTextPostBlock {
	const body = raw.body
	if (!Array.isArray(body)) {
		throw new Error('Invalid post payload: text block body must be an array')
	}
	return { _type: 'textBlock', body }
}

function assertClientHeadingBlock(raw: UnknownRecord): ClientHeadingPostBlock {
	const level = raw.level
	if (level !== 2 && level !== 3 && level !== 4) {
		throw new Error('Invalid post payload: heading block level must be 2, 3, or 4')
	}
	return {
		_type: 'headingBlock',
		level,
		text: requireString(raw, 'text', 'headingBlock'),
	}
}

function assertClientQuoteBlock(raw: UnknownRecord): ClientQuotePostBlock {
	const attribution = optionalString(raw, 'attribution')
	return {
		_type: 'quoteBlock',
		text: requireString(raw, 'text', 'quoteBlock'),
		...(attribution ? { attribution } : {}),
	}
}

function assertClientImageBlock(raw: UnknownRecord): ClientImagePostBlock {
	const context = 'imageBlock'
	return {
		_type: 'imageBlock',
		media: assertClientMediaAsset(requireRecord(raw, 'media', context)),
		aspectRatio: assertMediaAspectRatio(optionalString(raw, 'aspectRatio'), context),
	}
}

function assertClientCarouselBlock(raw: UnknownRecord): ClientCarouselPostBlock {
	return {
		_type: 'carouselBlock',
		mediaItems: requireRecordArray(raw, 'mediaItems', 'carouselBlock').map(
			assertClientMediaAsset,
		),
	}
}

function assertClientVideoBlock(raw: UnknownRecord): ClientVideoPostBlock {
	const context = 'videoBlock'
	return {
		_type: 'videoBlock',
		media: assertClientMediaAsset(requireRecord(raw, 'media', context)),
		aspectRatio: assertMediaAspectRatio(optionalString(raw, 'aspectRatio'), context),
	}
}

function assertClientPostBlock(raw: UnknownRecord): ClientPostBlock {
	const type = requireString(raw, '_type', 'block')
	switch (type) {
		case 'textBlock':
			return assertClientTextBlock(raw)
		case 'headingBlock':
			return assertClientHeadingBlock(raw)
		case 'quoteBlock':
			return assertClientQuoteBlock(raw)
		case 'imageBlock':
			return assertClientImageBlock(raw)
		case 'carouselBlock':
			return assertClientCarouselBlock(raw)
		case 'videoBlock':
			return assertClientVideoBlock(raw)
		default:
			throw new Error(`Invalid post payload: unsupported block type ${type}`)
	}
}

function assertClientPostBase(raw: UnknownRecord): Omit<ClientPost, 'blocks'> {
	const context = 'post'
	const subtitle = optionalString(raw, 'subtitle')
	const summary = optionalString(raw, 'summary')
	const thumbnailUrl = optionalString(raw, 'thumbnailUrl')
	const publishedAt = optionalString(raw, 'publishedAt')
	const createdAt = optionalString(raw, 'createdAt')
	const updatedAt = optionalString(raw, 'updatedAt')

	return {
		id: requireString(raw, 'id', context),
		type: assertPostType(requireString(raw, 'type', context), context),
		slug: requireString(raw, 'slug', context),
		title: requireString(raw, 'title', context),
		...(subtitle ? { subtitle } : {}),
		...(summary ? { summary } : {}),
		...(thumbnailUrl ? { thumbnailUrl } : {}),
		status: assertPostStatus(requireString(raw, 'status', context), context),
		...(publishedAt ? { publishedAt } : {}),
		...(createdAt ? { createdAt } : {}),
		...(updatedAt ? { updatedAt } : {}),
	}
}

export function assertClientPost(raw: unknown): ClientPost {
	const record = requirePayloadRecord(raw, PAYLOAD_NAME, 'post document is missing')

	return {
		...assertClientPostBase(record),
		blocks: optionalRecordArray(record, 'blocks', 'post').map(assertClientPostBlock),
	}
}

function mapClientPostBlock(block: ClientPostBlock): PostBlock {
	switch (block._type) {
		case 'textBlock':
			return { type: 'text', body: block.body }
		case 'headingBlock':
			return { type: 'heading', level: block.level, text: block.text }
		case 'quoteBlock':
			return {
				type: 'quote',
				text: block.text,
				...(block.attribution ? { attribution: block.attribution } : {}),
			}
		case 'imageBlock':
			return {
				type: 'image',
				media: mapClientMediaAsset(block.media),
				aspectRatio: block.aspectRatio ?? 'video',
			}
		case 'carouselBlock':
			return { type: 'carousel', mediaItems: block.mediaItems.map(mapClientMediaAsset) }
		case 'videoBlock':
			return {
				type: 'video',
				media: mapClientMediaAsset(block.media),
				aspectRatio: block.aspectRatio ?? 'video',
			}
	}
}

export function mapClientPost(clientPost: ClientPost): PostDetail {
	return {
		id: clientPost.id,
		type: clientPost.type,
		slug: clientPost.slug,
		title: clientPost.title,
		...(clientPost.subtitle ? { subtitle: clientPost.subtitle } : {}),
		...(clientPost.summary ? { summary: clientPost.summary } : {}),
		...(clientPost.thumbnailUrl ? { thumbnailUrl: clientPost.thumbnailUrl } : {}),
		status: clientPost.status,
		...(clientPost.publishedAt ? { publishedAt: clientPost.publishedAt } : {}),
		...(clientPost.createdAt ? { createdAt: clientPost.createdAt } : {}),
		...(clientPost.updatedAt ? { updatedAt: clientPost.updatedAt } : {}),
		blocks: (clientPost.blocks ?? []).map(mapClientPostBlock),
	}
}

export function mapPost(raw: unknown): PostDetail {
	return mapClientPost(assertClientPost(raw))
}
