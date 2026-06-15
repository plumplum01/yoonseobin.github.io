import type { PostBlock } from '@portfolio/types'
import type { ReactNode } from 'react'
import { CarouselBlock } from '@/blocks/article/CarouselBlock'
import { HeadingBlock } from '@/blocks/article/HeadingBlock'
import { ImageBlock } from '@/blocks/article/ImageBlock'
import { ImageStackBlock } from '@/blocks/article/ImageStackBlock'
import { TextBlock } from '@/blocks/article/TextBlock'
import { VideoBlock } from '@/blocks/article/VideoBlock'

export type BlockRegistry = {
	[TType in PostBlock['type']]: (props: {
		block: Extract<PostBlock, { type: TType }>
	}) => ReactNode
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
	const Component = blockComponents[block.type] as (props: { block: typeof block }) => ReactNode

	return <Component block={block} />
}
