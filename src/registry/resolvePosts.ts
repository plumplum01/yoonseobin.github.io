import { postBySlugQuery, publishedPostsQuery } from '@portfolio/sanity/queries'
import type { Post, PostDetail } from '@portfolio/types'
import { parsePost, parsePostSummary } from '@/registry/mappers/parsePost'
import { getSanityClient } from '@/registry/sanityClient'

const allPublishedPostTypes = ['project', 'article', 'reel', 'blog'] as const

async function resolvePostSummaries(types: readonly string[]): Promise<Post[]> {
	const rawPosts = await getSanityClient().fetch<unknown[]>(publishedPostsQuery(), { types })
	return rawPosts.map(parsePostSummary)
}

async function resolvePostDetails(types: readonly string[]): Promise<PostDetail[]> {
	const rawPosts = await getSanityClient().fetch<unknown[]>(
		publishedPostsQuery({ includeBlocks: true }),
		{ types },
	)
	return rawPosts.map(parsePost)
}

export async function resolvePosts(): Promise<Post[]> {
	return resolvePostSummaries(allPublishedPostTypes)
}

export async function resolveReels(): Promise<PostDetail[]> {
	return resolvePostDetails(['reel'])
}

export async function resolvePost(slug: string): Promise<PostDetail> {
	return parsePost(await getSanityClient().fetch<unknown>(postBySlugQuery, { slug }))
}
