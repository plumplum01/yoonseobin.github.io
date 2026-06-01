import type {
  HeadingPostBlock,
  ImagePostBlock,
  PostBlock,
  QuotePostBlock,
  TextPostBlock,
  VideoPostBlock,
} from '@portfolio/types'
import { CarouselBlock } from './CarouselBlock'
import { getPortableTextParagraphs } from './portableText'

function TextBlock({ block }: { block: TextPostBlock }) {
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

function HeadingBlock({ block }: { block: HeadingPostBlock }) {
  const HeadingTag = `h${block.level}` as const
  const className =
    block.level === 2
      ? 'text-section-heading font-semibold leading-tight tracking-heading'
      : 'text-body font-semibold leading-tight tracking-tight'

  return <HeadingTag className={`${className} text-cjk text-[var(--text-primary)]`}>{block.text}</HeadingTag>
}

function QuoteBlock({ block }: { block: QuotePostBlock }) {
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

function ImageBlock({ block }: { block: ImagePostBlock }) {
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

function VideoBlock({ block }: { block: VideoPostBlock }) {
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

export function BlockRenderer({ block }: { block: PostBlock }) {
  switch (block.type) {
    case 'text':
      return <TextBlock block={block} />
    case 'heading':
      return <HeadingBlock block={block} />
    case 'quote':
      return <QuoteBlock block={block} />
    case 'image':
      return <ImageBlock block={block} />
    case 'carousel':
      return <CarouselBlock mediaItems={block.mediaItems} />
    case 'video':
      return <VideoBlock block={block} />
  }
}
