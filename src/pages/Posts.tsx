import type { Post } from '@portfolio/types'
import { Link, useLoaderData } from 'react-router-dom'
import { formatKoDate } from '../lib/dateFormat'

function PostsStatus({ message }: { message: string }) {
	return (
		<main className="mx-auto box-border min-h-screen w-full max-w-5xl px-6 pt-28 pb-20">
			<p className="text-body font-medium leading-loose tracking-tight text-cjk text-[var(--text-primary)]">
				{message}
			</p>
		</main>
	)
}

function formatPostDate(post: Post): string {
	if (!post.publishedAt) return 'Unpublished'
	return formatKoDate(post.publishedAt, 'medium')
}

export default function Posts() {
	const posts = useLoaderData() as Post[]

	if (posts.length === 0) return <PostsStatus message="No published posts yet." />

	return (
		<main className="mx-auto box-border min-h-screen w-full max-w-5xl px-6 pt-28 pb-20">
			<h1 className="text-section-heading font-semibold leading-tight tracking-heading text-[var(--text-primary)]">
				Posts
			</h1>

			<div className="mt-12 divide-y divide-[var(--text-primary)]/15">
				{posts.map((post) => (
					<article key={post.id} className="py-8 first:pt-0">
						<Link className="group block" to={`/posts/${post.slug}`}>
							<p className="text-caption font-medium leading-tight tracking-caption text-[var(--caption-gray)]">
								{formatPostDate(post)}
							</p>
							<h2 className="mt-3 text-body font-semibold leading-tight tracking-tight text-cjk text-[var(--text-primary)] group-hover:underline">
								{post.title}
							</h2>
							{post.summary && (
								<p className="mt-3 max-w-3xl text-body font-medium leading-loose tracking-tight text-cjk text-[var(--caption-gray)]">
									{post.summary}
								</p>
							)}
						</Link>
					</article>
				))}
			</div>
		</main>
	)
}
