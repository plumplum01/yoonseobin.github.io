import { fireEvent, render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

const { emblaApi, useEmblaCarouselMock } = vi.hoisted(() => {
	const emblaApi = {
		canScrollNext: vi.fn(),
		canScrollPrev: vi.fn(),
		off: vi.fn(),
		on: vi.fn(),
		scrollNext: vi.fn(),
		scrollPrev: vi.fn(),
		scrollSnapList: vi.fn(),
		scrollTo: vi.fn(),
		selectedScrollSnap: vi.fn(),
	}

	return {
		emblaApi,
		useEmblaCarouselMock: vi.fn(() => [vi.fn(), emblaApi]),
	}
})

vi.mock('embla-carousel-react', () => ({
	default: useEmblaCarouselMock,
}))

function setCarouselRect(element: Element) {
	Object.defineProperty(element, 'getBoundingClientRect', {
		configurable: true,
		value: () => ({
			bottom: 100,
			height: 100,
			left: 0,
			right: 200,
			toJSON: vi.fn(),
			top: 0,
			width: 200,
			x: 0,
			y: 0,
		}),
	})
}

function renderCarousel() {
	const result = render(
		<Carousel>
			<CarouselContent>
				<CarouselItem>First</CarouselItem>
				<CarouselItem>Second</CarouselItem>
			</CarouselContent>
		</Carousel>,
	)
	const viewport = result.container.querySelector('[data-cursor="carousel"]')
	if (!viewport) throw new Error('Carousel viewport was not rendered')
	setCarouselRect(viewport)
	return { ...result, viewport }
}

describe('carousel primitive', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		emblaApi.canScrollNext.mockReturnValue(true)
		emblaApi.canScrollPrev.mockReturnValue(true)
		emblaApi.scrollSnapList.mockReturnValue([0, 1])
		emblaApi.selectedScrollSnap.mockReturnValue(0)
	})

	it('uses viewport click position to move to the previous or next slide', async () => {
		const { viewport } = renderCarousel()
		await waitFor(() =>
			expect(emblaApi.on).toHaveBeenCalledWith('select', expect.any(Function)),
		)

		fireEvent.click(viewport, { clientX: 150 })
		expect(emblaApi.scrollNext).toHaveBeenCalledTimes(1)

		fireEvent.click(viewport, { clientX: 50 })
		expect(emblaApi.scrollPrev).toHaveBeenCalledTimes(1)
	})

	it('does not treat a drag release as a click navigation', async () => {
		const { viewport } = renderCarousel()
		await waitFor(() =>
			expect(emblaApi.on).toHaveBeenCalledWith('select', expect.any(Function)),
		)

		fireEvent.pointerDown(viewport, { clientX: 20 })
		fireEvent.pointerMove(viewport, { clientX: 80 })
		fireEvent.pointerUp(viewport, { clientX: 80 })
		fireEvent.click(viewport, { clientX: 150 })

		expect(emblaApi.scrollNext).not.toHaveBeenCalled()
		expect(emblaApi.scrollPrev).not.toHaveBeenCalled()
	})
})
