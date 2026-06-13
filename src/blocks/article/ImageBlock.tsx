import type { PostBlock } from '@portfolio/types'
import type { BlockSurface } from '@/blocks/BlockInstance'
import { MediaFrame } from '@/blocks/article/MediaFrame'

export function ImageBlock({
	block,
	surface,
}: {
	block: Extract<PostBlock, { type: 'image' }>
	surface?: BlockSurface
}) {
	return (
		<figure className="space-y-3">
			<MediaFrame aspectRatio={block.aspectRatio} surface={surface}>
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
