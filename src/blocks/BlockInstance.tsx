import type { PostBlock } from '@portfolio/types'
import { BlockRenderer } from '@/blocks/BlockRenderer'

export function BlockInstance({ blocks, priority = false }: { blocks: PostBlock[]; priority?: boolean }) {
	return (
		<>
			{blocks.map((block, index) => (
				<section className="w-full" key={`${block.type}-${index}`} data-block={block.type}>
					<BlockRenderer block={block} priority={priority && index === 0} />
				</section>
			))}
		</>
	)
}
