import type {
  CarouselPostBlock,
  HeadingPostBlock,
  ImagePostBlock,
  MediaAsset,
  MediaAssetType,
  MediaTag,
  Post,
  PostBlock,
  PostDetail,
  PostStatus,
  PostType,
  QuotePostBlock,
  TextPostBlock,
  VideoPostBlock,
} from '@portfolio/types'

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requireString(record: UnknownRecord, key: string, context: string): string {
  const value = record[key]
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Invalid post payload: ${context}.${key} must be a non-empty string`)
  }
  return value
}

function optionalString(record: UnknownRecord, key: string): string | undefined {
  const value = record[key]
  if (value === undefined || value === null) return undefined
  if (typeof value !== 'string') {
    throw new Error(`Invalid post payload: ${key} must be a string when provided`)
  }
  return value
}

function requireRecord(record: UnknownRecord, key: string, context: string): UnknownRecord {
  const value = record[key]
  if (!isRecord(value)) {
    throw new Error(`Invalid post payload: ${context}.${key} must be an object`)
  }
  return value
}

function optionalRecordArray(record: UnknownRecord, key: string, context: string): UnknownRecord[] {
  const value = record[key]
  if (value === undefined || value === null) return []
  if (!Array.isArray(value) || value.some((item) => !isRecord(item))) {
    throw new Error(`Invalid post payload: ${context}.${key} must be an object array`)
  }
  return value
}

function requireRecordArray(record: UnknownRecord, key: string, context: string): UnknownRecord[] {
  const value = record[key]
  if (!Array.isArray(value) || value.some((item) => !isRecord(item))) {
    throw new Error(`Invalid post payload: ${context}.${key} must be an object array`)
  }
  return value
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

function resolveMediaTag(raw: UnknownRecord, index: number): MediaTag {
  const context = `media.tags[${index}]`
  return {
    id: requireString(raw, 'id', context),
    title: requireString(raw, 'title', context),
    slug: requireString(raw, 'slug', context),
  }
}

export function resolveMediaAsset(raw: unknown): MediaAsset {
  if (!isRecord(raw)) {
    throw new Error('Invalid post payload: media asset is missing')
  }

  const context = 'media'
  const id = requireString(raw, 'id', context)
  const type = assertMediaType(requireString(raw, 'type', context), context)
  const urlKey = type === 'image' ? 'imageUrl' : 'videoUrl'

  return {
    id,
    title: requireString(raw, 'title', context),
    type,
    url: requireString(raw, urlKey, context),
    ...(optionalString(raw, 'alt') ? { alt: optionalString(raw, 'alt') } : {}),
    ...(optionalString(raw, 'caption') ? { caption: optionalString(raw, 'caption') } : {}),
    tags: optionalRecordArray(raw, 'tags', context).map(resolveMediaTag),
    ...(typeof raw.durationSeconds === 'number' ? { durationSeconds: raw.durationSeconds } : {}),
    ...(optionalString(raw, 'createdAt') ? { createdAt: optionalString(raw, 'createdAt') } : {}),
    ...(optionalString(raw, 'updatedAt') ? { updatedAt: optionalString(raw, 'updatedAt') } : {}),
  }
}

function resolveTextBlock(raw: UnknownRecord): TextPostBlock {
  const body = raw.body
  if (!Array.isArray(body)) {
    throw new Error('Invalid post payload: text block body must be an array')
  }
  return { type: 'text', body }
}

function resolveHeadingBlock(raw: UnknownRecord): HeadingPostBlock {
  const level = raw.level
  if (level !== 2 && level !== 3 && level !== 4) {
    throw new Error('Invalid post payload: heading block level must be 2, 3, or 4')
  }
  return {
    type: 'heading',
    level,
    text: requireString(raw, 'text', 'headingBlock'),
  }
}

function resolveQuoteBlock(raw: UnknownRecord): QuotePostBlock {
  return {
    type: 'quote',
    text: requireString(raw, 'text', 'quoteBlock'),
    ...(optionalString(raw, 'attribution') ? { attribution: optionalString(raw, 'attribution') } : {}),
  }
}

function resolveImageBlock(raw: UnknownRecord): ImagePostBlock {
  return {
    type: 'image',
    media: resolveMediaAsset(requireRecord(raw, 'media', 'imageBlock')),
  }
}

function resolveCarouselBlock(raw: UnknownRecord): CarouselPostBlock {
  return {
    type: 'carousel',
    mediaItems: requireRecordArray(raw, 'mediaItems', 'carouselBlock').map(resolveMediaAsset),
  }
}

function resolveVideoBlock(raw: UnknownRecord): VideoPostBlock {
  return {
    type: 'video',
    media: resolveMediaAsset(requireRecord(raw, 'media', 'videoBlock')),
  }
}

function resolvePostBlock(raw: UnknownRecord): PostBlock {
  const type = requireString(raw, '_type', 'block')
  switch (type) {
    case 'textBlock':
      return resolveTextBlock(raw)
    case 'headingBlock':
      return resolveHeadingBlock(raw)
    case 'quoteBlock':
      return resolveQuoteBlock(raw)
    case 'imageBlock':
      return resolveImageBlock(raw)
    case 'carouselBlock':
      return resolveCarouselBlock(raw)
    case 'videoBlock':
      return resolveVideoBlock(raw)
    default:
      throw new Error(`Invalid post payload: unsupported block type ${type}`)
  }
}

function resolvePostBase(raw: UnknownRecord): Post {
  const context = 'post'
  return {
    id: requireString(raw, 'id', context),
    type: assertPostType(requireString(raw, 'type', context), context),
    slug: requireString(raw, 'slug', context),
    title: requireString(raw, 'title', context),
    ...(optionalString(raw, 'subtitle') ? { subtitle: optionalString(raw, 'subtitle') } : {}),
    ...(optionalString(raw, 'summary') ? { summary: optionalString(raw, 'summary') } : {}),
    ...(optionalString(raw, 'thumbnailUrl') ? { thumbnailUrl: optionalString(raw, 'thumbnailUrl') } : {}),
    status: assertPostStatus(requireString(raw, 'status', context), context),
    ...(optionalString(raw, 'publishedAt') ? { publishedAt: optionalString(raw, 'publishedAt') } : {}),
    ...(optionalString(raw, 'createdAt') ? { createdAt: optionalString(raw, 'createdAt') } : {}),
    ...(optionalString(raw, 'updatedAt') ? { updatedAt: optionalString(raw, 'updatedAt') } : {}),
  }
}

export function resolvePost(raw: unknown): PostDetail {
  if (!isRecord(raw)) {
    throw new Error('Invalid post payload: post document is missing')
  }

  return {
    ...resolvePostBase(raw),
    blocks: optionalRecordArray(raw, 'blocks', 'post').map(resolvePostBlock),
  }
}
