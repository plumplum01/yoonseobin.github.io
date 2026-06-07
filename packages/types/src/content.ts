export type PostType = 'project' | 'article' | 'reel'

export type PostStatus = 'draft' | 'published'

export type PostBlockType = 'text' | 'image' | 'carousel' | 'video' | 'heading'

export type MediaAssetType = 'image' | 'video'

export type MediaAspectRatio = 'square' | 'video' | 'portrait' | 'wide'

export interface Post {
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

export interface MediaTag {
	id: string
	title: string
	slug: string
}

export interface MediaAsset {
	id: string
	type: MediaAssetType
	title: string
	url: string
	alt?: string
	caption?: string
	tags: MediaTag[]
	durationSeconds?: number
	createdAt?: string
	updatedAt?: string
}

export interface TextPostBlock {
	type: 'text'
	body: unknown[]
}

export interface HeadingPostBlock {
	type: 'heading'
	level: 2 | 3 | 4
	text: string
}

export interface ImagePostBlock {
	type: 'image'
	media: MediaAsset
	aspectRatio: MediaAspectRatio
}

export interface CarouselPostBlock {
	type: 'carousel'
	mediaItems: MediaAsset[]
}

export interface VideoPostBlock {
	type: 'video'
	media: MediaAsset
	aspectRatio: MediaAspectRatio
}

export type PostBlock =
	| TextPostBlock
	| HeadingPostBlock
	| ImagePostBlock
	| CarouselPostBlock
	| VideoPostBlock

export interface PostDetail extends Post {
	blocks: PostBlock[]
}
