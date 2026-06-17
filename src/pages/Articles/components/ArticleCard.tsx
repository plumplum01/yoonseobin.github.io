import type { Post } from '@portfolio/types'
import { motion } from 'framer-motion'
import type { HTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import { ContentHeading } from '@/components/ui'
import { staggerItemVariants } from '@/features/animation/staggerPresets'

export default function ArticleCard({ post, index }: { post: Post; index: number }) {
	const isPriority = index < 2

	return (
		<motion.article key={post.id} variants={staggerItemVariants}>
			<Link className="flex flex-col gap-1" to={`/articles/${post.slug}`}>
				<div className="group relative aspect-portrait w-full grid place-items-center rounded-4xl overflow-hidden">
					<div className="size-full group-hover:scale-[1.02] [--extra-transition:scale_150ms_ease-out]">
						<img
							src={post.thumbnailUrl}
							alt={post.title}
							loading={isPriority ? 'eager' : 'lazy'}
							decoding="async"
							fetchPriority={isPriority ? 'high' : 'auto'}
							className="size-full object-cover"
						/>
					</div>

					<div className="absolute inset-0 grid place-items-center">
						<ArticleHeader post={post} index={index} />
					</div>
				</div>
			</Link>
		</motion.article>
	)
}

function ArticleHeader({
	post,
	index,
	...props
}: { post: Post; index: number } & HTMLAttributes<HTMLElement>) {
	const description = post.subtitle ?? post.summary

	return (
		<section
			className="p-6 px-8 pb-9 max-w-80 rounded-4xl backdrop-blur-3xl bg-black/20"
			{...props}
		>
			<ContentHeading
				label={`POST ${index + 1}`}
				title={post.title}
				description={description}
			/>
		</section>
	)
}
