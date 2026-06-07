import type {
	CarouselPostBlock,
	HeadingPostBlock,
	ImagePostBlock,
	MediaAspectRatio,
	MediaAsset,
	MediaAssetType,
	MediaTag,
	Post,
	PostBlock,
	PostDetail,
	PostStatus,
	PostType,
	TextPostBlock,
	VideoPostBlock,
} from '@portfolio/types'
import {
	optionalNumber,
	optionalRecordArray,
	optionalString,
	requirePayloadRecord,
	requireRecord,
	requireRecordArray,
	requireString,
	type UnknownRecord,
} from './payloadGuards'

function assertPostType(value: string, context: string): PostType {
	if (value === 'project' || value === 'article' || value === 'reel') return value
	throw new Error(`Invalid payload: ${context}.type has unsupported value`)
}

function assertPostStatus(value: string, context: string): PostStatus {
	if (value === 'draft' || value === 'published') return value
	throw new Error(`Invalid payload: ${context}.status has unsupported value`)
}

function assertMediaType(value: string, context: string): MediaAssetType {
	if (value === 'image' || value === 'video') return value
	throw new Error(`Invalid payload: ${context}.type has unsupported media value`)
}

function assertMediaAspectRatio(value: string, context: string): MediaAspectRatio {
	if (value === 'square' || value === 'video' || value === 'portrait' || value === 'wide') {
		return value
	}
	throw new Error(`Invalid payload: ${context}.aspectRatio has unsupported value`)
}

function assertHeadingLevel(value: unknown, context: string): HeadingPostBlock['level'] {
	if (value === 2 || value === 3 || value === 4) return value
	throw new Error(`Invalid payload: ${context}.level must be 2, 3, or 4`)
}

function parseMediaTag(raw: UnknownRecord, index: number): MediaTag {
	const context = `media.tags[${index}]`
	return {
		id: requireString(raw, 'id', context),
		title: requireString(raw, 'title', context),
		slug: requireString(raw, 'slug', context),
	}
}

export function parseMediaAsset(raw: unknown): MediaAsset {
	const record = requirePayloadRecord(raw, 'media asset is missing')
	const context = 'media'
	const alt = optionalString(record, 'alt', context)
	const caption = optionalString(record, 'caption', context)
	const durationSeconds = optionalNumber(record, 'durationSeconds', context)
	const createdAt = optionalString(record, 'createdAt', context)
	const updatedAt = optionalString(record, 'updatedAt', context)

	return {
		id: requireString(record, 'id', context),
		title: requireString(record, 'title', context),
		type: assertMediaType(requireString(record, 'type', context), context),
		url: requireString(record, 'url', context),
		...(alt ? { alt } : {}),
		...(caption ? { caption } : {}),
		tags: optionalRecordArray(record, 'tags', context).map(parseMediaTag),
		...(typeof durationSeconds === 'number' ? { durationSeconds } : {}),
		...(createdAt ? { createdAt } : {}),
		...(updatedAt ? { updatedAt } : {}),
	}
}

function parseTextBlock(raw: UnknownRecord): TextPostBlock {
	const body = raw.body
	if (!Array.isArray(body)) {
		throw new Error('Invalid payload: textBlock.body must be an array')
	}
	return { type: 'text', body }
}

function parseHeadingBlock(raw: UnknownRecord): HeadingPostBlock {
	const context = 'headingBlock'
	return {
		type: 'heading',
		level: assertHeadingLevel(raw.level, context),
		text: requireString(raw, 'text', context),
	}
}

function parseImageBlock(raw: UnknownRecord): ImagePostBlock {
	const context = 'imageBlock'
	return {
		type: 'image',
		media: parseMediaAsset(requireRecord(raw, 'media', context)),
		aspectRatio: assertMediaAspectRatio(requireString(raw, 'aspectRatio', context), context),
	}
}

function parseCarouselBlock(raw: UnknownRecord): CarouselPostBlock {
	return {
		type: 'carousel',
		mediaItems: requireRecordArray(raw, 'mediaItems', 'carouselBlock').map(parseMediaAsset),
	}
}

function parseVideoBlock(raw: UnknownRecord): VideoPostBlock {
	const context = 'videoBlock'
	return {
		type: 'video',
		media: parseMediaAsset(requireRecord(raw, 'media', context)),
		aspectRatio: assertMediaAspectRatio(requireString(raw, 'aspectRatio', context), context),
	}
}

function parsePostBlock(raw: UnknownRecord): PostBlock {
	const type = requireString(raw, 'type', 'block')
	switch (type) {
		case 'text':
			return parseTextBlock(raw)
		case 'heading':
			return parseHeadingBlock(raw)
		case 'image':
			return parseImageBlock(raw)
		case 'carousel':
			return parseCarouselBlock(raw)
		case 'video':
			return parseVideoBlock(raw)
		default:
			throw new Error(`Invalid payload: unsupported block type ${type}`)
	}
}

function parsePostHeader(record: UnknownRecord): Post {
	const context = 'post'
	const subtitle = optionalString(record, 'subtitle', context)
	const summary = optionalString(record, 'summary', context)
	const thumbnailUrl = optionalString(record, 'thumbnailUrl', context)
	const publishedAt = optionalString(record, 'publishedAt', context)
	const createdAt = optionalString(record, 'createdAt', context)
	const updatedAt = optionalString(record, 'updatedAt', context)

	return {
		id: requireString(record, 'id', context),
		type: assertPostType(requireString(record, 'type', context), context),
		slug: requireString(record, 'slug', context),
		title: requireString(record, 'title', context),
		...(subtitle ? { subtitle } : {}),
		...(summary ? { summary } : {}),
		...(thumbnailUrl ? { thumbnailUrl } : {}),
		status: assertPostStatus(requireString(record, 'status', context), context),
		...(publishedAt ? { publishedAt } : {}),
		...(createdAt ? { createdAt } : {}),
		...(updatedAt ? { updatedAt } : {}),
	}
}

export function parsePostSummary(raw: unknown): Post {
	return parsePostHeader(requirePayloadRecord(raw, 'post document is missing'))
}

export function parsePost(raw: unknown): PostDetail {
	const record = requirePayloadRecord(raw, 'post document is missing')
	return {
		...parsePostHeader(record),
		blocks: optionalRecordArray(record, 'blocks', 'post').map(parsePostBlock),
	}
}
