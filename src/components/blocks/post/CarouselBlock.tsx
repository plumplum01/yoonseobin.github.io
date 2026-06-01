import type { PostBlock } from '@portfolio/types'
import {
	Carousel,
	CarouselContent,
	CarouselDots,
	CarouselItem,
} from '../../ui/carousel'
import { type CarouselSlideModel, toCarouselSlide } from './carouselSlides'

type CarouselBlockProps = {
	block: Extract<PostBlock, { type: 'carousel' }>
}

function getCarouselSlides(block: CarouselBlockProps['block']): CarouselSlideModel[] {
	return block.mediaItems.map(toCarouselSlide)
}

function CarouselSlide({ slide }: { slide: CarouselSlideModel }) {
	return (
		<CarouselItem className="pl-3">
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
						{/*{slide.caption}*/}
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
		<Carousel aria-label="Post media carousel" className="flex flex-col gap-1">
			<CarouselContent className="-ml-3">{slideItems}</CarouselContent>
			<div className="w-full justify-center flex items-center gap-3">
				<CarouselDots />
				{/*<div className="flex items-center gap-2">
					<CarouselPrevious />
					<CarouselNext />
				</div>*/}
			</div>
		</Carousel>
	)
}
