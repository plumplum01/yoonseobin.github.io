import type { PostBlock } from '@portfolio/types'
import { PostBlockRenderer } from './PostBlockRenderer'

export function PostBlocks({ blocks }: { blocks: PostBlock[] }) {
  return (
    <div className="space-y-10">
      {blocks.map((block, index) => (
        <section key={`${block.type}-${index}`} data-post-block={block.type}>
          <PostBlockRenderer block={block} />
        </section>
      ))}
    </div>
  )
}
