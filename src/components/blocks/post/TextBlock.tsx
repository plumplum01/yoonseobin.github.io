import type { PostBlock } from '@portfolio/types'
import { getPortableTextParagraphs } from '../../../features/post-block-renderer/helpers/portableText'

export function TextBlock({ block }: { block: Extract<PostBlock, { type: 'text' }> }) {
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
