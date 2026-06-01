import type { PostBlock } from '@portfolio/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

type CarouselBlockProps = {
  block: Extract<PostBlock, { type: 'carousel' }>
}

export function CarouselBlock({ block }: CarouselBlockProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [canScrollPrev, setCanScrollPrev] = useState(false)

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    setCanScrollPrev(scroller.scrollLeft > 0)
    setCanScrollNext(scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1)
  }, [])

  const scrollByPage = (direction: -1 | 1) => {
    const scroller = scrollerRef.current
    if (!scroller) return

    scroller.scrollBy({ left: direction * scroller.clientWidth, behavior: 'smooth' })
  }

  useEffect(() => {
    updateScrollState()
  }, [updateScrollState])

  return (
    <figure className="space-y-3">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth"
        onScroll={updateScrollState}
      >
        {block.mediaItems.map((media) => (
          <img
            key={media.id}
            className="aspect-[4/3] w-full min-w-full snap-start rounded-sm object-cover"
            src={media.url}
            alt={media.alt ?? media.caption ?? media.title}
            loading="lazy"
          />
        ))}
      </div>

      {block.mediaItems.length > 1 && (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-sm border border-[var(--text-primary)]/20 text-[var(--text-primary)] disabled:opacity-30"
            aria-label="Previous slide"
            disabled={!canScrollPrev}
            onClick={() => scrollByPage(-1)}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-sm border border-[var(--text-primary)]/20 text-[var(--text-primary)] disabled:opacity-30"
            aria-label="Next slide"
            disabled={!canScrollNext}
            onClick={() => scrollByPage(1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </figure>
  )
}
