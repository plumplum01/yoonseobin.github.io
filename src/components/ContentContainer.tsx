import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export interface Project {
  title: string
  subtitle: string
  period: string
  role: string
  client: string
  tools: string
  description: string
}

interface Props {
  project: Project
  onClose: () => void
  onScrollClose?: () => void
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>
}

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, delay: 0.25 } },
}

export default function ContentContainer({ project, onClose, onScrollClose, scrollContainerRef }: Props) {
  const lastItemRef = useRef<HTMLDivElement>(null)

  // 마지막 콘텐츠가 화면 중앙에 도달하면 스크롤로 닫기 트리거
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
      style={{ backgroundColor: '#141414' }}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-6 right-8 z-50 text-white/50 hover:text-white transition-colors text-[13px] tracking-widest uppercase"
      >
        close
      </button>

      {/* Content 1 — 썸네일 */}
      <div
        className="w-full bg-[#000003]"
        style={{ aspectRatio: '954 / 546' }}
      />

      {/* Info 영역 — 수직 스택, left 51px */}
      <div style={{ paddingLeft: '51px', paddingTop: '19px' }}>
        {/* Title */}
        <div className="flex flex-col leading-[1.4]" style={{ paddingBottom: '45px' }}>
          <p className="text-white font-semibold text-[32px]">{project.title}</p>
          <p className="text-[#696969] text-[14px] font-medium">{project.subtitle}</p>
        </div>

        {/* Detail */}
        <div className="flex flex-col gap-[7px]" style={{ paddingBottom: '79px' }}>
          <p className="text-[#696969] text-[14px] font-medium leading-[1.4]">상세</p>
          <div className="flex gap-[12px] text-[12px] font-medium leading-[1.4]">
            <div className="flex flex-col gap-[8px]">
              <div className="flex gap-[8px]">
                <span className="text-white whitespace-nowrap">기간</span>
                <span className="text-[#a9a9a9] whitespace-nowrap">{project.period}</span>
              </div>
              <div className="flex gap-[8px]">
                <span className="text-white whitespace-nowrap">역할</span>
                <span className="text-[#a9a9a9] whitespace-nowrap">{project.role}</span>
              </div>
            </div>
            <div className="flex flex-col gap-[8px]">
              <div className="flex gap-[8px]">
                <span className="text-white whitespace-nowrap">클라이언트</span>
                <span className="text-[#a9a9a9] whitespace-nowrap">{project.client}</span>
              </div>
              <div className="flex gap-[8px]">
                <span className="text-white whitespace-nowrap">사용 도구</span>
                <span className="text-[#a9a9a9] whitespace-nowrap">{project.tools}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-[7px]" style={{ paddingBottom: '100px' }}>
          <p className="text-[#696969] text-[14px] font-medium leading-[1.4] whitespace-nowrap">설명</p>
          <p
            className="text-white text-[14px] leading-[1.45] tracking-[0.28px]"
            style={{ width: '438px' }}
          >
            {project.description}
          </p>
        </div>
      </div>

      {/* Content 2~11 */}
      <div className="flex flex-col gap-[4px] mx-[20px] pb-[20px]">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            ref={i === 9 ? lastItemRef : undefined}
            className="w-full bg-[#000003] rounded-[32px]"
            style={{ aspectRatio: '1900 / 992' }}
          />
        ))}
      </div>
    </motion.div>
  )
}
