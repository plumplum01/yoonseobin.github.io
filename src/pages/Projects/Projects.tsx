import type { Post } from '@portfolio/types'
import { useLoaderData } from 'react-router-dom'
import ProjectCard from '@/pages/Projects/components/ProjectCard'

export default function Projects() {
	const projects = useLoaderData() as Post[]
	return (
		<main className="box-border min-h-screen w-full p-4 pt-28">
			<div className="grid grid-cols-2 gap-4">
				{projects.map((project) => (
					<ProjectCard key={project.id} post={project} />
				))}
			</div>
		</main>
	)
}
