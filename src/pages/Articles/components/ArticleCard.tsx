import type { Post } from '@portfolio/types'
import { motion } from 'framer-motion'
import type { HTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import { staggerItemVariants } from '@/features/animation/staggerPresets'

export default function ArticleCard({ post }: { post: Post }) {
	return (
		<motion.article key={post.id} variants={staggerItemVariants}>
			<Link className="flex flex-col gap-1" to={`/articles/${post.slug}`}>
				<div className="group relative aspect-portrait w-full grid place-items-center rounded-4xl overflow-hidden">
					<div className="size-full group-hover:scale-[1.02] [--extra-transition:scale_150ms_ease-out]">
						<img
							src={post.thumbnailUrl}
							alt={post.title}
							loading="lazy"
							decoding="async"
							className="size-full object-cover"
						/>
					</div>

					<div className="absolute inset-0 grid place-items-center">
						<ArticleHeader post={post} />
					</div>
				</div>
			</Link>
		</motion.article>
	)
}

function ArticleHeader({ post, ...props }: { post: Post } & HTMLAttributes<HTMLElement>) {
	const description = post.subtitle ?? post.summary

	return (
		<section
			className="p-6 px-8 pb-9 max-w-80 rounded-4xl backdrop-blur-3xl bg-black/20"
			{...props}
		>
			<p className="flex items-center gap-2 pb-4">
				<span className="inline-block min-w-1 aspect-square bg-white" />
				<span className="font-mono text-xxs text-white uppercase">article</span>
			</p>

			<hgroup className="flex flex-col gap-1 justify-start items-start  text-white">
				<h2 className="text-base text-cjk text-start">{post.title}</h2>
				{description && (
					<p className="font-mono text-xs text-start text-white/40">{description}</p>
				)}
			</hgroup>
		</section>
	)
}
