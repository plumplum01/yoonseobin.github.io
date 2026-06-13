import type { PostDetail } from '@portfolio/types'
import { motion } from 'framer-motion'
import { BlockInstance } from '@/blocks'
import { ArticleText } from '@/blocks/ArticleText'
import { staggerItemVariants } from '@/features/animation/staggerPresets'
import { formatKoDate } from '@/lib/dateFormat'

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

export function ReelItem({ reel }: { reel: PostDetail }) {
	return (
		<motion.article className="flex w-full flex-col gap-1" variants={staggerItemVariants}>
			<div className="flex w-full flex-col items-center gap-4 md:gap-12">
				<BlockInstance blocks={reel.blocks} />
			</div>
			<ReelHeader reel={reel} />
		</motion.article>
	)
}
