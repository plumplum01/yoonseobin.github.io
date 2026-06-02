import type { Post } from '@portfolio/types'
import { Link, useLoaderData } from 'react-router-dom'
import { formatKoDate } from '../lib/dateFormat'

function formatPostDate(post: Post): string {
	if (!post.publishedAt) return 'Unpublished'
	return formatKoDate(post.publishedAt, 'medium')
}

export default function Posts() {
	const posts = useLoaderData() as Post[]
	console.log(posts)
	return (
		<main className="box-border min-h-screen w-full pt-28">
			<div className="flex flex-col items-center">
				{posts.map((post) => (
					<PostElement key={post.id} post={post} />
				))}
			</div>
		</main>
	)
}

function PostElement({ post }: { post: Post }) {
	return (
		<article
			key={post.id}
			className="aspect-video border w-full grid place-item-center rounded-sm"
		>
			<Link className="flex justify-center items-center gap-3" to={`/posts/${post.slug}`}>
				<p className="text-body text-neutral-500">{formatPostDate(post)}</p>
				<h2 className="text-body font-semibold text-cjk text-text-primary">{post.title}</h2>
				{post.summary && (
					<p className="text-body text-cjk text-neutral-500">{post.summary}</p>
				)}
			</Link>
		</article>
	)
}
