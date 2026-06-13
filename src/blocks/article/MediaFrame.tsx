import type { MediaAspectRatio } from '@portfolio/types'
import { motion, useTransform } from 'framer-motion'
import type { ReactNode } from 'react'
import { useSurface } from '@/context/SurfaceProvider'
import { MEDIA_SCROLL_PROGRESS, useScrollMediaProgress } from '@/hooks/useScrollMediaProgress'
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
	maxPadding?: number
	maxRadius?: number
}

export function MediaFrame({
	aspectRatio,
	children,
	maxPadding = 24,
	maxRadius = 32,
}: MediaFrameProps) {
	const surface = useSurface()
	const { reference, scrollYProgress } = useScrollMediaProgress()
	const padding = useTransform(scrollYProgress, MEDIA_SCROLL_PROGRESS, [
		maxPadding,
		0,
		0,
		maxPadding,
	])
	const borderRadius = useTransform(scrollYProgress, MEDIA_SCROLL_PROGRESS, [
		maxRadius,
		0,
		0,
		maxRadius,
	])

	return (
		<motion.div
			className={cn('w-full rounded', aspectRatioClassName[aspectRatio])}
			data-surface={surface}
			ref={reference}
			style={{ padding }}
		>
			<motion.div className={cn('overflow-hidden size-full')} style={{ borderRadius }}>
				{children}
			</motion.div>
		</motion.div>
	)
}
