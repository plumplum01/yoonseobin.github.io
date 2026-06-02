import { postBySlugQuery, publishedPostsQuery } from '@portfolio/sanity/queries'
import type { Post, PostDetail } from '@portfolio/types'
import { assertClientPost, mapClientPost, mapPost } from './mappers/postMapper'
import { getSanityClient } from './sanityClient'

function toPostSummary(postDetail: PostDetail): Post {
	const { blocks: _blocks, ...post } = postDetail
	return post
}

export async function loadPosts(): Promise<Post[]> {
	const rawPosts = await getSanityClient().fetch<unknown[]>(publishedPostsQuery)

	return rawPosts.map((rawPost) => toPostSummary(mapClientPost(assertClientPost(rawPost))))
}

export async function loadPost(slug: string): Promise<PostDetail> {
	return mapPost(await getSanityClient().fetch<unknown>(postBySlugQuery, { slug }))
}
