import type { ReactElement } from 'react'
import type { PostBlock } from '@portfolio/types'
import {
	CarouselBlock,
	HeadingBlock,
	ImageBlock,
	TextBlock,
	VideoBlock,
} from '@/components/blocks/post'

export type BlockRegistry = {
	[TType in PostBlock['type']]: (props: {
		block: Extract<PostBlock, { type: TType }>
	}) => ReactElement
}

export const blockRegistry = {
	text: TextBlock,
	heading: HeadingBlock,
	image: ImageBlock,
	carousel: CarouselBlock,
	video: VideoBlock,
} satisfies BlockRegistry
