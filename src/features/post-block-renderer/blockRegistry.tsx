import type { ComponentType } from 'react'
import type { PostBlock } from '@portfolio/types'
import {
  CarouselBlock,
  HeadingBlock,
  ImageBlock,
  QuoteBlock,
  TextBlock,
  VideoBlock,
} from '../../components/blocks/post'

type BlockComponent<TBlock extends PostBlock = PostBlock> = ComponentType<{ block: TBlock }>
type RegisteredBlockComponent = ComponentType<{ block: PostBlock }>

export type BlockRegistry = {
  [TType in PostBlock['type']]: BlockComponent<Extract<PostBlock, { type: TType }>>
}

export const blockRegistry = {
  text: TextBlock as RegisteredBlockComponent,
  heading: HeadingBlock as RegisteredBlockComponent,
  quote: QuoteBlock as RegisteredBlockComponent,
  image: ImageBlock as RegisteredBlockComponent,
  carousel: CarouselBlock as RegisteredBlockComponent,
  video: VideoBlock as RegisteredBlockComponent,
} satisfies Record<keyof BlockRegistry, RegisteredBlockComponent>
