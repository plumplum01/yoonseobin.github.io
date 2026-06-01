import { Blocks } from '@portfolio/renderer'
import type { PostDetail as PostDetailModel } from '@portfolio/types'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPostBySlug } from '../registry/posts'

type PostState =
  | { status: 'loading' }
  | { status: 'success'; post: PostDetailModel }
  | { status: 'error'; message: string }

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Failed to load post'
}

function PostStatus({ message }: { message: string }) {
  return (
    <main className="mx-auto box-border min-h-screen w-full max-w-3xl px-6 pt-28 pb-20">
      <p className="text-body font-medium leading-loose tracking-tight text-cjk text-[var(--text-primary)]">
        {message}
      </p>
      <Link
        className="mt-8 inline-flex text-caption font-medium leading-tight tracking-caption text-[var(--caption-gray)] hover:underline"
        to="/posts"
      >
        Back to posts
      </Link>
    </main>
  )
}

function formatPublishedDate(post: PostDetailModel): string | undefined {
  if (!post.publishedAt) return undefined
  return new Intl.DateTimeFormat('ko-KR', { dateStyle: 'long' }).format(new Date(post.publishedAt))
}

export default function PostDetail() {
  const { slug } = useParams()
  const [postState, setPostState] = useState<PostState>({ status: 'loading' })

  useEffect(() => {
    let isActive = true

    if (!slug) {
      setPostState({ status: 'error', message: 'Post slug is missing' })
      return () => {
        isActive = false
      }
    }

    getPostBySlug(slug)
      .then((post) => {
        if (isActive) setPostState({ status: 'success', post })
      })
      .catch((error: unknown) => {
        if (isActive) setPostState({ status: 'error', message: getErrorMessage(error) })
      })

    return () => {
      isActive = false
    }
  }, [slug])

  if (postState.status === 'loading') return <PostStatus message="Post loading..." />
  if (postState.status === 'error') return <PostStatus message={postState.message} />

  const publishedDate = formatPublishedDate(postState.post)

  return (
    <main className="mx-auto box-border min-h-screen w-full max-w-3xl px-6 pt-28 pb-20">
      <article>
        <header className="mb-14">
          {publishedDate && (
            <p className="text-caption font-medium leading-tight tracking-caption text-[var(--caption-gray)]">
              {publishedDate}
            </p>
          )}
          <h1 className="mt-4 text-section-heading font-semibold leading-tight tracking-heading text-cjk text-[var(--text-primary)]">
            {postState.post.title}
          </h1>
          {postState.post.summary && (
            <p className="mt-5 text-body font-medium leading-loose tracking-tight text-cjk text-[var(--caption-gray)]">
              {postState.post.summary}
            </p>
          )}
        </header>

        <Blocks blocks={postState.post.blocks} />
      </article>
    </main>
  )
}
