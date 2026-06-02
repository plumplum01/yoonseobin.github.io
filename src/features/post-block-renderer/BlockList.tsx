import type { PostBlock } from '@portfolio/types'
import { BlockRenderer } from './BlockRenderer'

export function BlockList({ blocks }: { blocks: PostBlock[] }) {
	return (
		<div className="space-y-10">
			{blocks.map((block, index) => (
				<section key={`${block.type}-${index}`} data-post-block={block.type}>
					<BlockRenderer block={block} />
				</section>
			))}
		</div>
	)
}
