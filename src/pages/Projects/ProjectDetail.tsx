import type { PostDetail as PostDetailModel } from '@portfolio/types'
import { useLoaderData } from 'react-router-dom'
import { BlockInstance } from '@/blocks'
import { ArticleText } from '@/blocks/ArticleText'

function ProjectThumbnail({ project }: { project: PostDetailModel }) {
	return (
		<div>
			<img
				src={project.thumbnailUrl}
				alt={project.title}
				decoding="async"
				className="size-full object-contain"
			/>
		</div>
	)
}

export default function ProjectDetail() {
	const project = useLoaderData() as PostDetailModel

	return (
		<>
			<figure className="relative w-fullgrid place-item-center overflow-hidden">
				<ProjectThumbnail project={project} />
			</figure>
			<main className="mx-auto min-h-screen w-screen bg-black">
				<article className="flex flex-col items-center">
					<ArticleText> {project.summary}</ArticleText>
					<BlockInstance blocks={project.blocks} />
				</article>
			</main>
		</>
	)
}
