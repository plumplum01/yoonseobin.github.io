import type { MediaAspectRatio, MediaAssetType, PostStatus, PostType } from './content'

export interface ClientProfileEducation {
	title: string
	startDate: string
	endDate?: string
	isCurrent?: boolean
}

export interface ClientProfileAward {
	title: string
	desc?: string
	awardedAt: string
}

export interface ClientProfileLink {
	label: string
	href: string
}

export interface ClientProfile {
	heading: string
	paragraphs: string[]
	education: ClientProfileEducation[]
	awards: ClientProfileAward[]
	links: ClientProfileLink[]
}

export interface ClientMediaTag {
	id: string
	title: string
	slug: string
}

export interface ClientMediaAsset {
	id: string
	title: string
	type: MediaAssetType
	alt?: string
	caption?: string
	tags?: ClientMediaTag[]
	durationSeconds?: number
	imageUrl?: string
	videoUrl?: string
	createdAt?: string
	updatedAt?: string
}

export interface ClientPostBase {
	id: string
	type: PostType
	slug: string
	title: string
	subtitle?: string
	summary?: string
	thumbnailUrl?: string
	status: PostStatus
	publishedAt?: string
	createdAt?: string
	updatedAt?: string
}

export interface ClientTextPostBlock {
	_type: 'textBlock'
	body: unknown[]
}

export interface ClientHeadingPostBlock {
	_type: 'headingBlock'
	level: 2 | 3 | 4
	text: string
}

export interface ClientQuotePostBlock {
	_type: 'quoteBlock'
	text: string
	attribution?: string
}

export interface ClientImagePostBlock {
	_type: 'imageBlock'
	media: ClientMediaAsset
	aspectRatio?: MediaAspectRatio
}

export interface ClientCarouselPostBlock {
	_type: 'carouselBlock'
	mediaItems: ClientMediaAsset[]
}

export interface ClientVideoPostBlock {
	_type: 'videoBlock'
	media: ClientMediaAsset
	aspectRatio?: MediaAspectRatio
}

export type ClientPostBlock =
	| ClientTextPostBlock
	| ClientHeadingPostBlock
	| ClientQuotePostBlock
	| ClientImagePostBlock
	| ClientCarouselPostBlock
	| ClientVideoPostBlock

export interface ClientPost extends ClientPostBase {
	blocks?: ClientPostBlock[]
}
