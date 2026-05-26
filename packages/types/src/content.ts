export type PostType = 'blog' | 'shorts' | 'about'

export type PostStatus = 'draft' | 'published'

export type PostBlockType = 'text' | 'image' | 'carousel' | 'video' | 'heading' | 'quote'

export type MediaAssetType = 'image' | 'video'

export interface Post {
  id: number
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

export interface PostBlock {
  id: number
  postId: number
  orderIndex: number
  type: PostBlockType
  content?: Record<string, unknown>
  createdAt?: string
}

export interface MediaAsset {
  id: number
  type: MediaAssetType
  url: string
  alt?: string
  caption?: string
  width?: number
  height?: number
  durationSeconds?: number
  createdAt?: string
}

export interface BlockMedia {
  id: number
  blockId: number
  mediaId: number
  orderIndex: number
}
