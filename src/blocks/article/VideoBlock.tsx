import type { PostBlock } from '@portfolio/types'
import type { BlockSurface } from '@/blocks/BlockInstance'
import { MediaFrame } from '@/blocks/article/MediaFrame'

export function VideoBlock({
	block,
	surface,
}: {
	block: Extract<PostBlock, { type: 'video' }>
	surface?: BlockSurface
}) {
	return (
		<figure className="space-y-3">
			<MediaFrame aspectRatio={block.aspectRatio} surface={surface}>
				<video
					className="size-full object-cover"
					src={block.media.url}
					playsInline
					autoPlay
					muted
					loop
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
