import type { PostDetail } from '@portfolio/types'
import { motion } from 'framer-motion'
import { useLoaderData } from 'react-router-dom'
import { staggerListVariants } from '@/features/animation/staggerPresets'
import { ReelItem } from '@/pages/Reels/components/ReelItem'

export default function Reels() {
	const reels = useLoaderData() as PostDetail[]

	return (
		<main className="min-h-screen pt-28 pb-20">
			<motion.section
				className="mx-auto gap-2 grid grid-cols-1 md:gap-0 md:grid-cols-2 w-screen flex-col"
				variants={staggerListVariants}
				initial="hidden"
				animate="show"
			>
				{reels.map((reel) => (
					<ReelItem key={reel.id} reel={reel} />
				))}
			</motion.section>
		</main>
	)
}
