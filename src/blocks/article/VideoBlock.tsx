import type { PostBlock } from '@portfolio/types'
import { MediaFrame } from '@/blocks/article/MediaFrame'

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
				<video
					className="size-full object-cover"
					src={block.media.url}
					playsInline
					autoPlay
					muted
					loop
					preload={priority ? 'auto' : 'metadata'}
				>
					<track kind="captions" />
				</video>
			</MediaFrame>
			{block.media.caption && (
				<figcaption className="text-caption font-medium leading-tight tracking-caption text-[var(--caption-gray)]">
					{block.media.caption}
				</figcaption>
			)}
		</figure>
	)
}
