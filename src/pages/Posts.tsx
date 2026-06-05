import type { Post } from '@portfolio/types'
import { Link, useLoaderData } from 'react-router-dom'
import { formatKoDate } from '@/lib/dateFormat'

function formatPostDate(post: Post): string {
	if (!post.publishedAt) return 'Unpublished'
	return formatKoDate(post.publishedAt, 'medium')
}

export default function Posts() {
	const posts = useLoaderData() as Post[]
	return (
		<main className="box-border min-h-screen w-full pt-28 ">
			<div className="grid grid-cols-1 gap-8">
				{posts.map((post) => (
					<PostElement key={post.id} post={post} />
				))}
			</div>
		</main>
	)
}

function PostElement({ post }: { post: Post }) {
	return (
		<article key={post.id}>
			<Link className="flex flex-col gap-1" to={`/posts/${post.slug}`}>
				<div className="aspect-video border w-full grid place-item-center rounded-sm"></div>
				<div className="flex justify-between items-start">
					<hgroup className="flex flex-col items-start gap-3">
						<h2 className="font-bold text-base text-cjk text-text-primary">{post.title}</h2>
						<h2 className="font-bold text-xs text-cjk text-text-primary">제목입니다</h2>
					</hgroup>
					<div className="flex">
						<p className="text-body text-neutral-500">{formatPostDate(post)}</p>
						<p className="text-body text-neutral-500">5 min read</p>
					</div>
				</div>
			</Link>
		</article>
	)
}
