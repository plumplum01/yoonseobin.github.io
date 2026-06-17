import type { PostBlock } from '@portfolio/types'
import { MediaFrame } from '@/blocks/article/MediaFrame'
import { ViewportVideo } from '@/blocks/article/ViewportVideo'
import { cn } from '@/lib/cn'

function getVideoObjectFitClassName(block: Extract<PostBlock, { type: 'video' }>) {
	return block.aspectRatio === 'natural' ? 'object-contain' : 'object-cover'
}

export function VideoBlock({ block }: { block: Extract<PostBlock, { type: 'video' }> }) {
	return (
		<figure className="space-y-3">
			<MediaFrame
				aspectRatio={block.aspectRatio}
				naturalAspectRatio={block.media.dimensions?.aspectRatio}
			>
				<ViewportVideo
					className={cn('size-full', getVideoObjectFitClassName(block))}
					src={block.media.url}
					loop
				>
					<track kind="captions" />
				</ViewportVideo>
			</MediaFrame>
			{block.media.caption && (
				<figcaption className="text-caption font-medium leading-tight tracking-caption text-[var(--caption-gray)]">
					{block.media.caption}
				</figcaption>
			)}
		</figure>
	)
}
