import { AnimatePresence, type HTMLMotionProps, motion } from 'framer-motion'
import { useState } from 'react'

export default function HomeCard({
	onMouseEnter,
	onMouseLeave,
	transition,
	...props
}: HTMLMotionProps<'div'>) {
	const [isHovered, setIsHovered] = useState(false)
	const label = isHovered ? 'Feel free to contact me' : 'Seobin is looking for an opportunity'

	return (
		<motion.div
			className="inline-flex overflow-hidden rounded-3xl bg-neutral-400/10 px-6 py-4 backdrop-blur-md"
			layout
			transition={{
				...transition,
				layout: { type: 'spring', duration: 1, bounce: 0.1 },
			}}
			{...props}
			onMouseEnter={(event) => {
				setIsHovered(true)
				onMouseEnter?.(event)
			}}
			onMouseLeave={(event) => {
				setIsHovered(false)
				onMouseLeave?.(event)
			}}
		>
			<motion.p
				className="flex items-center gap-3 whitespace-nowrap text-xs font-mono uppercase"
				layout
			>
				<motion.span
					className="inline-block size-1 flex-none bg-green-500 animate-[label-dot-blink_1.1s_steps(1,end)_infinite]"
					layout
				/>
				<motion.span className="relative inline-block" layout>
					<AnimatePresence mode="popLayout" initial={false}>
						<motion.span
							key={label}
							className="block whitespace-nowrap"
							layout="position"
							initial={{ opacity: 0, filter: 'blur(3px)' }}
							animate={{ opacity: 1, filter: 'blur(0px)' }}
							exit={{ opacity: 0, filter: 'blur(3px)' }}
							transition={{ type: 'spring', duration: 0.58, bounce: 0.12 }}
						>
							{label}
						</motion.span>
					</AnimatePresence>
				</motion.span>
			</motion.p>
		</motion.div>
	)
}
