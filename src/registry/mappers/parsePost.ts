import type {
	CarouselPostBlock,
	HeadingPostBlock,
	ImageAspectRatio,
	ImagePostBlock,
	ImageStackPostBlock,
	MediaAspectRatio,
	MediaAsset,
	MediaAssetType,
	MediaTag,
	NaturalMediaAspectRatio,
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
	isRecord,
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

function assertImageAspectRatio(value: string, context: string): ImageAspectRatio {
	if (value === 'natural') return value
	return assertMediaAspectRatio(value, context)
}

function assertNaturalMediaAspectRatio(value: string, context: string): NaturalMediaAspectRatio {
	if (value === 'natural') return value
	return assertMediaAspectRatio(value, context)
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

function parseMediaDimensions(raw: unknown, context: string): MediaAsset['dimensions'] {
	if (!raw) return undefined
	if (!isRecord(raw)) {
		throw new Error(`Invalid payload: ${context}.dimensions must be an object when provided`)
	}
	const record = raw
	const width = optionalNumber(record, 'width', `${context}.dimensions`)
	const height = optionalNumber(record, 'height', `${context}.dimensions`)
	const aspectRatio = optionalNumber(record, 'aspectRatio', `${context}.dimensions`)

	if (
		typeof width !== 'number' ||
		typeof height !== 'number' ||
		typeof aspectRatio !== 'number'
	) {
		return undefined
	}

	if (width <= 0 || height <= 0 || aspectRatio <= 0) {
		return undefined
	}

	return { width, height, aspectRatio }
}

export function parseMediaAsset(raw: unknown): MediaAsset {
	const record = requirePayloadRecord(raw, 'media asset is missing')
	const context = 'media'
	const alt = optionalString(record, 'alt', context)
	const caption = optionalString(record, 'caption', context)
	const durationSeconds = optionalNumber(record, 'durationSeconds', context)
	const createdAt = optionalString(record, 'createdAt', context)
	const updatedAt = optionalString(record, 'updatedAt', context)
	const dimensions = parseMediaDimensions(record.dimensions, context)

	return {
		id: requireString(record, 'id', context),
		title: requireString(record, 'title', context),
		type: assertMediaType(requireString(record, 'type', context), context),
		url: requireString(record, 'url', context),
		...(dimensions ? { dimensions } : {}),
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
		aspectRatio: assertImageAspectRatio(requireString(raw, 'aspectRatio', context), context),
	}
}

function parseMediaItemsBlock<TType extends 'carousel' | 'imageStack'>(
	raw: UnknownRecord,
	type: TType,
	context: string,
): { type: TType; mediaItems: MediaAsset[] } {
	return {
		type,
		mediaItems: requireRecordArray(raw, 'mediaItems', context).map(parseMediaAsset),
	}
}

function parseCarouselBlock(raw: UnknownRecord): CarouselPostBlock {
	return parseMediaItemsBlock(raw, 'carousel', 'carouselBlock')
}

function parseVideoBlock(raw: UnknownRecord): VideoPostBlock {
	const context = 'videoBlock'
	return {
		type: 'video',
		media: parseMediaAsset(requireRecord(raw, 'media', context)),
		aspectRatio: assertNaturalMediaAspectRatio(
			requireString(raw, 'aspectRatio', context),
			context,
		),
	}
}

function parseImageStackBlock(raw: UnknownRecord): ImageStackPostBlock {
	return parseMediaItemsBlock(raw, 'imageStack', 'imageStackBlock')
}

type PostBlockParser = (raw: UnknownRecord) => PostBlock

const blockParsers = {
	text: parseTextBlock,
	heading: parseHeadingBlock,
	image: parseImageBlock,
	imageStack: parseImageStackBlock,
	carousel: parseCarouselBlock,
	video: parseVideoBlock,
} satisfies Record<PostBlock['type'], PostBlockParser>

function parsePostBlock(raw: UnknownRecord): PostBlock {
	const type = requireString(raw, 'type', 'block')
	if (!(type in blockParsers)) {
		throw new Error(`Invalid payload: unsupported block type ${type}`)
	}
	return blockParsers[type as keyof typeof blockParsers](raw)
}

function isMissingMediaUrlError(error: unknown): boolean {
	return error instanceof Error && error.message.includes('media.url must be a non-empty string')
}

function canOmitInvalidMediaBlock(raw: UnknownRecord, error: unknown): boolean {
	if (!isMissingMediaUrlError(error)) return false
	const type = raw.type
	return type === 'image' || type === 'video' || type === 'imageStack' || type === 'carousel'
}

function parseRenderablePostBlocks(rawBlocks: UnknownRecord[]): PostBlock[] {
	const blocks: PostBlock[] = []

	for (const rawBlock of rawBlocks) {
		try {
			blocks.push(parsePostBlock(rawBlock))
		} catch (error) {
			if (!canOmitInvalidMediaBlock(rawBlock, error)) throw error
		}
	}

	return blocks
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
		blocks: parseRenderablePostBlocks(optionalRecordArray(record, 'blocks', 'post')),
	}
}
