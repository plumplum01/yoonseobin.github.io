import type { PostBlock } from '@portfolio/types'
import { BlockRenderer } from '@/blocks/BlockRenderer'

export function BlockInstance({ blocks }: { blocks: PostBlock[] }) {
	return (
		<>
			{blocks.map((block, index) => (
				<section key={`${block.type}-${index}`} data-block={block.type}>
					<BlockRenderer block={block} />
				</section>
			))}
		</>
	)
}
