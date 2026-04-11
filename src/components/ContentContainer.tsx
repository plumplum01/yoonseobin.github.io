import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { Project, SceneVideo } from '../lib/projects'
import site from '../data/site.json'
import Toast from './Toast'
import { useIsMobile } from '../hooks/useIsMobile'
import styles from './ContentContainer.module.css'

const ICON_SIZE = 16

export type { Project }

function SceneVideoPlayer({ video }: { video: SceneVideo }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = videoRef.current
    if (!el || !video.delay) return
    el.pause()
    const timer = setTimeout(() => { el.play() }, video.delay)
    return () => clearTimeout(timer)
  }, [video.delay])

  return (
    <video
      ref={videoRef}
      src={video.src}
      autoPlay={!video.delay}
      loop
      muted
      playsInline
    />
  )
}

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
  const [showToast, setShowToast] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const markLoaded = useCallback((el: HTMLImageElement | null) => {
    if (!el) return
    const frame = el.closest('[data-image-frame]') as HTMLElement | null
    if (!frame) return
    if (el.complete) {
      frame.dataset.loaded = 'true'
    } else {
      el.addEventListener('load', () => { frame.dataset.loaded = 'true' }, { once: true })
    }
  }, [])

  const firstImageRef = useCallback((el: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
    if (!el || sessionStorage.getItem('image-hint-shown')) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        sessionStorage.setItem('image-hint-shown', '1')
        setShowToast(true)
        observer.disconnect()
        observerRef.current = null
        setTimeout(() => setShowToast(false), 3000)
      }
    }, { threshold: 0.1 })
    observer.observe(el)
    observerRef.current = observer
  }, [])

  const lightboxImages = activeTab === 'detail'
    ? project.images.slice(1)
    : (project.scenes?.map(s => s.image).filter((img): img is string => !!img) ?? [])

  const closeLightbox = () => setLightboxIndex(null)

  const switchTab = (tab: TabType) => {
    setActiveTab(tab)
  }

  // 프로젝트가 변경되면 탭 초기화
  useEffect(() => {
    setActiveTab('detail')
    setActiveScene(0)
  }, [project.id])

  // 라이트박스 키보드 핸들러
  useEffect(() => {
    if (lightboxIndex === null) return
    const total = lightboxImages.length
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') setLightboxIndex(i => i !== null ? (i - 1 + total) % total : null)
      if (e.key === 'ArrowRight') setLightboxIndex(i => i !== null ? (i + 1) % total : null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex, lightboxImages.length])

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
          <p className={`t-content-title ${styles.title}`}>{project.title}</p>
          <p className={`t-content-label ${styles.subtitle}`}>{project.subtitle}</p>
        </div>

        {/* 상세 메타 정보 (기간 / 역할 / 클라이언트 / 도구) */}
        <div data-section="meta" className={styles.metaBlock}>
          <p className={`t-content-label ${styles.metaLabel}`}>상세</p>
          <div className={`t-content-meta ${styles.metaGrid} ${isMobile ? styles.metaGridMobile : ''}`}>
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
          <p className={`t-content-label ${styles.descriptionLabel}`}>설명</p>
          <p className={`t-content-body ${styles.descriptionBody} ${descriptionBodySizeClass}`}>
            {project.description}
          </p>

          {/* 토스 캠프 프로젝트 한정 안내 */}
          {project.client === site.tossCampClient && (
            <p className={`t-content-body ${styles.descriptionBody} ${descriptionBodySizeClass} ${styles.tossNote}`}>
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
            onClick={() => { if (activeTab !== 'scene') switchTab('scene') }}
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
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
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
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
            data-section="scene-image"
            className={styles.tabContent}
          >
            {project.scenes && project.scenes[activeScene] && (
              <div className={styles.sceneList}>
                {project.scenes[activeScene].videos?.map((video, vi) => (
                  <div key={vi} className={styles.sceneVideoFrame}>
                    <SceneVideoPlayer video={video} />
                  </div>
                ))}
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
      <Toast message={site.imageHintToast} visible={showToast} />,
      document.body
    )}

    {/* 라이트박스 */}
    {createPortal(
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className={styles.lightbox}
            onClick={closeLightbox}
          >
            {/* 이미지 */}
            <img
              key={lightboxIndex}
              src={lightboxImages[lightboxIndex]}
              alt=""
              className={styles.lightboxImage}
            />

            {/* 카운터 */}
            {lightboxImages.length > 1 && (
              <div className={styles.lightboxCounter}>
                {lightboxIndex + 1} / {lightboxImages.length}
              </div>
            )}

            {/* 닫기 버튼 */}
            <button className={styles.lightboxClose} onClick={closeLightbox}>
              close
            </button>

            {/* 이전 버튼 */}
            {lightboxImages.length > 1 && (
              <button
                className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i !== null ? (i - 1 + lightboxImages.length) % lightboxImages.length : null) }}
              >
                <span>‹</span>
              </button>
            )}

            {/* 다음 버튼 */}
            {lightboxImages.length > 1 && (
              <button
                className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i !== null ? (i + 1) % lightboxImages.length : null) }}
              >
                <span>›</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  )
}
