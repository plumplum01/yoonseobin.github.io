import { useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function useScrollPadding(maxPadding: number, maxRadius: number) {
	const reference = useRef<HTMLDivElement>(null)
	const { scrollYProgress } = useScroll({ target: reference, offset: ['start end', 'end start'] })
	const borderRadius = useTransform(scrollYProgress, [0, 0.5, 1], [maxRadius, 0, maxRadius])
	const padding = useTransform(scrollYProgress, [0, 0.5, 1], [maxPadding, 0, maxPadding])

	return { reference, borderRadius, padding }
}
