import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { Project } from '../data/projects'
import { type as typography } from '../styles/typography'
import { colors } from '../styles/colors'
import Toast from './Toast'

export type { Project }

interface Props {
  project: Project
  onClose: () => void
  isMobile?: boolean
}

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, delay: 0.25 } },
}

type TabType = 'detail' | 'scene'

export default function ContentContainer({ project, onClose, isMobile }: Props) {
  const hasScenes = project.scenes && project.scenes.length > 0
  const [activeTab, setActiveTab] = useState<TabType>('detail')
  const [activeScene, setActiveScene] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [showToast, setShowToast] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

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
    : (project.scenes?.map(s => s.image) ?? [])

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

  return (
    <>
    <motion.div
      {...fadeIn}
      className="w-full text-left"
      style={{ backgroundColor: colors.panel }}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-5 right-6 z-50 flex items-center justify-center w-8 h-8 rounded-full transition-colors"
        style={{
          backgroundColor: 'rgba(0,0,0,0.35)',
          color: 'rgba(255,255,255,0.7)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(0,0,0,0.55)'
          ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,1)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(0,0,0,0.35)'
          ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)'
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {/* 썸네일 이미지 */}
      <div data-section="thumbnail" className="w-full" style={{ aspectRatio: '954 / 546', backgroundColor: colors.panelImageBg }}>
        {project.thumbnail && (
          <img
            src={project.thumbnail}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* 프로젝트 정보 영역 */}
      <div data-section="info" style={{ paddingLeft: isMobile ? '16px' : '51px', paddingTop: '24px' }}>

        {/* 제목 + 서브타이틀 */}
        <div data-section="title" className="flex flex-col leading-[1.4]" style={{ paddingBottom: '45px' }}>
          <p style={{ ...typography.contentTitle, color: colors.panelText }}>{project.title}</p>
          <p style={{ ...typography.contentLabel, color: colors.panelMuted }}>{project.subtitle}</p>
        </div>

        {/* 상세 메타 정보 (기간 / 역할 / 클라이언트 / 도구) */}
        <div data-section="meta" className="flex flex-col gap-[7px]" style={{ paddingBottom: '79px' }}>
          <p style={{ ...typography.contentLabel, color: colors.panelMuted }}>상세</p>
          <div className="flex gap-[12px]" style={{ ...typography.contentMeta }}>
            <div className="flex flex-col gap-[8px]">
              <div className="flex gap-[8px]">
                <span className="text-white whitespace-nowrap">기간</span>
                <span style={{ color: colors.panelDetail }} className="whitespace-nowrap">{project.period}</span>
              </div>
              <div className="flex gap-[8px]">
                <span className="text-white whitespace-nowrap">역할</span>
                <span style={{ color: colors.panelDetail }} className="whitespace-nowrap">{project.role}</span>
              </div>
            </div>
            <div className="flex flex-col gap-[8px]">
              <div className="flex gap-[8px]">
                <span className="text-white whitespace-nowrap">클라이언트</span>
                <span style={{ color: colors.panelDetail }} className="whitespace-nowrap">{project.client}</span>
              </div>
              <div className="flex gap-[8px]">
                <span className="text-white whitespace-nowrap">사용 도구</span>
                <span style={{ color: colors.panelDetail }} className="whitespace-nowrap">{project.tools}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 설명 */}
        <div data-section="description" className="flex flex-col gap-[7px]" style={{ paddingBottom: '100px' }}>
          <p style={{ ...typography.contentLabel, color: colors.panelMuted }} className="whitespace-nowrap">설명</p>
          <p
            style={{
              ...typography.contentBody,
              color: colors.panelText,
              width: isMobile ? 'auto' : '438px',
              paddingRight: isMobile ? '16px' : undefined,
            }}
          >
            {project.description}
          </p>

          {/* 토스 캠프 프로젝트 한정 안내 */}
          {project.client === 'TOSS 인터랙션 디자인 캠프' && (
            <p
              style={{
                ...typography.contentBody,
                color: colors.panelText,
                opacity: 0.5,
                width: isMobile ? 'auto' : '438px',
                paddingRight: isMobile ? '16px' : undefined,
                marginTop: '16px',
              }}
            >
              토스 인터랙션 디자인 캠프에서 지속적인 UI/모션 피드백을 받아가며 작업했습니다.
            </p>
          )}
        </div>
      </div>

      {/* 탭 UI — scenes가 있는 프로젝트만 표시 */}
      {hasScenes && (
        <div
          data-section="tab"
          className="flex items-center justify-center"
          style={{ gap: '10px', paddingBottom: '20px' }}
        >
          {/* Detail 탭 */}
          <button
            onClick={() => switchTab('detail')}
            className="flex items-center justify-center transition-colors"
            style={{
              width: isMobile ? 'auto' : '120px',
              padding: '10px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: 1.4,
              color: 'white',
              opacity: activeTab === 'detail' ? 1 : 0.4,
              backgroundColor: activeTab === 'detail' ? 'rgba(255,255,255,0.1)' : 'transparent',
            }}
          >
            Detail
          </button>

          {/* Scene 탭 + 서브탭 */}
          <div
            className="flex items-center transition-colors"
            style={{
              height: '42px',
              paddingLeft: isMobile ? '14px' : '22px',
              paddingRight: '2px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '10px',
              gap: isMobile ? '12px' : '27px',
              backgroundColor: activeTab === 'scene' ? 'rgba(255,255,255,0.2)' : 'transparent',
              opacity: activeTab === 'scene' ? 1 : 0.4,
              cursor: 'pointer',
            }}
            onClick={() => { if (activeTab !== 'scene') switchTab('scene') }}
          >
            <span
              style={{
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: 1.4,
                color: 'white',
              }}
            >
              Scene
            </span>

            {/* 서브탭 — Scene이 활성화되었을 때만 표시 */}
            {activeTab === 'scene' && (
              <div
                className="flex items-center"
                style={{
                  backgroundColor: '#191919',
                  padding: '2px',
                  borderRadius: '8px',
                  gap: '6px',
                }}
              >
                {project.scenes!.map((scene, idx) => (
                  <button
                    key={scene.name}
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveScene(idx)
                    }}
                    className="flex items-center justify-center transition-all"
                    style={{
                      minWidth: '61px',
                      paddingTop: '8px',
                      paddingBottom: '8px',
                      paddingLeft: '10px',
                      paddingRight: '10px',
                      borderRadius: activeScene === idx ? '6px' : '10px',
                      fontSize: '12px',
                      fontWeight: 500,
                      lineHeight: 1.4,
                      color: 'white',
                      opacity: activeScene === idx ? 1 : 0.2,
                      backgroundColor: activeScene === idx ? 'rgba(255,255,255,0.1)' : 'transparent',
                      border: activeScene === idx ? '0.5px solid rgba(255,255,255,0.2)' : '0.5px solid transparent',
                    }}
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
            className="flex flex-col gap-[20px] mx-[20px] pb-[20px]"
          >
            {project.images.slice(1).map((src, i) => (
              <div
                key={i}
                ref={i === 0 ? firstImageRef : undefined}
                className="w-full rounded-[16px] overflow-hidden cursor-zoom-in"
                style={{
                  backgroundColor: colors.panelImageBg,
                  contentVisibility: 'auto',
                  containIntrinsicSize: 'auto 477px',
                }}
                onClick={() => setLightboxIndex(i)}
              >
                <img
                  src={src}
                  alt={`${project.title} ${i + 2}`}
                  loading={i < 3 ? 'eager' : 'lazy'}
                  className="w-full h-auto pointer-events-none"
                  style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
                  onLoad={(e) => { e.currentTarget.style.opacity = '1' }}
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
            className="mx-[20px] pb-[20px]"
          >
            {project.scenes && project.scenes[activeScene] && (
              <div
                className="w-full rounded-[16px] overflow-hidden cursor-zoom-in"
                style={{ backgroundColor: colors.panelImageBg }}
                onClick={() => setLightboxIndex(activeScene)}
              >
                <img
                  src={project.scenes[activeScene].image}
                  alt={`${project.title} - ${project.scenes[activeScene].name}`}
                  className="w-full h-auto pointer-events-none"
                  style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
                  onLoad={(e) => { e.currentTarget.style.opacity = '1' }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>

    {/* 이미지 힌트 토스트 */}
    {createPortal(
      <Toast message="이미지를 클릭하면 크게 볼 수 있어요" visible={showToast} />,
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
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
            onClick={closeLightbox}
          >
            {/* 이미지 */}
            <img
              key={lightboxIndex}
              src={lightboxImages[lightboxIndex]}
              alt=""
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-[12px]"
              style={{ pointerEvents: 'none' }}
            />

            {/* 카운터 */}
            {lightboxImages.length > 1 && (
              <div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-[13px] tracking-widest"
                style={{ pointerEvents: 'none' }}
              >
                {lightboxIndex + 1} / {lightboxImages.length}
              </div>
            )}

            {/* 닫기 버튼 */}
            <button
              className="absolute top-6 right-8 text-white/50 hover:text-white transition-colors text-[13px] tracking-widest uppercase"
              onClick={closeLightbox}
            >
              close
            </button>

            {/* 이전 버튼 */}
            {lightboxImages.length > 1 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all text-[32px]" style={{ lineHeight: 1 }}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i !== null ? (i - 1 + lightboxImages.length) % lightboxImages.length : null) }}
              >
                <span style={{ display: 'inline-block', transform: 'translate(-1px, -2px)' }}>‹</span>
              </button>
            )}

            {/* 다음 버튼 */}
            {lightboxImages.length > 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all text-[32px]" style={{ lineHeight: 1 }}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i !== null ? (i + 1) % lightboxImages.length : null) }}
              >
                <span style={{ display: 'inline-block', transform: 'translate(1px, -2px)' }}>›</span>
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
