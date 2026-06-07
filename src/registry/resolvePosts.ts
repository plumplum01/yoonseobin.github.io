import { postBySlugQuery, publishedPostsQuery } from '@portfolio/sanity/queries'
import type { Post, PostDetail } from '@portfolio/types'
import { assertClientPost, mapClientPost, mapPost } from '@/registry/mappers/mapPost'
import { getSanityClient } from '@/registry/sanityClient'

function toPostSummary(postDetail: PostDetail): Post {
	const { blocks: _blocks, ...post } = postDetail
	console.log(post)
	return post
}

export async function resolvePosts(): Promise<Post[]> {
	const rawPosts = await getSanityClient().fetch<unknown[]>(publishedPostsQuery)

	return rawPosts.map((rawPost) => toPostSummary(mapClientPost(assertClientPost(rawPost))))
}

export async function resolvePost(slug: string): Promise<PostDetail> {
	return mapPost(await getSanityClient().fetch<unknown>(postBySlugQuery, { slug }))
}
