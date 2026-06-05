import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
	createContext,
	type ComponentProps,
	type HTMLAttributes,
	type KeyboardEvent,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'
import { cn } from '@/lib/cn'

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselContextValue = {
	carouselRef: UseEmblaCarouselType[0]
	api: CarouselApi
	canScrollNext: boolean
	canScrollPrev: boolean
	scrollNext: () => void
	scrollPrev: () => void
	scrollSnaps: number[]
	scrollTo: (index: number) => void
	selectedIndex: number
}

type CarouselProps = HTMLAttributes<HTMLDivElement> & {
	children: ReactNode
	opts?: CarouselOptions
	plugins?: CarouselPlugin
	setApi?: (api: CarouselApi) => void
}

const CarouselContext = createContext<CarouselContextValue | null>(null)

function useCarousel() {
	const context = useContext(CarouselContext)

	if (!context) {
		throw new Error('useCarousel must be used within a Carousel')
	}

	return context
}

function Carousel({ children, className, opts, plugins, setApi, ...props }: CarouselProps) {
	const [carouselRef, api] = useEmblaCarousel({ align: 'start', ...opts }, plugins)
	const [canScrollNext, setCanScrollNext] = useState(false)
	const [canScrollPrev, setCanScrollPrev] = useState(false)
	const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
	const [selectedIndex, setSelectedIndex] = useState(0)

	const update = useCallback((carouselApi: CarouselApi) => {
		if (!carouselApi) return

		setCanScrollPrev(carouselApi.canScrollPrev())
		setCanScrollNext(carouselApi.canScrollNext())
		setScrollSnaps(carouselApi.scrollSnapList())
		setSelectedIndex(carouselApi.selectedScrollSnap())
	}, [])

	const scrollPrev = useCallback(() => {
		api?.scrollPrev()
	}, [api])

	const scrollNext = useCallback(() => {
		api?.scrollNext()
	}, [api])

	const scrollTo = useCallback(
		(index: number) => {
			api?.scrollTo(index)
		},
		[api],
	)

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			if (event.key === 'ArrowLeft') {
				event.preventDefault()
				scrollPrev()
			}

			if (event.key === 'ArrowRight') {
				event.preventDefault()
				scrollNext()
			}
		},
		[scrollNext, scrollPrev],
	)

	useEffect(() => {
		if (!api) return

		setApi?.(api)
		update(api)
		api.on('reInit', update)
		api.on('select', update)

		return () => {
			api.off('reInit', update)
			api.off('select', update)
		}
	}, [api, setApi, update])

	return (
		<CarouselContext.Provider
			value={{
				api,
				canScrollNext,
				canScrollPrev,
				carouselRef,
				scrollNext,
				scrollPrev,
				scrollSnaps,
				scrollTo,
				selectedIndex,
			}}
		>
			{/* biome-ignore lint/a11y/useSemanticElements: Carousel uses the shadcn region role pattern. */}
			<div
				aria-roledescription="carousel"
				className={cn('relative', className)}
				onKeyDownCapture={handleKeyDown}
				role="region"
				{...props}
			>
				{children}
			</div>
		</CarouselContext.Provider>
	)
}

function CarouselContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	const { carouselRef } = useCarousel()

	return (
		<div className="overflow-hidden" ref={carouselRef}>
			<div className={cn('flex touch-pan-y', className)} {...props} />
		</div>
	)
}

function CarouselItem({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return (
		// biome-ignore lint/a11y/useSemanticElements: Carousel slides follow the shadcn/Embla group pattern.
		<div
			aria-roledescription="slide"
			className={cn('min-w-0 shrink-0 grow-0 basis-full', className)}
			role="group"
			{...props}
		/>
	)
}

function CarouselPrevious({ className, ...props }: ComponentProps<'button'>) {
	const { canScrollPrev, scrollPrev } = useCarousel()

	return (
		<button
			aria-label="Previous slide"
			className={cn(
				'inline-flex size-9 items-center justify-center rounded-sm border border-text-primary/20 text-text-primary transition-opacity disabled:pointer-events-none disabled:opacity-30',
				className,
			)}
			disabled={!canScrollPrev}
			onClick={scrollPrev}
			type="button"
			{...props}
		>
			<ChevronLeft aria-hidden="true" />
		</button>
	)
}

function CarouselNext({ className, ...props }: ComponentProps<'button'>) {
	const { canScrollNext, scrollNext } = useCarousel()

	return (
		<button
			aria-label="Next slide"
			className={cn(
				'inline-flex size-9 items-center justify-center rounded-sm border border-text-primary/20 text-text-primary transition-opacity disabled:pointer-events-none disabled:opacity-30',
				className,
			)}
			disabled={!canScrollNext}
			onClick={scrollNext}
			type="button"
			{...props}
		>
			<ChevronRight aria-hidden="true" />
		</button>
	)
}

function CarouselDots({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	const { scrollSnaps, scrollTo, selectedIndex } = useCarousel()

	if (scrollSnaps.length <= 1) return null

	return (
		<div className={cn('flex items-center justify-center gap-2', className)} {...props}>
			{scrollSnaps.map((_, index) => (
				<button
					aria-current={selectedIndex === index}
					aria-label={`Go to slide ${index + 1}`}
					className={cn(
						'size-1.5 rounded-full bg-text-primary opacity-25 transition-opacity',
						selectedIndex === index && 'opacity-100',
					)}
					key={index}
					onClick={() => scrollTo(index)}
					type="button"
				/>
			))}
		</div>
	)
}

export {
	Carousel,
	CarouselContent,
	CarouselDots,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi,
}
