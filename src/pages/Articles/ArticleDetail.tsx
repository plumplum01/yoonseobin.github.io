import type { PostDetail as PostDetailModel } from '@portfolio/types'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import { BlockInstance } from '@/blocks'
import { ArticleText } from '@/blocks/ArticleText'
import { detailHeaderVariants, detailThumbnailVariants } from '@/features/animation/staggerPresets'
import { formatKoDate } from '@/lib/dateFormat'

function formatPublishedDate(article: PostDetailModel): string | undefined {
	if (!article.publishedAt) return undefined
	return formatKoDate(article.publishedAt, 'long')
}

function ArticleHeader({ article }: { article: PostDetailModel }) {
	const publishedDate = formatPublishedDate(article)
	return (
		<motion.header
			className="absolute bottom-12 left-8 max-w-4xl flex flex-col gap-4 items-start text-white mix-blend-difference"
			variants={detailHeaderVariants}
		>
			{publishedDate && <p className="text-sm font-medium">{publishedDate}</p>}
			<hgroup className="flex flex-col gap-16 items-start">
				<h1 className="text-6xl font-medium text-start text-cjk">{article.title}</h1>
			</hgroup>
		</motion.header>
	)
}

function ArticleThumbnail({ article }: { article: PostDetailModel }) {
	return (
		<div>
			<img
				src={article.thumbnailUrl}
				alt={article.title}
				loading="eager"
				decoding="async"
				fetchPriority="high"
				className="size-full object-contain"
			/>
		</div>
	)
}

export default function ArticleDetail() {
	const article = useLoaderData() as PostDetailModel

	useEffect(() => {
		window.scrollTo({ top: 0, left: 0 })
	}, [])

	return (
		<>
			<motion.figure
				className="relative aspect-square w-fullgrid place-item-center overflow-hidden"
				initial="hidden"
				animate="show"
				variants={detailThumbnailVariants}
			>
				<ArticleHeader article={article} />
				<ArticleThumbnail article={article} />
			</motion.figure>
			<main className="mx-auto min-h-screen w-screen pt-28 pb-20 bg-black">
				<article className="flex flex-col items-center justify-center gap-4 md:gap-24">
					<ArticleText> {article.summary}</ArticleText>
					<BlockInstance blocks={article.blocks} />
				</article>
			</main>
		</>
	)
}
