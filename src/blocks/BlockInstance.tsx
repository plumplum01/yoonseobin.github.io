import type { PostBlock } from '@portfolio/types'
import { BlockRenderer } from '@/blocks/BlockRenderer'

export type BlockSurface = 'article-detail' | 'project-detail' | 'reels'

export function BlockInstance({
	blocks,
	surface,
}: {
	blocks: PostBlock[]
	surface?: BlockSurface
}) {
	return (
		<>
			{blocks.map((block, index) => (
				<section key={`${block.type}-${index}`} data-block={block.type}>
					<BlockRenderer block={block} surface={surface} />
				</section>
			))}
		</>
	)
}
