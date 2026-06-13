import type { PostBlock } from '@portfolio/types'
import { BlockInstance } from '@/features/block-renderer/BlockInstance'

export default function ReelBlocks({ blocks }: { blocks: PostBlock[] }) {
	return <BlockInstance blocks={blocks} />
}
