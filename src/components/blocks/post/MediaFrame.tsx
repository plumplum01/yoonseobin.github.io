import type { MediaAspectRatio } from '@portfolio/types'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useScrollPadding } from '@/hooks/useScrollPadding'
import { cn } from '@/lib/cn'

export const aspectRatioClassName: Record<MediaAspectRatio, string> = {
	portrait: 'aspect-[4/5]',
	square: 'aspect-square',
	video: 'aspect-video',
	wide: 'aspect-[21/9]',
}

type MediaFrameProps = {
	aspectRatio: MediaAspectRatio
	children: ReactNode
}

export function MediaFrame({ aspectRatio, children }: MediaFrameProps) {
	const { reference, borderRadius, padding } = useScrollPadding(38, 24)
	return (
		<motion.div
			className={cn('w-full rounded', aspectRatioClassName[aspectRatio])}
			ref={reference}
			style={{ padding }}
		>
			<motion.div className={cn('overflow-hidden size-full')} style={{ borderRadius }}>
				{children}
			</motion.div>
		</motion.div>
	)
}
