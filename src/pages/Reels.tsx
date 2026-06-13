import type { PostDetail } from '@portfolio/types'
import { useLoaderData } from 'react-router-dom'
import { ArticleText } from '@/components/blocks/ArticleText'
import { BlockList } from '@/features/block-renderer'
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

function ReelItem({ reel }: { reel: PostDetail }) {
	return (
		<article className="flex flex-col gap-1">
			<div className="flex flex-col items-center gap-4 md:gap-12">
				<BlockList blocks={reel.blocks} />
			</div>
			<ReelHeader reel={reel} />
		</article>
	)
}

export default function Reels() {
	const reels = useLoaderData() as PostDetail[]

	return (
		<main className="min-h-screen pt-28 pb-20">
			<section className="mx-auto grid grid-cols-2 w-screen flex-col">
				{reels.map((reel) => (
					<ReelItem key={reel.id} reel={reel} />
				))}
			</section>
		</main>
	)
}
