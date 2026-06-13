/**
 * GlobalNavigationBar — 전역 네비게이션 최상위 컨테이너
 * */

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NAVIGATION_ROUTES } from '@/app/routes/pageRoutes'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/cn'

const LINKS = Object.fromEntries(NAVIGATION_ROUTES.map(({ id, ...rest }) => [id, rest]))

const TEXT_COLOR = 'text-neutral-700'
const TEXT_COLOR_PRIMARY = 'text-neutral-900'
const SEPARATOR_COLOR = 'bg-neutral-400/30'
const CONTAINER_COLOR = 'bg-neutral-200/50'
const DOT_COLOR = 'bg-orange-400'

function BrandLink({ route }: { route: string }) {
	return (
		<Link
			aria-label="Go to home"
			className="flex min-h-5 min-w-16 items-center justify-center"
			to={route}
		>
			<img
				alt=""
				aria-hidden="true"
				className="h-4 w-auto object-contain"
				decoding="async"
				src="/symbol.svg"
			/>
		</Link>
	)
}

function NavigationLink({
	label,
	route,
	variant,
}: {
	label: string
	route: string
	variant?: 'primary'
}) {
	const [hover, setHover] = useState(false)

	const textColor = variant === 'primary' ? TEXT_COLOR_PRIMARY : TEXT_COLOR

	return (
		<Link to={route}>
			<motion.div
				onHoverStart={() => setHover(true)}
				onHoverEnd={() => setHover(false)}
				className="min-w-16 min-h-5 flex items-center justify-center relative gap-2"
			>
				<AnimatePresence mode="popLayout">
					<motion.span
						layout
						layoutDependency={hover}
						className={cn(textColor, 'text-xs font-medium')}
					>
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
							className={cn(DOT_COLOR, 'min-w-1 min-h-1 rounded-full')}
						/>
					)}
				</AnimatePresence>
			</motion.div>
		</Link>
	)
}

function NavigationSeparator() {
	return <Separator orientation="vertical" className={cn(SEPARATOR_COLOR)} />
}

export default function GlobalNavigationBar() {
	const badge = 'px-5 py-1.5 pt-2 flex rounded-full'

	return (
		<nav className="fixed top-5 inset-x-0 z-30 flex justify-center isolate">
			<section className="flex items-center gap-1 hover:gap-3 hover:scale-101 [--extra-transition:gap_400ms_ease-out,scale_200ms_ease]">
				<div className={cn(badge, CONTAINER_COLOR, 'backdrop-blur-md')}>
					<BrandLink route={LINKS.home.path} />
				</div>
				<div
					className={cn(
						badge,
						'gap-2.5 backdrop-blur-md hover:scale-105 [--extra-transition:scale_200ms_ease-out] ',
						CONTAINER_COLOR,
					)}
				>
					<NavigationLink label="Articles" route={LINKS.articles.path} />
					<NavigationSeparator />
					<NavigationLink label="Reels" route={LINKS.reels.path} />
					<NavigationSeparator />
					<NavigationLink label="Projects" route={LINKS.projects.path} />
				</div>
				<div className={cn(badge, 'bg-orange-500')}>
					<NavigationLink variant="primary" label="About" route={LINKS.about.path} />
				</div>
			</section>
		</nav>
	)
}
