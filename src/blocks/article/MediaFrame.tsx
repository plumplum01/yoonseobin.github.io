import type { ImageAspectRatio, MediaAspectRatio } from '@portfolio/types'
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
	aspectRatio: ImageAspectRatio
	children: ReactNode
	maxPadding?: number
	maxRadius?: number
	naturalAspectRatio?: number
}

export function MediaFrame({
	aspectRatio,
	children,
	maxPadding = 24,
	maxRadius = 32,
	naturalAspectRatio,
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
	const hasNaturalAspectRatio =
		aspectRatio === 'natural' &&
		typeof naturalAspectRatio === 'number' &&
		Number.isFinite(naturalAspectRatio) &&
		naturalAspectRatio > 0
	const forcedAspectRatioClassName =
		aspectRatio === 'natural'
			? hasNaturalAspectRatio
				? undefined
				: aspectRatioClassName.video
			: aspectRatioClassName[aspectRatio]

	return (
		<motion.div
			className={cn('w-full rounded', forcedAspectRatioClassName)}
			data-aspect-ratio={aspectRatio}
			data-surface={surface}
			ref={reference}
			style={{
				padding,
				...(hasNaturalAspectRatio ? { aspectRatio: naturalAspectRatio } : {}),
			}}
		>
			<motion.div className={cn('overflow-hidden size-full')} style={{ borderRadius }}>
				{children}
			</motion.div>
		</motion.div>
	)
}
