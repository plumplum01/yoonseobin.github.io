import type { PostBlock } from '@portfolio/types'
import { BlockInstance, type BlockSurface } from '@/blocks/BlockInstance'

export default function ReelBlocks({
	blocks,
	surface,
}: {
	blocks: PostBlock[]
	surface?: BlockSurface
}) {
	return <BlockInstance blocks={blocks} surface={surface} />
}
