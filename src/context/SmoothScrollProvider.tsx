import Lenis from 'lenis'
import { type ReactNode, useEffect } from 'react'

type SmoothScrollProviderProps = {
	children: ReactNode
	enabled: boolean
}

function prefersReducedMotion() {
	return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

export function SmoothScrollProvider({ children, enabled }: SmoothScrollProviderProps) {
	useEffect(() => {
		if (!enabled || prefersReducedMotion()) return

		const lenis = new Lenis({
			autoRaf: true,
			lerp: 0.1,
			smoothWheel: true,
		})

		return () => {
			lenis.destroy()
		}
	}, [enabled])

	return <>{children}</>
}
