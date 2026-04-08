import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Project } from '../data/projects'
import { type as typography } from '../styles/typography'
import { colors } from '../styles/colors'

export type { Project }

interface Props {
  project: Project
  onClose: () => void
  onScrollClose?: () => void
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>
  isMobile?: boolean
}

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, delay: 0.25 } },
}

type TabType = 'detail' | 'scene'

export default function ContentContainer({ project, onClose, onScrollClose, scrollContainerRef, isMobile }: Props) {
  const lastItemRef = useRef<HTMLDivElement>(null)
  const hasScenes = project.scenes && project.scenes.length > 0
  const [activeTab, setActiveTab] = useState<TabType>('detail')
  const [activeScene, setActiveScene] = useState(0)

  // 프로젝트가 변경되면 탭 초기화
  useEffect(() => {
    setActiveTab('detail')
    setActiveScene(0)
  }, [project.id])

  // 마지막 콘텐츠의 하단이 뷰포트를 벗어나면 오버레이 닫기
  useEffect(() => {
    const container = scrollContainerRef?.current
    const lastEl = lastItemRef.current
    if (!container || !lastEl || !onScrollClose) return

    let triggered = false
    const onScroll = () => {
      if (triggered) return
      const rect = lastEl.getBoundingClientRect()
      if (rect.bottom <= 0) {
        triggered = true
        onScrollClose()
      }
    }

    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [scrollContainerRef, onScrollClose, activeTab])

  return (
    <motion.div
      {...fadeIn}
      className="w-full text-left"
      style={{ backgroundColor: colors.panel }}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-6 right-8 z-50 text-white/50 hover:text-white transition-colors text-[13px] tracking-widest uppercase"
      >
        close
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
            onClick={() => setActiveTab('detail')}
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
            onClick={() => { if (activeTab !== 'scene') setActiveTab('scene') }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            data-section="images"
            className="flex flex-col gap-[20px] mx-[20px] pb-[20px]"
          >
            {project.images.slice(1).map((src, i, arr) => (
              <div
                key={i}
                ref={i === arr.length - 1 ? lastItemRef : undefined}
                className="w-full rounded-[20px] overflow-hidden"
                style={{
                  backgroundColor: colors.panelImageBg,
                  contentVisibility: 'auto',
                  containIntrinsicSize: 'auto 477px',
                }}
              >
                <img
                  src={src}
                  alt={`${project.title} ${i + 2}`}
                  loading="lazy"
                  className="w-full h-auto"
                />
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={`scene-${activeScene}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            data-section="scene-image"
            className="mx-[20px] pb-[20px]"
          >
            {project.scenes && project.scenes[activeScene] && (
              <div
                ref={lastItemRef}
                className="w-full rounded-[20px] overflow-hidden"
                style={{ backgroundColor: colors.panelImageBg }}
              >
                <img
                  src={project.scenes[activeScene].image}
                  alt={`${project.title} - ${project.scenes[activeScene].name}`}
                  className="w-full h-auto"
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
