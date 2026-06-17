import type { PostBlock } from '@portfolio/types'
import Autoplay from 'embla-carousel-autoplay'
import { useMemo } from 'react'
import { type CarouselSlideModel, toCarouselSlide } from '@/blocks/article/carouselSlides'
import { ViewportVideo } from '@/blocks/article/ViewportVideo'
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from '@/components/ui/carousel'
import { useSurface } from '@/context/SurfaceProvider'

type CarouselBlockProps = {
	block: Extract<PostBlock, { type: 'carousel' }>
}

function getCarouselSlides(block: CarouselBlockProps['block']): CarouselSlideModel[] {
	return block.mediaItems.map(toCarouselSlide)
}

function CarouselSlide({ isPriority, slide }: { isPriority: boolean; slide: CarouselSlideModel }) {
	return (
		<CarouselItem className="pl-3">
			<figure className="flex flex-col gap-2">
				<div className="aspect-video w-full overflow-hidden">
					{slide.kind === 'video' ? (
						<ViewportVideo
							className="size-full object-cover"
							controls
							loop
							src={slide.src}
							title={slide.title}
						>
							<track kind="captions" />
						</ViewportVideo>
					) : (
						<img
							className="size-full object-cover"
							src={slide.src}
							alt={slide.alt}
							decoding="async"
							loading={isPriority ? 'eager' : 'lazy'}
						/>
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
	const surface = useSurface()
	const slides = getCarouselSlides(block)
	const shouldAutoPlay = slides.length > 1 && slides.every((slide) => slide.kind === 'image')
	const plugins = useMemo(
		() =>
			shouldAutoPlay
				? [
						Autoplay({
							delay: 6000,
							stopOnInteraction: true,
							stopOnMouseEnter: true,
						}),
					]
				: undefined,
		[shouldAutoPlay],
	)
	const slideItems = slides.map((slide, index) => (
		<CarouselSlide isPriority={index === 0} key={slide.id} slide={slide} />
	))

	return (
		<Carousel
			aria-label="Article media carousel"
			className="flex flex-col gap-1"
			data-surface={surface}
			plugins={plugins}
		>
			<CarouselContent className="-ml-3">{slideItems}</CarouselContent>
			<div className="w-full justify-center flex items-center gap-3">
				<CarouselDots />
			</div>
		</Carousel>
	)
}
