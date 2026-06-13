import { useScroll } from 'framer-motion'
import { useRef } from 'react'

export const MEDIA_SCROLL_PROGRESS = [0, 0.4, 0.6, 1]

export function useScrollMediaProgress() {
	const reference = useRef<HTMLDivElement>(null)
	const { scrollYProgress } = useScroll({ target: reference, offset: ['start end', 'end start'] })

	return { reference, scrollYProgress }
}
