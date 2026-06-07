/**
 * GlobalNavigationBar — 전역 네비게이션 최상위 컨테이너
 * */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { NAVIGATION_ROUTES } from '@/app/routes/pageRoutes'
import { AnimatePresence, motion } from 'framer-motion'

const NAVIGATION_BADGE_CLASS_BY_TONE = {
	neutral: 'backdrop-blur-md bg-neutral-400/10',
	accent: 'bg-orange-500',
} as const

function NavigationLink({ label, route }: { label: string; route: string }) {
	const [hover, setHover] = useState(false)

	return (
		<Link to={route}>
			<motion.div
				onHoverStart={() => setHover(true)}
				onHoverEnd={() => setHover(false)}
				className="min-w-16 min-h-5 flex items-center justify-center relative gap-2"
			>
				<AnimatePresence mode="popLayout">
					<motion.span layout layoutDependency={hover} className="text-xs font-bold">
						{label}
					</motion.span>
					{hover && (
						<motion.span
							key="dot"
							layout
							layoutDependency={hover}
							initial={{ opacity: 0, y: 6, scale: 0.8 }}
							animate={{ opacity: 1, y: 0, scale: 1.2 }}
							exit={{ opacity: 0, y: 6, scale: 0.8 }}
							transition={{ type: 'spring', bounce: 0.3, duration: 0.35 }}
							className="min-w-1 min-h-1 rounded-full bg-black"
						/>
					)}
				</AnimatePresence>
			</motion.div>
		</Link>
	)
}

export default function GlobalNavigationBar() {
	const badge = 'px-5 py-1.5 pt-2 flex rounded-full'

	return (
		<nav className="fixed top-10 inset-x-0 z-30 flex justify-center isolate">
			<section className="flex items-center gap-1">
				{NAVIGATION_ROUTES.map((route) => (
					<div
						key={route.id}
						className={cn(
							badge,
							NAVIGATION_BADGE_CLASS_BY_TONE[route.navTone ?? 'neutral'],
						)}
					>
						<NavigationLink label={route.navLabel ?? route.title} route={route.path} />
					</div>
				))}
			</section>
		</nav>
	)
}
