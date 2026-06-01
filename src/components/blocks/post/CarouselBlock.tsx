import type { MediaAsset, PostBlock } from '@portfolio/types'
import {
	Carousel,
	CarouselContent,
	CarouselDots,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '../../ui/carousel'

type CarouselSlideModel =
	| {
		id: string
		kind: 'image'
		src: string
		alt: string
		caption?: string
	}
	| {
		id: string
		kind: 'video'
		src: string
		title: string
		caption?: string
	}

type CarouselBlockProps = {
	block: Extract<PostBlock, { type: 'carousel' }>
}

function toCarouselSlide(media: MediaAsset): CarouselSlideModel {
	if (media.type === 'video') {
		return {
			id: media.id,
			kind: 'video',
			src: media.url,
			title: media.title,
			...(media.caption ? { caption: media.caption } : {}),
		}
	}

	return {
		id: media.id,
		kind: 'image',
		src: media.url,
		alt: media.alt ?? media.caption ?? media.title,
		...(media.caption ? { caption: media.caption } : {}),
	}
}

function getCarouselSlides(block: CarouselBlockProps['block']): CarouselSlideModel[] {
	return block.mediaItems.map(toCarouselSlide)
}

function CarouselSlide({ slide }: { slide: CarouselSlideModel }) {
	return (
		<CarouselItem>
			<figure className="flex flex-col gap-2">
				<div className="aspect-video w-full overflow-hidden rounded-sm">
					{slide.kind === 'video' ? (
						// biome-ignore lint/a11y/useMediaCaption: CMS media assets do not provide timed caption tracks yet.
						<video className="size-full object-cover" controls src={slide.src} title={slide.title} />
					) : (
						<img className="size-full object-cover" src={slide.src} alt={slide.alt} loading="lazy" />
					)}
				</div>

				{slide.caption && (
					<figcaption className="text-caption font-medium leading-tight tracking-caption text-cjk text-[var(--caption-gray)]">
						{slide.caption}
					</figcaption>
				)}
			</figure>
		</CarouselItem>
	)
}

export function CarouselBlock({ block }: CarouselBlockProps) {
	const slideItems = getCarouselSlides(block).map((slide) => (
		<CarouselSlide key={slide.id} slide={slide} />
	))

	return (
		<Carousel aria-label="Post media carousel" className="flex flex-col gap-3">
			<CarouselContent>{slideItems}</CarouselContent>

			<div className="flex items-center justify-between gap-3">
				<CarouselDots />
				<div className="flex items-center gap-2">
					<CarouselPrevious />
					<CarouselNext />
				</div>
			</div>
		</Carousel>
	)
}
