import type { PostBlock } from '@portfolio/types'
import { MediaFrame } from '@/components/blocks/article/MediaFrame'

export function VideoBlock({ block }: { block: Extract<PostBlock, { type: 'video' }> }) {
	return (
		<figure className="space-y-3">
			<MediaFrame aspectRatio={block.aspectRatio}>
				<video
					className="size-full object-cover"
					src={block.media.url}
					controls
					playsInline
					preload="metadata"
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
