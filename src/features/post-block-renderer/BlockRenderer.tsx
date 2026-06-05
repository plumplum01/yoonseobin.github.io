import type { PostBlock } from '@portfolio/types'
import { blockRegistry } from '@/features/post-block-renderer/blockRegistry'

export function BlockRenderer({ block }: { block: PostBlock }) {
	const Component = blockRegistry[block.type]

	if (!Component) {
		throw new Error(`Unsupported block type: ${block.type}`)
	}

	return <Component block={block} />
}
