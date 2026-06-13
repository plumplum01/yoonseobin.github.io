import type { PostBlock } from '@portfolio/types'
import { BlockList } from '@/features/block-renderer/BlockList'

export default function ReelBlocks({ blocks }: { blocks: PostBlock[] }) {
	return <BlockList blocks={blocks} />
}
