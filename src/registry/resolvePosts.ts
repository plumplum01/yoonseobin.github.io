import { postBySlugQuery, publishedPostsQuery, publishedReelsQuery } from '@portfolio/sanity/queries'
import type { Post, PostDetail } from '@portfolio/types'
import { parsePost, parsePostSummary } from '@/registry/mappers/parsePost'
import { getSanityClient } from '@/registry/sanityClient'

export async function resolvePosts(): Promise<Post[]> {
	const rawPosts = await getSanityClient().fetch<unknown[]>(publishedPostsQuery)
	return rawPosts.map(parsePostSummary)
}

export async function resolveReels(): Promise<Post[]> {
	const rawPosts = await getSanityClient().fetch<unknown[]>(publishedReelsQuery)
	return rawPosts.map(parsePostSummary)
}

export async function resolvePost(slug: string): Promise<PostDetail> {
	return parsePost(await getSanityClient().fetch<unknown>(postBySlugQuery, { slug }))
}
