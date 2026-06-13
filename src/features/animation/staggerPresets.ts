import type { Variants } from 'framer-motion'

export const staggerListVariants: Variants = {
	hidden: {},
	show: {
		transition: {
			staggerChildren: 0.08,
			delayChildren: 0.12,
		},
	},
}

export const staggerItemVariants: Variants = {
	hidden: {
		opacity: 0,
		y: 18,
		scale: 0.98,
	},
	show: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: 0.45,
			ease: [0.22, 1, 0.36, 1],
		},
	},
}
