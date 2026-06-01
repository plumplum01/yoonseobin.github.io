import type { PostBlock } from '@portfolio/types'

export function ImageBlock({ block }: { block: Extract<PostBlock, { type: 'image' }> }) {
  return (
    <figure className="space-y-3">
      <img
        className="w-full rounded-sm object-cover"
        src={block.media.url}
        alt={block.media.alt ?? block.media.caption ?? ''}
        loading="lazy"
      />
      {block.media.caption && (
        <figcaption className="text-caption font-medium leading-tight tracking-caption text-[var(--caption-gray)]">
          {block.media.caption}
        </figcaption>
      )}
    </figure>
  )
}
