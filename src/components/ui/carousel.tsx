import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
	createContext,
	type ComponentProps,
	type HTMLAttributes,
	type KeyboardEvent,
	type MouseEvent,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import { cn } from '@/lib/cn'

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]
type DivEventHandler<TName extends keyof HTMLAttributes<HTMLDivElement>> = NonNullable<
	HTMLAttributes<HTMLDivElement>[TName]
>

type CarouselContextValue = {
	carouselRef: UseEmblaCarouselType[0]
	api: CarouselApi
	canScrollNext: boolean
	canScrollPrev: boolean
	scrollNext: () => void
	scrollNextLoop: () => void
	scrollPrev: () => void
	scrollPrevLoop: () => void
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

function shouldIgnoreClickNavigation(target: EventTarget | null) {
	return (
		target instanceof Element &&
		Boolean(target.closest('a, button, video, [data-carousel-click-ignore]'))
	)
}

function getClickDirection(event: MouseEvent<HTMLElement>) {
	if (event.defaultPrevented || shouldIgnoreClickNavigation(event.target)) return null

	const rect = event.currentTarget.getBoundingClientRect()
	const midpoint = rect.left + rect.width / 2
	return event.clientX < midpoint ? 'prev' : 'next'
}

function useCarouselClickNavigation({
	onClick,
	onPointerDown,
	onPointerMove,
	onPointerUp,
}: Pick<
	HTMLAttributes<HTMLDivElement>,
	'onClick' | 'onPointerDown' | 'onPointerMove' | 'onPointerUp'
>) {
	const { carouselRef, scrollNextLoop, scrollPrevLoop } = useCarousel()
	const pointerStartX = useRef<number | null>(null)
	const didDrag = useRef(false)

	const handlePointerDown = useCallback<DivEventHandler<'onPointerDown'>>(
		(event) => {
			pointerStartX.current = event.clientX
			didDrag.current = false
			onPointerDown?.(event)
		},
		[onPointerDown],
	)

	const handlePointerMove = useCallback<DivEventHandler<'onPointerMove'>>(
		(event) => {
			if (pointerStartX.current !== null) {
				didDrag.current = Math.abs(event.clientX - pointerStartX.current) > 8
			}
			onPointerMove?.(event)
		},
		[onPointerMove],
	)

	const handlePointerUp = useCallback<DivEventHandler<'onPointerUp'>>(
		(event) => {
			pointerStartX.current = null
			onPointerUp?.(event)
		},
		[onPointerUp],
	)

	const handleClick = useCallback<DivEventHandler<'onClick'>>(
		(event) => {
			onClick?.(event)
			if (didDrag.current) {
				didDrag.current = false
				return
			}

			const actions = {
				next: scrollNextLoop,
				prev: scrollPrevLoop,
			}
			const direction = getClickDirection(event)
			if (direction) actions[direction]()
		},
		[onClick, scrollNextLoop, scrollPrevLoop],
	)

	return {
		carouselRef,
		handleClick,
		handlePointerDown,
		handlePointerMove,
		handlePointerUp,
	}
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

	const scrollPrevLoop = useCallback(() => {
		if (!api || scrollSnaps.length <= 1) return
		if (api.canScrollPrev()) {
			api.scrollPrev()
			return
		}
		api.scrollTo(scrollSnaps.length - 1)
	}, [api, scrollSnaps.length])

	const scrollNextLoop = useCallback(() => {
		if (!api || scrollSnaps.length <= 1) return
		if (api.canScrollNext()) {
			api.scrollNext()
			return
		}
		api.scrollTo(0)
	}, [api, scrollSnaps.length])

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
				scrollNextLoop,
				scrollPrev,
				scrollPrevLoop,
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

function CarouselContent({
	className,
	onClick,
	onPointerDown,
	onPointerMove,
	onPointerUp,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	const { carouselRef, handleClick, handlePointerDown, handlePointerMove, handlePointerUp } =
		useCarouselClickNavigation({
			onClick,
			onPointerDown,
			onPointerMove,
			onPointerUp,
		})

	return (
		<div
			className="overflow-hidden"
			data-cursor="carousel"
			onClick={handleClick}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			ref={carouselRef}
		>
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
						'size-1.5 rounded-full bg-neutral-400/50 opacity-50 transition-opacity',
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
