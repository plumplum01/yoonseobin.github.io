import type { Post } from '@portfolio/types'
import { motion } from 'framer-motion'
import { useLoaderData } from 'react-router-dom'
import { staggerListVariants } from '@/features/animation/staggerPresets'
import ProjectCard from '@/pages/Projects/components/ProjectCard'

export default function Projects() {
	const projects = useLoaderData() as Post[]
	return (
		<main className="box-border min-h-screen w-full p-4 pt-28">
			<motion.div
				className="grid grid-cols-1 gap-4"
				variants={staggerListVariants}
				initial="hidden"
				animate="show"
			>
				{projects.map((project) => (
					<ProjectCard key={project.id} post={project} />
				))}
			</motion.div>
		</main>
	)
}
