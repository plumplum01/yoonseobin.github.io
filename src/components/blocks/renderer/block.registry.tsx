import type { ComponentType } from 'react'
import type { PostBlock } from '@portfolio/types'
import { CarouselBlock } from '../post/CarouselBlock'
import { getPortableTextParagraphs } from './portableText'

type BlockComponent<TBlock extends PostBlock = PostBlock> = ComponentType<{ block: TBlock }>
type RegisteredBlockComponent = ComponentType<{ block: PostBlock }>

type BlockRegistry = {
  [TType in PostBlock['type']]: BlockComponent<Extract<PostBlock, { type: TType }>>
}

function TextBlock({ block }: { block: Extract<PostBlock, { type: 'text' }> }) {
  const paragraphs = getPortableTextParagraphs(block.body)

  return (
    <div className="space-y-5">
      {paragraphs.map((paragraph, index) => (
        <p
          key={`${paragraph.slice(0, 24)}-${index}`}
          className="text-body font-medium leading-loose tracking-tight text-cjk text-[var(--text-primary)]"
        >
          {paragraph}
        </p>
      ))}
    </div>
  )
}

function HeadingBlock({ block }: { block: Extract<PostBlock, { type: 'heading' }> }) {
  const HeadingTag = `h${block.level}` as const
  const className =
    block.level === 2
      ? 'text-section-heading font-semibold leading-tight tracking-heading'
      : 'text-body font-semibold leading-tight tracking-tight'

  return <HeadingTag className={`${className} text-cjk text-[var(--text-primary)]`}>{block.text}</HeadingTag>
}

function QuoteBlock({ block }: { block: Extract<PostBlock, { type: 'quote' }> }) {
  return (
    <figure className="border-l border-[var(--text-primary)]/30 pl-5">
      <blockquote className="text-body font-medium leading-loose tracking-tight text-cjk text-[var(--text-primary)]">
        {block.text}
      </blockquote>
      {block.attribution && (
        <figcaption className="mt-3 text-caption font-medium leading-tight tracking-caption text-[var(--caption-gray)]">
          {block.attribution}
        </figcaption>
      )}
    </figure>
  )
}

function ImageBlock({ block }: { block: Extract<PostBlock, { type: 'image' }> }) {
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

function VideoBlock({ block }: { block: Extract<PostBlock, { type: 'video' }> }) {
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

export const blockRegistry = {
  text: TextBlock as RegisteredBlockComponent,
  heading: HeadingBlock as RegisteredBlockComponent,
  quote: QuoteBlock as RegisteredBlockComponent,
  image: ImageBlock as RegisteredBlockComponent,
  carousel: CarouselBlock as RegisteredBlockComponent,
  video: VideoBlock as RegisteredBlockComponent,
} satisfies Record<keyof BlockRegistry, RegisteredBlockComponent>
