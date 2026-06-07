import { useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const PROGRESS = [0, 0.4, 0.6, 1]

export function useScrollPadding(maxPadding: number, maxRadius: number) {
	const reference = useRef<HTMLDivElement>(null)
	const { scrollYProgress } = useScroll({ target: reference, offset: ['start end', 'end start'] })
	const borderRadius = useTransform(scrollYProgress, PROGRESS, [maxRadius, 0, 0, maxRadius])
	const padding = useTransform(scrollYProgress, PROGRESS, [maxPadding, 0, 0, maxPadding])

	return { reference, borderRadius, padding }
}
