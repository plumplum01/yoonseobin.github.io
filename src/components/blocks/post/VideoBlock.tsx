import type { PostBlock } from '@portfolio/types'

export function VideoBlock({ block }: { block: Extract<PostBlock, { type: 'video' }> }) {
  return (
    <figure className="space-y-3">
      <video className="w-full rounded-sm" src={block.media.url} controls playsInline preload="metadata">
        <track kind="captions" />
      </video>
      {block.media.caption && (
        <figcaption className="text-caption font-medium leading-tight tracking-caption text-[var(--caption-gray)]">
          {block.media.caption}
        </figcaption>
      )}
    </figure>
  )
}
