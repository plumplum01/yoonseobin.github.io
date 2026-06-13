import type { PostBlock } from '@portfolio/types'
import type { ReactElement } from 'react'
import {
	CarouselBlock,
	HeadingBlock,
	ImageBlock,
	ImageStackBlock,
	TextBlock,
	VideoBlock,
} from '@/components/blocks/article'

export type BlockRegistry = {
	[TType in PostBlock['type']]: (props: {
		block: Extract<PostBlock, { type: TType }>
	}) => ReactElement
}

const blockComponents = {
	text: TextBlock,
	heading: HeadingBlock,
	image: ImageBlock,
	imageStack: ImageStackBlock,
	carousel: CarouselBlock,
	video: VideoBlock,
} satisfies BlockRegistry

export function BlockRenderer({ block }: { block: PostBlock }) {
	const Component = blockComponents[block.type] as (props: {
		block: typeof block
	}) => ReactElement
	return <Component block={block} />
}
