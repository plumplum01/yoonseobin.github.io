import type { ComponentType } from 'react'
import type { PostBlock } from '@portfolio/types'
import { CarouselBlock } from './CarouselBlock'
import { HeadingBlock } from './HeadingBlock'
import { ImageBlock } from './ImageBlock'
import { QuoteBlock } from './QuoteBlock'
import { TextBlock } from './TextBlock'
import { VideoBlock } from './VideoBlock'

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
