/**
 * NavMenu — 열렸을 때의 메뉴 내부 콘텐츠
 *
 * pageRoutes 매니페스트의 navRoutes에서 생성한 페이지 이동 버튼을 담당한다. 현재
 * 페이지는 목록에서 제외된다. AnimatePresence 아래에서 조건부 마운트되며,
 * 자체 fade 모션을 소유한다. 부모(GlobalNavigationBar)는 "언제 보일지"만
 * 결정하고 "어떻게 나타날지"는 이 컴포넌트가 책임진다.
 */

import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { navRoutes, type AppRoutePath } from '@/app/routes/pageRoutes'
import { cn } from '@/lib/cn'
import { buttonVariants } from '@/components/ui'

interface Props {
	onClose: () => void
}

export default function NavMenu({ onClose }: Props) {
	const navigate = useNavigate()
	const location = useLocation()

	const goTo = (path: AppRoutePath) => {
		navigate(path)
		onClose()
	}

	const menuItemClassName = cn(
		buttonVariants({ variant: 'ghost', size: 'lg' }),
		'h-11 w-full justify-center rounded-sm text-neutral-100 hover:bg-white/10 hover:text-neutral-100',
	)

	return (
		<motion.div
			className="flex h-full flex-col box-border pt-14"
			initial={{
				scale: 0.9,
				opacity: 0,
				filter: 'blur(5px)',
			}}
			animate={{
				scale: 1,
				opacity: 1,
				filter: 'blur(0px)',
				transition: { delay: 0.05 },
			}}
			exit={{
				scale: 0.9,
				opacity: 0,
				filter: 'blur(5px)',
			}}
			transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
		>
			{/* 페이지 이동 버튼 — navRoutes에서 생성, 현재 페이지는 제외 */}
			<div className="flex flex-col gap-2 px-2">
				{navRoutes
					.filter((route) => location.pathname !== route.path)
					.map((route) => (
						<button
							key={route.id}
							type="button"
							className={menuItemClassName}
							onClick={() => goTo(route.path)}
						>
							{route.title}
						</button>
					))}
			</div>
		</motion.div>
	)
}
