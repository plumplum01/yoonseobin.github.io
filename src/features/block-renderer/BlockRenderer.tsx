import type { PostBlock } from '@portfolio/types'
import { lazy, Suspense, type ReactNode } from 'react'
import { HeadingBlock } from '@/components/blocks/article/HeadingBlock'
import { aspectRatioClassName } from '@/components/blocks/article/MediaFrame'
import { TextBlock } from '@/components/blocks/article/TextBlock'
import { Skeleton } from '@/components/ui'
import { cn } from '@/lib/cn'

const ImageBlock = lazy(() =>
	import('@/components/blocks/article/ImageBlock').then((module) => ({
		default: module.ImageBlock,
	})),
)
const ImageStackBlock = lazy(() =>
	import('@/components/blocks/article/ImageStackBlock').then((module) => ({
		default: module.ImageStackBlock,
	})),
)
const CarouselBlock = lazy(() =>
	import('@/components/blocks/article/CarouselBlock').then((module) => ({
		default: module.CarouselBlock,
	})),
)
const VideoBlock = lazy(() =>
	import('@/components/blocks/article/VideoBlock').then((module) => ({
		default: module.VideoBlock,
	})),
)

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

function MediaBlockSkeleton({ block }: { block: PostBlock }) {
	if (block.type === 'image' || block.type === 'video') {
		return <Skeleton className={cn('w-full rounded', aspectRatioClassName[block.aspectRatio])} />
	}

	if (block.type === 'carousel') {
		return (
			<div className="flex flex-col gap-1" aria-hidden="true">
				<Skeleton className="aspect-video w-full rounded" />
				<div className="flex w-full items-center justify-center gap-2 py-1">
					<Skeleton className="size-1.5 rounded-full" />
					<Skeleton className="size-1.5 rounded-full" />
					<Skeleton className="size-1.5 rounded-full" />
				</div>
			</div>
		)
	}

	if (block.type === 'imageStack') {
		const itemCount = Math.max(1, Math.min(block.mediaItems.length, 2))

		return (
			<div className="flex w-full flex-col gap-4" aria-hidden="true">
				{Array.from({ length: itemCount }).map((_, index) => (
					<Skeleton key={index} className="aspect-video w-full rounded" />
				))}
			</div>
		)
	}

	return null
}

function isMediaBlock(block: PostBlock): boolean {
	return (
		block.type === 'image' ||
		block.type === 'video' ||
		block.type === 'imageStack' ||
		block.type === 'carousel'
	)
}

export function BlockRenderer({ block }: { block: PostBlock }) {
	const Component = blockComponents[block.type] as (props: {
		block: typeof block
	}) => ReactNode

	if (!isMediaBlock(block)) {
		return <Component block={block} />
	}

	return (
		<Suspense fallback={<MediaBlockSkeleton block={block} />}>
			<Component block={block} />
		</Suspense>
	)
}
