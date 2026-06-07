import { postBySlugQuery, publishedPostsQuery } from '@portfolio/sanity/queries'
import type { Post, PostDetail } from '@portfolio/types'
import { mapPost } from '@/registry/mappers/mapPost'
import { getSanityClient } from '@/registry/sanityClient'

function toPostSummary(postDetail: PostDetail): Post {
	const { blocks: _blocks, ...post } = postDetail
	return post
}

export async function resolvePosts(): Promise<Post[]> {
	const rawPosts = await getSanityClient().fetch<unknown[]>(publishedPostsQuery)

	return rawPosts.map((rawPost) => toPostSummary(mapPost(rawPost)))
}

export async function resolvePost(slug: string): Promise<PostDetail> {
	return mapPost(await getSanityClient().fetch<unknown>(postBySlugQuery, { slug }))
}
