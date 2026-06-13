import type { PostDetail } from '@portfolio/types'
import { useLoaderData } from 'react-router-dom'
import { PostText } from '@/components/blocks/PostText'
import { BlockList } from '@/features/block-renderer'
import { formatKoDate } from '@/lib/dateFormat'

function ReelHeader({ reel }: { reel: PostDetail }) {
	const date = reel.publishedAt ? formatKoDate(reel.publishedAt, 'medium') : undefined

	return (
		<header className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4">
			<div className="flex flex-col gap-1">
				{date && (
					<p className="text-caption font-medium leading-tight tracking-caption text-[var(--caption-gray)]">
						{date}
					</p>
				)}
				<h2 className="text-2xl font-semibold leading-tight text-cjk text-white">
					{reel.title}
				</h2>
			</div>
			{reel.summary && <PostText className="max-w-none">{reel.summary}</PostText>}
		</header>
	)
}

function ReelItem({ reel }: { reel: PostDetail }) {
	return (
		<article className="flex flex-col gap-8 border-b border-neutral-800 py-16 last:border-b-0">
			<ReelHeader reel={reel} />
			<div className="flex flex-col items-center gap-4 md:gap-12">
				<BlockList blocks={reel.blocks} />
			</div>
		</article>
	)
}

export default function Reels() {
	const reels = useLoaderData() as PostDetail[]

	return (
		<main className="min-h-screen bg-black pt-28 pb-20">
			<section className="mx-auto flex w-full max-w-5xl flex-col">
				{reels.map((reel) => (
					<ReelItem key={reel.id} reel={reel} />
				))}
			</section>
		</main>
	)
}
