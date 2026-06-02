import { useCallback, useEffect, useRef, type RefObject } from 'react'
import Lenis from 'lenis'

type SmoothScrollOrientation = 'vertical' | 'horizontal'
type SmoothScrollGestureOrientation = SmoothScrollOrientation | 'both'

type UseSmoothScrollOptions = {
	enabled: boolean
	wrapperRef: RefObject<HTMLElement | null>
	contentRef: RefObject<HTMLElement | null>
	eventsTargetRef: RefObject<HTMLElement | null>
	orientation?: SmoothScrollOrientation
	gestureOrientation?: SmoothScrollGestureOrientation
	smoothWheel?: boolean
	wheelMultiplier?: number
	lerp?: number
}

export function useSmoothScroll({
	enabled,
	wrapperRef,
	contentRef,
	eventsTargetRef,
	orientation = 'vertical',
	gestureOrientation = orientation,
	smoothWheel = true,
	wheelMultiplier = 1,
	lerp = 0.1,
}: UseSmoothScrollOptions) {
	const lenisRef = useRef<Lenis | null>(null)
	const lastScrollRef = useRef(0)

	useEffect(() => {
		if (!enabled) return

		const wrapper = wrapperRef.current
		const content = contentRef.current
		const eventsTarget = eventsTargetRef.current
		if (!wrapper || !content || !eventsTarget) return

		const lenis = new Lenis({
			wrapper,
			content,
			eventsTarget,
			orientation,
			gestureOrientation,
			smoothWheel,
			wheelMultiplier,
			lerp,
			autoRaf: false,
		})

		lenisRef.current = lenis
		lastScrollRef.current = lenis.scroll

		return () => {
			lenis.destroy()
			lenisRef.current = null
			lastScrollRef.current = 0
		}
	}, [
		enabled,
		wrapperRef,
		contentRef,
		eventsTargetRef,
		orientation,
		gestureOrientation,
		smoothWheel,
		wheelMultiplier,
		lerp,
	])

	const readScrollDelta = useCallback(
		(time: number) => {
			if (!enabled) return 0

			const lenis = lenisRef.current
			if (!lenis) return 0

			lenis.raf(time)
			const current = lenis.scroll
			const delta = current - lastScrollRef.current
			lastScrollRef.current = current

			return delta
		},
		[enabled],
	)

	return {
		readScrollDelta,
	}
}
