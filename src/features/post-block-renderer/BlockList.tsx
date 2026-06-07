import type { PostBlock } from '@portfolio/types'
import { BlockRenderer } from '@/features/post-block-renderer/BlockRenderer'

export function BlockList({ blocks }: { blocks: PostBlock[] }) {
	return (
		<>
			{blocks.map((block, index) => (
				<section key={`${block.type}-${index}`} data-post-block={block.type}>
					<BlockRenderer block={block} />
				</section>
			))}
		</>
	)
}
