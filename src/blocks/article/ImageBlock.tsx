import type { PostBlock } from '@portfolio/types'
import { MediaFrame } from '@/blocks/article/MediaFrame'

export function ImageBlock({ block }: { block: Extract<PostBlock, { type: 'image' }> }) {
	return (
		<figure className="space-y-3">
			<MediaFrame
				aspectRatio={block.aspectRatio}
				naturalAspectRatio={block.media.dimensions?.aspectRatio}
			>
				<img
					className="size-full object-cover"
					src={block.media.url}
					alt={block.media.alt ?? block.media.caption ?? block.media.title}
					loading="lazy"
				/>
			</MediaFrame>
			{block.media.caption && (
				<figcaption className="text-caption font-medium leading-tight tracking-caption text-[var(--caption-gray)]">
					{block.media.caption}
				</figcaption>
			)}
		</figure>
	)
}
