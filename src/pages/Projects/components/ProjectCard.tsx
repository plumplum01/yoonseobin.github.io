import type { Post } from '@portfolio/types'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { staggerItemVariants } from '@/features/animation/staggerPresets'

export default function ProjectCard({ post }: { post: Post }) {
	return (
		<motion.article key={post.id} variants={staggerItemVariants}>
			<Link className="flex flex-col gap-1" to={`/projects/${post.slug}`}>
				<div className="relative aspect-video w-full grid place-items-center rounded-2xl overflow-hidden">
					<img
						src={post.thumbnailUrl}
						alt={post.title}
						loading="lazy"
						decoding="async"
						className="size-full object-cover"
					/>
				</div>
			</Link>
		</motion.article>
	)
}
