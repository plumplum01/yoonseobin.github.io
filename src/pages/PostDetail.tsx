import type { PostDetail as PostDetailModel } from '@portfolio/types'
import { useLoaderData } from 'react-router-dom'
import { BlockList } from '../features/post-block-renderer'
import { formatKoDate } from '../lib/dateFormat'

function formatPublishedDate(post: PostDetailModel): string | undefined {
  if (!post.publishedAt) return undefined
  return formatKoDate(post.publishedAt, 'long')
}

export default function PostDetail() {
  const post = useLoaderData() as PostDetailModel
  const publishedDate = formatPublishedDate(post)

  return (
    <main className="mx-auto box-border min-h-screen w-full max-w-3xl px-6 pt-28 pb-20">
      <article>
        <header className="mb-14">
          {publishedDate && (
            <p className="text-caption font-medium leading-tight tracking-caption text-[var(--caption-gray)]">
              {publishedDate}
            </p>
          )}
          <h1 className="mt-4 text-section-heading font-semibold leading-tight tracking-heading text-cjk text-text-primary">
            {post.title}
          </h1>
          {post.summary && (
            <p className="mt-5 text-body font-medium leading-loose tracking-tight text-cjk text-[var(--caption-gray)]">
              {post.summary}
            </p>
          )}
        </header>

        <BlockList blocks={post.blocks} />
      </article>
    </main>
  )
}
