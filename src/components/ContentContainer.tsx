import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { Project } from '../data/projects'
import { type } from '../styles/typography'
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

export default function ContentContainer({ project, onClose, onScrollClose, scrollContainerRef, isMobile }: Props) {
  const lastItemRef = useRef<HTMLDivElement>(null)

  // 마지막 이미지가 화면 하단 65% 지점에 도달하면 오버레이 닫기
  useEffect(() => {
    const container = scrollContainerRef?.current
    const lastEl = lastItemRef.current
    if (!container || !lastEl || !onScrollClose) return

    let triggered = false
    const onScroll = () => {
      if (triggered) return
      const rect = lastEl.getBoundingClientRect()
      if (rect.bottom <= window.innerHeight * 0.65) {
        triggered = true
        onScrollClose()
      }
    }

    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [scrollContainerRef, onScrollClose])

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
          <p style={{ ...type.contentTitle, color: colors.panelText }}>{project.title}</p>
          <p style={{ ...type.contentLabel, color: colors.panelMuted }}>{project.subtitle}</p>
        </div>

        {/* 상세 메타 정보 (기간 / 역할 / 클라이언트 / 도구) */}
        <div data-section="meta" className="flex flex-col gap-[7px]" style={{ paddingBottom: '79px' }}>
          <p style={{ ...type.contentLabel, color: colors.panelMuted }}>상세</p>
          <div className="flex gap-[12px]" style={{ ...type.contentMeta }}>
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
          <p style={{ ...type.contentLabel, color: colors.panelMuted }} className="whitespace-nowrap">설명</p>
          <p
            style={{
              ...type.contentBody,
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
                ...type.contentBody,
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

      {/* 프로젝트 이미지 목록 (썸네일 이후) */}
      <div data-section="images" className="flex flex-col gap-[20px] mx-[20px] pb-[20px]">
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
      </div>
    </motion.div>
  )
}
