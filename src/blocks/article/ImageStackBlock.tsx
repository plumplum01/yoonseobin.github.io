import type { PostBlock } from '@portfolio/types'
import type { BlockSurface } from '@/blocks/BlockInstance'
import { MediaFrame } from '@/blocks/article/MediaFrame'

export function ImageStackBlock({
	block,
	surface,
}: {
	block: Extract<PostBlock, { type: 'imageStack' }>
	surface?: BlockSurface
}) {
	return (
		<div className="flex w-full flex-col gap-4">
			{block.mediaItems.map((media) => (
				<figure key={media.id} className="w-full">
					<MediaFrame aspectRatio="video" surface={surface}>
						<img
							className="size-full object-cover"
							src={media.url}
							alt={media.alt ?? media.caption ?? media.title}
							loading="lazy"
						/>
					</MediaFrame>
					{media.caption && (
						<figcaption className="mt-3 text-caption font-medium leading-tight tracking-caption text-[var(--caption-gray)]">
							{media.caption}
						</figcaption>
					)}
				</figure>
			))}
		</div>
	)
}
