import type {
	CarouselPostBlock,
	HeadingPostBlock,
	ImagePostBlock,
	MediaAspectRatio,
	MediaAsset,
	MediaAssetType,
	MediaTag,
	PostBlock,
	PostDetail,
	PostStatus,
	PostType,
	TextPostBlock,
	VideoPostBlock,
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
	if (value === 'project' || value === 'article' || value === 'reel') return value
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

function assertMediaAspectRatio(value: string, context: string): MediaAspectRatio {
	if (value === 'square' || value === 'video' || value === 'portrait' || value === 'wide') {
		return value
	}
	throw new Error(`Invalid post payload: ${context}.aspectRatio has unsupported value`)
}

function assertHeadingLevel(value: unknown): HeadingPostBlock['level'] {
	if (value === 2 || value === 3 || value === 4) return value
	throw new Error('Invalid post payload: heading block level must be 2, 3, or 4')
}

function optionalNumber(record: UnknownRecord, key: string): number | undefined {
	const value = record[key]
	if (typeof value === 'undefined' || value === null) return undefined
	if (typeof value === 'number') return value
	throw new Error(`Invalid post payload: media.${key} must be a number`)
}

function assertMediaTag(raw: UnknownRecord, index: number): MediaTag {
	const context = `media.tags[${index}]`
	return {
		id: requireString(raw, 'id', context),
		title: requireString(raw, 'title', context),
		slug: requireString(raw, 'slug', context),
	}
}

export function mapMediaAsset(raw: unknown): MediaAsset {
	const record = requirePayloadRecord(raw, PAYLOAD_NAME, 'media asset is missing')
	const context = 'media'
	const alt = optionalString(record, 'alt')
	const caption = optionalString(record, 'caption')
	const durationSeconds = optionalNumber(record, 'durationSeconds')
	const createdAt = optionalString(record, 'createdAt')
	const updatedAt = optionalString(record, 'updatedAt')

	return {
		id: requireString(record, 'id', context),
		title: requireString(record, 'title', context),
		type: assertMediaType(requireString(record, 'type', context), context),
		url: requireString(record, 'url', context),
		...(alt ? { alt } : {}),
		...(caption ? { caption } : {}),
		tags: optionalRecordArray(record, 'tags', context).map(assertMediaTag),
		...(typeof durationSeconds === 'number' ? { durationSeconds } : {}),
		...(createdAt ? { createdAt } : {}),
		...(updatedAt ? { updatedAt } : {}),
	}
}

function assertTextBlock(raw: UnknownRecord): TextPostBlock {
	const body = raw.body
	if (!Array.isArray(body)) {
		throw new Error('Invalid post payload: text block body must be an array')
	}
	return { type: 'text', body }
}

function assertHeadingBlock(raw: UnknownRecord): HeadingPostBlock {
	return {
		type: 'heading',
		level: assertHeadingLevel(raw.level),
		text: requireString(raw, 'text', 'headingBlock'),
	}
}

function assertImageBlock(raw: UnknownRecord): ImagePostBlock {
	const context = 'imageBlock'
	return {
		type: 'image',
		media: mapMediaAsset(requireRecord(raw, 'media', context)),
		aspectRatio: assertMediaAspectRatio(requireString(raw, 'aspectRatio', context), context),
	}
}

function assertCarouselBlock(raw: UnknownRecord): CarouselPostBlock {
	return {
		type: 'carousel',
		mediaItems: requireRecordArray(raw, 'mediaItems', 'carouselBlock').map(mapMediaAsset),
	}
}

function assertVideoBlock(raw: UnknownRecord): VideoPostBlock {
	const context = 'videoBlock'
	return {
		type: 'video',
		media: mapMediaAsset(requireRecord(raw, 'media', context)),
		aspectRatio: assertMediaAspectRatio(requireString(raw, 'aspectRatio', context), context),
	}
}

function assertPostBlock(raw: UnknownRecord): PostBlock {
	const type = requireString(raw, 'type', 'block')
	switch (type) {
		case 'text':
			return assertTextBlock(raw)
		case 'heading':
			return assertHeadingBlock(raw)
		case 'image':
			return assertImageBlock(raw)
		case 'carousel':
			return assertCarouselBlock(raw)
		case 'video':
			return assertVideoBlock(raw)
		default:
			throw new Error(`Invalid post payload: unsupported block type ${type}`)
	}
}

export function mapPost(raw: unknown): PostDetail {
	const record = requirePayloadRecord(raw, PAYLOAD_NAME, 'post document is missing')
	const context = 'post'
	const subtitle = optionalString(record, 'subtitle')
	const summary = optionalString(record, 'summary')
	const thumbnailUrl = optionalString(record, 'thumbnailUrl')
	const publishedAt = optionalString(record, 'publishedAt')
	const createdAt = optionalString(record, 'createdAt')
	const updatedAt = optionalString(record, 'updatedAt')

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
		blocks: optionalRecordArray(record, 'blocks', context).map(assertPostBlock),
	}
}
