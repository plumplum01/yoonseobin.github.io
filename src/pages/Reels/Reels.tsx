import type { PostDetail } from '@portfolio/types'
import type { Variants } from 'framer-motion'
import { motion } from 'framer-motion'
import { useLoaderData } from 'react-router-dom'
import { ReelItem } from '@/pages/Reels/components/ReelItem'

const reelListVariants: Variants = {
	hidden: {},
	show: {
		transition: {
			staggerChildren: 0.08,
			delayChildren: 0.12,
		},
	},
}

export default function Reels() {
	const reels = useLoaderData() as PostDetail[]

	return (
		<main className="min-h-screen pt-28 pb-20">
			<motion.section
				className="mx-auto grid grid-cols-2 w-screen flex-col"
				variants={reelListVariants}
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
