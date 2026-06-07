import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, type MotionProps } from 'framer-motion'
import { X } from 'lucide-react'
import type { Project } from '@/registry/projects'
import ContentContainer from '@/components/features/projects/ContentContainer'
import { useScrollLock } from '@/hooks/useScrollLock'

const ICON_SIZE = 16

type OverlayStyles = {
	backdrop: string
	overlay: string
	panel: string
	closeWrapper: string
	closeButton: string
}

type ProjectOverlayProps = {
	project: Project | null
	onClose: () => void
	overlayKey: string
	styles: OverlayStyles
	motionProps: Pick<MotionProps, 'initial' | 'animate' | 'exit'>
}

export default function ProjectOverlay({
	project,
	onClose,
	overlayKey,
	styles,
	motionProps,
}: ProjectOverlayProps) {
	const isOpen = project !== null
	const { lock, unlock } = useScrollLock()

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose()
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [onClose])

	useEffect(() => {
		if (isOpen) lock()
		else unlock()
	}, [isOpen, lock, unlock])

	return createPortal(
		<>
			<motion.div
				className={styles.backdrop}
				initial={false}
				animate={{ opacity: isOpen ? 1 : 0 }}
				transition={{ duration: 0.3 }}
				style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
				onClick={onClose}
			/>

			<AnimatePresence>
				{project && (
					<motion.div
						key={overlayKey}
						className={styles.overlay}
						{...motionProps}
						onClick={onClose}
					>
						<motion.div
							className={styles.panel}
							onClick={(event) => event.stopPropagation()}
						>
							<ContentContainer
								key={project.id}
								project={project}
								onClose={onClose}
							/>
						</motion.div>

						<div className={styles.closeWrapper}>
							<button
								className={styles.closeButton}
								onClick={(event) => {
									event.stopPropagation()
									onClose()
								}}
							>
								<X size={ICON_SIZE} />
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>,
		document.body,
	)
}
