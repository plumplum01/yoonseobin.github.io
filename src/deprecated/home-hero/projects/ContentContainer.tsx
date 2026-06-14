import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { site } from '@/registry/site'
import type { Project } from '@/registry/projects'
import Toast from '@/deprecated/home-hero/components/Toast'
import { useIsMobile } from '@/hooks/useIsMobile'
import ProjectLightbox from '@/components/features/projects/ProjectLightbox'
import SceneVideoPlayer from '@/components/features/projects/SceneVideoPlayer'
import { useImageHintToast } from '@/components/features/projects/useImageHintToast'
import styles from '@/components/features/projects/ContentContainer.module.css'

const ICON_SIZE = 16

export type { Project }

interface Props {
	project: Project
	onClose: () => void
}

const fadeIn = {
	initial: { opacity: 0 },
	animate: { opacity: 1, transition: { duration: 0.3, delay: 0.25 } },
}

type TabType = 'detail' | 'scene'

export default function ContentContainer({ project, onClose }: Props) {
	const isMobile = useIsMobile()
	const hasScenes = project.scenes && project.scenes.length > 0
	const [activeTab, setActiveTab] = useState<TabType>('detail')
	const [activeScene, setActiveScene] = useState(0)
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
	const { firstImageRef, showToast } = useImageHintToast()

	const markLoaded = useCallback((el: HTMLImageElement | null) => {
		if (!el) return
		const frame = el.closest('[data-image-frame]') as HTMLElement | null
		if (!frame) return
		if (el.complete) {
			frame.dataset.loaded = 'true'
		} else {
			el.addEventListener(
				'load',
				() => {
					frame.dataset.loaded = 'true'
				},
				{ once: true },
			)
		}
	}, [])

	const lightboxImages =
		activeTab === 'detail'
			? project.images.slice(1)
			: (project.scenes?.map((s) => s.image).filter((img): img is string => !!img) ?? [])

	const switchTab = (tab: TabType) => {
		setActiveTab(tab)
	}

	const descriptionBodySizeClass = isMobile
		? styles.descriptionBodyMobile
		: styles.descriptionBodyDesktop

	return (
		<>
			<motion.div {...fadeIn} className={styles.root}>
				{/* 닫기 버튼 */}
				<button onClick={onClose} className={styles.closeButton}>
					<X size={ICON_SIZE} />
				</button>

				{/* 썸네일 이미지 */}
				<div data-section="thumbnail" data-image-frame className={styles.thumbnail}>
					{project.thumbnail && (
						<img
							ref={markLoaded}
							src={project.thumbnail}
							alt={project.title}
							loading="eager"
							fetchPriority="high"
						/>
					)}
				</div>

				{/* 프로젝트 정보 영역 */}
				<div
					data-section="info"
					className={`${styles.info} ${isMobile ? styles.infoMobile : styles.infoDesktop}`}
				>
					{/* 제목 + 서브타이틀 */}
					<div data-section="title" className={styles.titleBlock}>
						<p className={`text-content-title font-semibold ${styles.title}`}>
							{project.title}
						</p>
						<p
							className={`text-content-label font-medium leading-base ${styles.subtitle}`}
						>
							{project.subtitle}
						</p>
					</div>

					{/* 상세 메타 정보 (기간 / 역할 / 클라이언트 / 도구) */}
					<div data-section="meta" className={styles.metaBlock}>
						<p
							className={`text-content-label font-medium leading-base ${styles.metaLabel}`}
						>
							상세
						</p>
						<div
							className={`text-meta font-medium leading-base ${styles.metaGrid} ${isMobile ? styles.metaGridMobile : ''}`}
						>
							<div className={styles.metaColumn}>
								<div className={styles.metaRow}>
									<span className={styles.metaKey}>기간</span>
									<span className={styles.metaValue}>{project.period}</span>
								</div>
								<div className={styles.metaRow}>
									<span className={styles.metaKey}>역할</span>
									<span className={styles.metaValue}>{project.role}</span>
								</div>
							</div>
							<div className={styles.metaColumn}>
								<div className={styles.metaRow}>
									<span className={styles.metaKey}>클라이언트</span>
									<span className={styles.metaValue}>{project.client}</span>
								</div>
								<div className={styles.metaRow}>
									<span className={styles.metaKey}>사용 도구</span>
									<span className={styles.metaValue}>{project.tools}</span>
								</div>
							</div>
						</div>
					</div>

					{/* 설명 */}
					<div data-section="description" className={styles.descriptionBlock}>
						<p
							className={`text-content-label font-medium leading-base ${styles.descriptionLabel}`}
						>
							설명
						</p>
						<p
							className={`text-content-label leading-body tracking-detail text-cjk ${styles.descriptionBody} ${descriptionBodySizeClass}`}
						>
							{project.description}
						</p>

						{/* 토스 캠프 프로젝트 한정 안내 */}
						{project.client === site.tossCampClient && (
							<p
								className={`text-content-label leading-body tracking-detail text-cjk ${styles.descriptionBody} ${descriptionBodySizeClass} ${styles.tossNote}`}
							>
								{site.tossCampNote}
							</p>
						)}
					</div>
				</div>

				{/* 탭 UI — scenes가 있는 프로젝트만 표시 */}
				{hasScenes && (
					<div data-section="tab" className={styles.tabBar}>
						{/* Detail 탭 */}
						<button
							onClick={() => switchTab('detail')}
							className={`${styles.tabButton} ${isMobile ? styles.tabButtonMobile : styles.tabButtonDesktop} ${activeTab === 'detail' ? styles.tabButtonActive : ''}`}
						>
							Detail
						</button>

						{/* Scene 탭 + 서브탭 */}
						<div
							className={`${styles.sceneTabGroup} ${isMobile ? styles.sceneTabGroupMobile : ''} ${activeTab === 'scene' ? styles.sceneTabGroupActive : ''}`}
							onClick={() => {
								if (activeTab !== 'scene') switchTab('scene')
							}}
						>
							<span className={styles.sceneTabLabel}>Scene</span>

							{/* 서브탭 — Scene이 활성화되었을 때만 표시 */}
							{activeTab === 'scene' && (
								<div className={styles.sceneSubTabs}>
									{project.scenes!.map((scene, idx) => (
										<button
											key={scene.name}
											onClick={(e) => {
												e.stopPropagation()
												setActiveScene(idx)
											}}
											className={`${styles.sceneSubTab} ${activeScene === idx ? styles.sceneSubTabActive : ''}`}
										>
											{scene.name}
										</button>
									))}
								</div>
							)}
						</div>
					</div>
				)}

				{/* 콘텐츠 영역 — 탭에 따라 전환 */}
				<AnimatePresence mode="wait">
					{activeTab === 'detail' ? (
						<motion.div
							key="detail"
							initial={{ opacity: 0, y: 12 }}
							animate={{
								opacity: 1,
								y: 0,
								transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
							}}
							exit={{
								opacity: 0,
								y: -8,
								transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
							}}
							data-section="images"
							className={`${styles.tabContent} ${styles.detailList}`}
						>
							{project.images.slice(1).map((src, i) => (
								<div
									key={i}
									ref={i === 0 ? firstImageRef : undefined}
									data-image-frame
									className={styles.imageFrame}
									onClick={() => setLightboxIndex(i)}
								>
									<img
										ref={markLoaded}
										src={src}
										alt={`${project.title} ${i + 2}`}
										loading="eager"
										fetchPriority={i < 2 ? 'high' : 'auto'}
									/>
								</div>
							))}
						</motion.div>
					) : (
						<motion.div
							key="scene"
							initial={{ opacity: 0, y: 12 }}
							animate={{
								opacity: 1,
								y: 0,
								transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
							}}
							exit={{
								opacity: 0,
								y: -8,
								transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
							}}
							data-section="scene-image"
							className={styles.tabContent}
						>
							{project.scenes?.[activeScene] && (
								<div
									className={`${styles.sceneList} ${(project.scenes[activeScene].videos?.length ?? 0) > 1 ? styles.sceneListRow : ''}`}
								>
									{project.scenes[activeScene].videos?.map((video, vi, arr) =>
										arr.length > 1 && vi === arr.length - 1 ? null : (
											<div key={vi} className={styles.sceneVideoFrame}>
												<SceneVideoPlayer video={video} />
											</div>
										),
									)}
									{project.scenes[activeScene].image && (
										<div
											data-image-frame
											className={styles.sceneImageFrame}
											onClick={() => setLightboxIndex(activeScene)}
										>
											<img
												ref={markLoaded}
												src={project.scenes[activeScene].image}
												alt={`${project.title} - ${project.scenes[activeScene].name}`}
												loading="eager"
											/>
										</div>
									)}
								</div>
							)}
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>

			{/* 이미지 힌트 토스트 */}
			{createPortal(
				<Toast message={site.imageHintToast} visible={showToast} icon={'\u{101F08}'} />,
				document.body,
			)}

			<ProjectLightbox
				images={lightboxImages}
				activeIndex={lightboxIndex}
				onChangeIndex={setLightboxIndex}
			/>
		</>
	)
}
