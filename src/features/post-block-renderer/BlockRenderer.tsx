import type { PostBlock } from '@portfolio/types'
import { blockRegistry } from '@/features/post-block-renderer/blockRegistry'

export function BlockRenderer({ block }: { block: PostBlock }) {
	switch (block.type) {
		case 'text': {
			const Component = blockRegistry.text
			return <Component block={block} />
		}
		case 'heading': {
			const Component = blockRegistry.heading
			return <Component block={block} />
		}
		case 'image': {
			const Component = blockRegistry.image
			return <Component block={block} />
		}
		case 'carousel': {
			const Component = blockRegistry.carousel
			return <Component block={block} />
		}
		case 'video': {
			const Component = blockRegistry.video
			return <Component block={block} />
		}
	}

	const exhaustiveBlock: never = block
	throw new Error(`Unsupported block type: ${exhaustiveBlock}`)
}
