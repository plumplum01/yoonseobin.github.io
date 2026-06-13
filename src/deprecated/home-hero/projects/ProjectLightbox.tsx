import { useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { getLoopedIndex } from '@/components/features/projects/lightboxIndex'
import styles from '@/components/features/projects/ContentContainer.module.css'

type ProjectLightboxProps = {
	images: string[]
	activeIndex: number | null
	onChangeIndex: (index: number | null) => void
}

export default function ProjectLightbox({
	images,
	activeIndex,
	onChangeIndex,
}: ProjectLightboxProps) {
	const closeLightbox = useCallback(() => onChangeIndex(null), [onChangeIndex])
	const moveLightbox = useCallback(
		(delta: number) => {
			onChangeIndex(
				activeIndex === null ? null : getLoopedIndex(activeIndex, delta, images.length),
			)
		},
		[activeIndex, images.length, onChangeIndex],
	)

	useEffect(() => {
		if (activeIndex === null) return
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') closeLightbox()
			if (event.key === 'ArrowLeft') moveLightbox(-1)
			if (event.key === 'ArrowRight') moveLightbox(1)
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [activeIndex, closeLightbox, moveLightbox])

	return createPortal(
		<AnimatePresence>
			{activeIndex !== null && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1, transition: { duration: 0.2 } }}
					exit={{ opacity: 0, transition: { duration: 0.2 } }}
					className={styles.lightbox}
					onClick={closeLightbox}
				>
					<img
						key={activeIndex}
						src={images[activeIndex]}
						alt=""
						className={styles.lightboxImage}
					/>

					{images.length > 1 && (
						<div className={styles.lightboxCounter}>
							{activeIndex + 1} / {images.length}
						</div>
					)}

					<button className={styles.lightboxClose} onClick={closeLightbox}>
						close
					</button>

					{images.length > 1 && (
						<button
							className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
							onClick={(event) => {
								event.stopPropagation()
								moveLightbox(-1)
							}}
						>
							<span>‹</span>
						</button>
					)}

					{images.length > 1 && (
						<button
							className={`${styles.lightboxNav} ${styles.lightboxNext}`}
							onClick={(event) => {
								event.stopPropagation()
								moveLightbox(1)
							}}
						>
							<span>›</span>
						</button>
					)}
				</motion.div>
			)}
		</AnimatePresence>,
		document.body,
	)
}
