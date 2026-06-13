import type { PostBlock } from '@portfolio/types'

export function ImageStackBlock({ block }: { block: Extract<PostBlock, { type: 'imageStack' }> }) {
	return (
		<div className="flex w-full flex-col gap-4">
			{block.mediaItems.map((media) => (
				<figure key={media.id} className="w-full">
					<img
						className="w-full object-cover"
						src={media.url}
						alt={media.alt ?? media.caption ?? media.title}
						loading="lazy"
					/>
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
