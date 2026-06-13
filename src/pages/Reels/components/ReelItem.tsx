import type { PostDetail } from '@portfolio/types'
import type { Variants } from 'framer-motion'
import { motion } from 'framer-motion'
import { lazy, Suspense } from 'react'
import { ArticleText } from '@/blocks/ArticleText'
import { Skeleton } from '@/components/ui'
import { formatKoDate } from '@/lib/dateFormat'

const ReelBlockInstance = lazy(() => import('@/pages/Reels/ReelBlocks'))

export const reelItemVariants: Variants = {
	hidden: {
		opacity: 0,
		y: 18,
		scale: 0.98,
	},
	show: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: 0.45,
			ease: [0.22, 1, 0.36, 1],
		},
	},
}

function ReelHeader({ reel }: { reel: PostDetail }) {
	const date = reel.publishedAt ? formatKoDate(reel.publishedAt, 'medium') : undefined

	return (
		<header className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4">
			<div className="flex flex-col gap-1">
				{date && (
					<p className="text-caption font-mono leading-tight tracking-caption">{date}</p>
				)}
				<h2 className="text-caption font-mono leading-tight tracking-caption">
					{reel.title}
				</h2>
			</div>
			{reel.summary && <ArticleText className="max-w-none">{reel.summary}</ArticleText>}
		</header>
	)
}

function ReelBlockSkeleton() {
	return (
		<div className="flex w-full flex-col gap-4" aria-hidden="true">
			<Skeleton className="aspect-video w-full rounded" />
			<Skeleton className="h-3 w-3/5 rounded" />
		</div>
	)
}

export function ReelItem({ reel }: { reel: PostDetail }) {
	return (
		<motion.article className="flex flex-col gap-1" variants={reelItemVariants}>
			<div className="flex flex-col items-center gap-4 md:gap-12">
				<Suspense fallback={<ReelBlockSkeleton />}>
					<ReelBlockInstance blocks={reel.blocks} surface="reels" />
				</Suspense>
			</div>
			<ReelHeader reel={reel} />
		</motion.article>
	)
}
