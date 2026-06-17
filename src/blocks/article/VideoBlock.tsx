import type { PostBlock } from '@portfolio/types'
import { MediaFrame } from '@/blocks/article/MediaFrame'
import { ViewportVideo } from '@/blocks/article/ViewportVideo'

export function VideoBlock({
	block,
	priority = false,
}: {
	block: Extract<PostBlock, { type: 'video' }>
	priority?: boolean
}) {
	return (
		<figure className="space-y-3">
			<MediaFrame
				aspectRatio={block.aspectRatio}
				naturalAspectRatio={block.media.dimensions?.aspectRatio}
			>
				<ViewportVideo
					className="size-full object-cover"
					src={block.media.url}
					loop
					preload={priority ? 'auto' : 'metadata'}
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
