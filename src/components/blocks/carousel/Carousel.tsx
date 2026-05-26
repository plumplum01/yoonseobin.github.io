import type { CarouselImage } from '@portfolio/types'
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Children, type ReactNode, useCallback, useEffect, useState } from 'react'
import styles from './Carousel.module.css'

type EmblaApi = UseEmblaCarouselType[1]

interface CarouselProps {
  ariaLabel?: string
  children?: ReactNode
  images?: CarouselImage[]
}

function useCarouselControls(api: EmblaApi) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const update = useCallback(() => {
    if (!api) return
    setSelectedIndex(api.selectedScrollSnap())
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [api])

  useEffect(() => {
    if (!api) return
    setScrollSnaps(api.scrollSnapList())
    update()
    api.on('select', update)
    api.on('reInit', update)
  }, [api, update])

  return {
    canScrollNext,
    canScrollPrev,
    scrollSnaps,
    selectedIndex,
    scrollNext: () => api?.scrollNext(),
    scrollPrev: () => api?.scrollPrev(),
    scrollTo: (index: number) => api?.scrollTo(index),
  }
}

export default function Carousel({ ariaLabel = 'Carousel', children, images }: CarouselProps) {
  const [viewportRef, api] = useEmblaCarousel({ align: 'start', loop: false })
  const controls = useCarouselControls(api)
  const slides = images?.length
    ? images.map((image) => ({
        key: image.src,
        node: <img className={styles.image} src={image.src} alt={image.alt ?? ''} loading="lazy" />,
      }))
    : Children.toArray(children).map((child, index) => ({
        key: index,
        node: child,
      }))

  return (
    <section className={styles.root} aria-label={ariaLabel}>
      <div className={styles.viewport} ref={viewportRef}>
        <div className={styles.container}>
          {slides.map((slide) => (
            <div className={styles.slide} key={slide.key}>
              {slide.node}
            </div>
          ))}
        </div>
      </div>

      {controls.scrollSnaps.length > 1 && (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.button}
            aria-label="Previous slide"
            disabled={!controls.canScrollPrev}
            onClick={controls.scrollPrev}
          >
            <ChevronLeft size={16} />
          </button>

          <div className={styles.dots}>
            {controls.scrollSnaps.map((_, index) => (
              <button
                type="button"
                className={`${styles.dot} ${index === controls.selectedIndex ? styles.dotActive : ''}`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === controls.selectedIndex}
                key={index}
                onClick={() => controls.scrollTo(index)}
              />
            ))}
          </div>

          <button
            type="button"
            className={styles.button}
            aria-label="Next slide"
            disabled={!controls.canScrollNext}
            onClick={controls.scrollNext}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </section>
  )
}
