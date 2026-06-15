/**
 * GlobalNavigationBar — 전역 네비게이션 최상위 컨테이너
 * */

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAVIGATION_ROUTES } from '@/app/routes/pageRoutes'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/cn'

const LINKS = Object.fromEntries(NAVIGATION_ROUTES.map(({ id, ...rest }) => [id, rest]))
const MOBILE_MENU_LINKS = [LINKS.articles, LINKS.reels, LINKS.projects, LINKS.about]

const TEXT_COLOR = 'text-neutral-700'
const TEXT_COLOR_PRIMARY = 'text-neutral-900'
const SEPARATOR_COLOR = 'bg-neutral-400/30'
const CONTAINER_COLOR = 'bg-neutral-200/50'
const DOT_COLOR = 'bg-orange-400'
const ACTIVE_COLOR = 'bg-orange-500'
const NAV_BADGE = 'flex rounded-full px-5 py-1.5 pt-2'

function isActivePath(currentPath: string, routePath: string) {
	if (routePath === '/') return currentPath === routePath
	return currentPath === routePath || currentPath.startsWith(`${routePath}/`)
}

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

function MobileMenuLink({
	isActive,
	label,
	onClick,
	route,
}: {
	isActive: boolean
	label: string
	onClick: () => void
	route: string
}) {
	return (
		<Link
			className={cn(
				'flex min-h-11 items-center rounded-full px-5 text-sm font-medium',
				isActive ? 'bg-orange-500 text-neutral-950' : 'text-neutral-700',
			)}
			onClick={onClick}
			to={route}
		>
			{label}
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

function DesktopNavigation() {
	return (
		<section className="hidden items-center gap-1 hover:gap-3 hover:scale-101 [--extra-transition:gap_400ms_ease-out,scale_200ms_ease] md:flex">
			<div className={cn(NAV_BADGE, CONTAINER_COLOR, 'backdrop-blur-md')}>
				<BrandLink route={LINKS.home.path} />
			</div>
			<div
				className={cn(
					NAV_BADGE,
					'gap-2.5 backdrop-blur-md hover:scale-105 [--extra-transition:scale_200ms_ease-out]',
					CONTAINER_COLOR,
				)}
			>
				<NavigationLink label="Articles" route={LINKS.articles.path} />
				<NavigationSeparator />
				<NavigationLink label="Reels" route={LINKS.reels.path} />
				<NavigationSeparator />
				<NavigationLink label="Projects" route={LINKS.projects.path} />
			</div>
			<div className={cn(NAV_BADGE, ACTIVE_COLOR)}>
				<NavigationLink variant="primary" label="About" route={LINKS.about.path} />
			</div>
		</section>
	)
}

function MobileNavigation() {
	const location = useLocation()
	const { pathname } = location
	const [isOpen, setIsOpen] = useState(false)
	const rootRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (pathname) {
			setIsOpen(false)
		}
	}, [pathname])

	useEffect(() => {
		if (!isOpen) return

		function handlePointerDown(event: PointerEvent) {
			if (!rootRef.current?.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				setIsOpen(false)
			}
		}

		document.addEventListener('pointerdown', handlePointerDown)
		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('pointerdown', handlePointerDown)
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpen])

	return (
		<section className="flex w-full items-start justify-between px-4 md:hidden" ref={rootRef}>
			<div className={cn(NAV_BADGE, CONTAINER_COLOR, 'backdrop-blur-md')}>
				<BrandLink route={LINKS.home.path} />
			</div>
			<div className="relative flex flex-col items-end gap-2">
				<button
					aria-controls="mobile-navigation-menu"
					aria-expanded={isOpen}
					className={cn(
						NAV_BADGE,
						'min-h-11 min-w-24 appearance-none items-center justify-center border-0 font-medium text-sm text-neutral-900',
						isOpen ? ACTIVE_COLOR : CONTAINER_COLOR,
						'backdrop-blur-md',
					)}
					onClick={() => setIsOpen((current) => !current)}
					type="button"
				>
					{isOpen ? 'Close' : 'Menu'}
				</button>
				<AnimatePresence>
					{isOpen && (
						<motion.div
							animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
							className={cn(
								'absolute right-0 top-13 flex min-w-44 flex-col gap-1 rounded-3xl p-1',
								CONTAINER_COLOR,
								'backdrop-blur-md',
							)}
							exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
							id="mobile-navigation-menu"
							initial={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
							transition={{ type: 'spring', duration: 0.28, bounce: 0.12 }}
						>
							{MOBILE_MENU_LINKS.map((link) => (
								<MobileMenuLink
									isActive={isActivePath(pathname, link.path)}
									key={link.path}
									label={'navLabel' in link ? link.navLabel : link.title}
									onClick={() => setIsOpen(false)}
									route={link.path}
								/>
							))}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</section>
	)
}

export default function GlobalNavigationBar() {
	return (
		<nav className="fixed inset-x-0 top-4 z-30 isolate flex justify-center md:top-5">
			<DesktopNavigation />
			<MobileNavigation />
		</nav>
	)
}
