import type { PostDetail as PostDetailModel } from '@portfolio/types'
import { useLoaderData } from 'react-router-dom'
import { ArticleText } from '@/components/blocks/ArticleText'
import { BlockList } from '@/features/block-renderer'
import { formatKoDate } from '@/lib/dateFormat'

function formatPublishedDate(project: PostDetailModel): string | undefined {
	if (!project.publishedAt) return undefined
	return formatKoDate(project.publishedAt, 'long')
}

function ProjectHeader({ project }: { project: PostDetailModel }) {
	const publishedDate = formatPublishedDate(project)
	return (
		<header className="absolute bottom-12 left-8 max-w-4xl flex flex-col items-start text-white mix-blend-difference">
			{publishedDate && <p className="text-sm font-medium">{publishedDate}</p>}
			<hgroup className="flex flex-col gap-16 items-start">
				<h1 className="text-6xl font-medium text-start">{project.title}</h1>
			</hgroup>
		</header>
	)
}

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
			<figure className="relative aspect-square w-fullgrid place-item-center overflow-hidden">
				<ProjectHeader project={project} />
				<ProjectThumbnail project={project} />
			</figure>
			<main className="mx-auto min-h-screen w-screen pt-28 pb-20 bg-black">
				<article className="flex flex-col items-center gap-4 md:gap-24">
					<ArticleText> {project.summary}</ArticleText>
					<BlockList blocks={project.blocks} />
				</article>
			</main>
		</>
	)
}
