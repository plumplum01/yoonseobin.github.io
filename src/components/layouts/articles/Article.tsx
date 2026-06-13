import type { Post } from '@portfolio/types'
import { Link } from 'react-router-dom'
import { formatKoDate } from '@/lib/dateFormat'

export default function Article({ post }: { post: Post }) {
	return (
		<article key={post.id}>
			<Link className="flex flex-col gap-1" to={`/articles/${post.slug}`}>
				<div className="relative aspect-square w-full grid place-item-center rounded-2xl overflow-hidden">
					<img
						src={post.thumbnailUrl}
						alt={post.title}
						loading="lazy"
						decoding="async"
						className="size-full object-cover"
					/>
					<ArticleHeader post={post} className="absolute top-0 left-0 p-6" />
				</div>
			</Link>
		</article>
	)
}

function ArticleHeader({ post, ...props }: { post: Post }) {
	const date = formatKoDate(post.publishedAt, 'medium')
	const description = post.subtitle ?? post.summary

	return (
		<section {...props}>
			<hgroup className="flex flex-col items-start  text-white mix-blend-difference">
				<h2 className="font-bold text-base text-cjk">{post.title}</h2>
				{description && <p>{description}</p>}
			</hgroup>
			<div className="flex">
				<p className="text-body text-neutral-500">{date}</p>
			</div>
		</section>
	)
}
