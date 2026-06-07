import type { PostBlock } from '@portfolio/types'
import type { ReactElement } from 'react'
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

export function BlockRenderer({ block }: { block: PostBlock }) {
	switch (block.type) {
		case 'text': {
			return <TextBlock block={block} />
		}
		case 'heading': {
			return <HeadingBlock block={block} />
		}
		case 'image': {
			return <ImageBlock block={block} />
		}
		case 'carousel': {
			return <CarouselBlock block={block} />
		}
		case 'video': {
			return <VideoBlock block={block} />
		}
	}

	const exhaustiveBlock: never = block
	throw new Error(`Unsupported block type: ${exhaustiveBlock}`)
}
