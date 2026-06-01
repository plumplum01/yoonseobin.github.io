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
  MediaAsset,
  MediaAssetType,
  PostBlock,
  PostDetail,
  PostStatus,
  PostType,
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

function assertClientMediaTag(raw: UnknownRecord, index: number): ClientMediaTag {
  const context = `media.tags[${index}]`
  return {
    id: requireString(raw, 'id', context),
    title: requireString(raw, 'title', context),
    slug: requireString(raw, 'slug', context),
  }
}

export function assertClientMediaAsset(raw: unknown): ClientMediaAsset {
  if (!isRecord(raw)) {
    throw new Error('Invalid post payload: media asset is missing')
  }

  const context = 'media'
  const id = requireString(raw, 'id', context)
  const type = assertMediaType(requireString(raw, 'type', context), context)
  const tags = optionalRecordArray(raw, 'tags', context).map(assertClientMediaTag)

  return {
    id,
    title: requireString(raw, 'title', context),
    type,
    ...(optionalString(raw, 'alt') ? { alt: optionalString(raw, 'alt') } : {}),
    ...(optionalString(raw, 'caption') ? { caption: optionalString(raw, 'caption') } : {}),
    tags,
    ...(typeof raw.durationSeconds === 'number' ? { durationSeconds: raw.durationSeconds } : {}),
    ...(optionalString(raw, 'imageUrl') ? { imageUrl: optionalString(raw, 'imageUrl') } : {}),
    ...(optionalString(raw, 'videoUrl') ? { videoUrl: optionalString(raw, 'videoUrl') } : {}),
    ...(optionalString(raw, 'createdAt') ? { createdAt: optionalString(raw, 'createdAt') } : {}),
    ...(optionalString(raw, 'updatedAt') ? { updatedAt: optionalString(raw, 'updatedAt') } : {}),
  }
}

export function resolveClientMediaAsset(clientMedia: ClientMediaAsset): MediaAsset {
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

export function resolveMediaAsset(raw: unknown): MediaAsset {
  return resolveClientMediaAsset(assertClientMediaAsset(raw))
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
  return {
    _type: 'quoteBlock',
    text: requireString(raw, 'text', 'quoteBlock'),
    ...(optionalString(raw, 'attribution') ? { attribution: optionalString(raw, 'attribution') } : {}),
  }
}

function assertClientImageBlock(raw: UnknownRecord): ClientImagePostBlock {
  return {
    _type: 'imageBlock',
    media: assertClientMediaAsset(requireRecord(raw, 'media', 'imageBlock')),
  }
}

function assertClientCarouselBlock(raw: UnknownRecord): ClientCarouselPostBlock {
  return {
    _type: 'carouselBlock',
    mediaItems: requireRecordArray(raw, 'mediaItems', 'carouselBlock').map(assertClientMediaAsset),
  }
}

function assertClientVideoBlock(raw: UnknownRecord): ClientVideoPostBlock {
  return {
    _type: 'videoBlock',
    media: assertClientMediaAsset(requireRecord(raw, 'media', 'videoBlock')),
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

export function assertClientPost(raw: unknown): ClientPost {
  if (!isRecord(raw)) {
    throw new Error('Invalid post payload: post document is missing')
  }

  return {
    ...assertClientPostBase(raw),
    blocks: optionalRecordArray(raw, 'blocks', 'post').map(assertClientPostBlock),
  }
}

function resolveClientPostBlock(block: ClientPostBlock): PostBlock {
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
      return { type: 'image', media: resolveClientMediaAsset(block.media) }
    case 'carouselBlock':
      return { type: 'carousel', mediaItems: block.mediaItems.map(resolveClientMediaAsset) }
    case 'videoBlock':
      return { type: 'video', media: resolveClientMediaAsset(block.media) }
  }
}

export function resolveClientPost(clientPost: ClientPost): PostDetail {
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
    blocks: (clientPost.blocks ?? []).map(resolveClientPostBlock),
  }
}

export function resolvePost(raw: unknown): PostDetail {
  return resolveClientPost(assertClientPost(raw))
}
