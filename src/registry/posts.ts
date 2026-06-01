import { postBySlugQuery, publishedPostsQuery } from '@portfolio/sanity/queries'
import type { Post, PostDetail } from '@portfolio/types'
import { assertClientPost, resolveClientPost, resolvePost } from './resolvers/postResolver'
import { getSanityClient } from './sanityClient'

function toPostSummary(postDetail: PostDetail): Post {
  const { blocks: _blocks, ...post } = postDetail
  return post
}

export async function getPublishedPosts(): Promise<Post[]> {
  const rawPosts = await getSanityClient().fetch<unknown[]>(publishedPostsQuery)

  return rawPosts.map((rawPost) => toPostSummary(resolveClientPost(assertClientPost(rawPost))))
}

export async function getPostBySlug(slug: string): Promise<PostDetail> {
  return resolvePost(await getSanityClient().fetch<unknown>(postBySlugQuery, { slug }))
}
