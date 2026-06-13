import type { PostDetail as PostDetailModel } from '@portfolio/types'
import { useLoaderData } from 'react-router-dom'
import { ArticleText } from '@/components/blocks/ArticleText'
import { BlockList } from '@/features/block-renderer'
import { formatKoDate } from '@/lib/dateFormat'

function formatPublishedDate(article: PostDetailModel): string | undefined {
	if (!article.publishedAt) return undefined
	return formatKoDate(article.publishedAt, 'long')
}

function ArticleHeader({ article }: { article: PostDetailModel }) {
	const publishedDate = formatPublishedDate(article)
	return (
		<header className="absolute bottom-12 left-8 max-w-4xl flex flex-col items-start text-white mix-blend-difference">
			{publishedDate && <p className="text-sm font-medium">{publishedDate}</p>}
			<hgroup className="flex flex-col gap-16 items-start">
				<h1 className="text-6xl font-medium text-start">{article.title}</h1>
			</hgroup>
		</header>
	)
}

function ArticleThumbnail({ article }: { article: PostDetailModel }) {
	return (
		<div>
			<img
				src={article.thumbnailUrl}
				alt={article.title}
				decoding="async"
				className="size-full object-contain"
			/>
		</div>
	)
}

export default function ArticleDetail() {
	const article = useLoaderData() as PostDetailModel

	return (
		<>
			<figure className="relative aspect-square w-fullgrid place-item-center overflow-hidden">
				<ArticleHeader article={article} />
				<ArticleThumbnail article={article} />
			</figure>
			<main className="mx-auto min-h-screen w-screen pt-28 pb-20 bg-black">
				<article className="flex flex-col items-center gap-4 md:gap-24">
					<ArticleText> {article.summary}</ArticleText>
					<BlockList blocks={article.blocks} />
				</article>
			</main>
		</>
	)
}
