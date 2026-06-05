import type { MediaAspectRatio } from '@portfolio/types'
import type { ReactNode } from 'react'
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
	return (
		<div className={cn('w-full overflow-hidden rounded-sm', aspectRatioClassName[aspectRatio])}>
			{children}
		</div>
	)
}
