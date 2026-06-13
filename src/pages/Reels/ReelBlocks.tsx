import type { PostBlock } from '@portfolio/types'
import { BlockInstance } from '@/blocks/BlockInstance'

export default function ReelBlocks({ blocks }: { blocks: PostBlock[] }) {
	return <BlockInstance blocks={blocks} />
}
