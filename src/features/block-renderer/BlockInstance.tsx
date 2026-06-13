import type { PostBlock } from '@portfolio/types'
import { BlockRenderer } from '@/features/block-renderer/BlockRenderer'

export function BlockInstance({ blocks }: { blocks: PostBlock[] }) {
	return (
		<>
			{blocks.map((block, index) => (
				<section key={`${block.type}-${index}`} data-article-block={block.type}>
					<BlockRenderer block={block} />
				</section>
			))}
		</>
	)
}
