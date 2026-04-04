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
}

// 콘텐츠가 펼쳐진 후 fade-in되는 내부 요소
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, delay: 0.25 } },
}

export default function ContentContainer({ project, onClose }: Props) {
  return (
    <motion.div
      {...fadeIn}
      className="w-full h-full overflow-y-auto text-left"
      style={{ backgroundColor: '#141414' }}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="fixed top-6 right-8 z-50 text-white/50 hover:text-white transition-colors text-[13px] tracking-widest uppercase"
      >
        close
      </button>

      {/* Content 1 — 썸네일 (16:9) */}
      <div
        className="w-full bg-[#000003]"
        style={{ aspectRatio: '16 / 8' }}
      />

      {/* Info strip */}
      <div
        className="relative w-full"
        style={{ paddingTop: '30px', paddingBottom: '80px' }}
      >
        {/* Title — 좌측 */}
        <div
          className="absolute flex flex-col leading-[1.4] whitespace-nowrap"
          style={{ left: '1.56%', top: '30px' }}
        >
          <p className="text-white font-semibold text-[32px]">
            {project.title}
          </p>
          <p className="text-[#696969] text-[14px] font-medium">
            {project.subtitle}
          </p>
        </div>

        {/* Detail — 50% */}
        <div
          className="absolute flex flex-col gap-[7px] whitespace-nowrap"
          style={{ left: '50.3%', top: '28px' }}
        >
          <p className="text-[#696969] text-[14px] font-medium leading-[1.4]">
            상세
          </p>
          <div className="flex gap-[12px] text-[12px] font-medium leading-[1.4]">
            {/* 기간 / 역할 */}
            <div className="flex flex-col gap-[8px]">
              <div className="flex gap-[8px]">
                <span className="text-white">기간</span>
                <span className="text-[#a9a9a9]">{project.period}</span>
              </div>
              <div className="flex gap-[8px]">
                <span className="text-white">역할</span>
                <span className="text-[#a9a9a9]">{project.role}</span>
              </div>
            </div>
            {/* 클라이언트 / 사용 도구 */}
            <div className="flex flex-col gap-[8px]">
              <div className="flex gap-[8px]">
                <span className="text-white">클라이언트</span>
                <span className="text-[#a9a9a9]">{project.client}</span>
              </div>
              <div className="flex gap-[8px]">
                <span className="text-white">사용 도구</span>
                <span className="text-[#a9a9a9]">{project.tools}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description — 75% */}
        <div
          className="absolute flex flex-col gap-[7px]"
          style={{ left: '75.2%', top: '28px', width: '22.8%' }}
        >
          <p className="text-[#696969] text-[14px] font-medium leading-[1.4] whitespace-nowrap">
            설명
          </p>
          <p className="text-white text-[14px] leading-[1.45] tracking-[0.28px]">
            {project.description}
          </p>
        </div>

        {/* info strip 높이 확보 */}
        <div style={{ height: '90px' }} />
      </div>

      {/* Content 2~11 */}
      <div className="flex flex-col gap-[4px] mx-[10px]">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="w-full bg-[#000003]"
            style={{ aspectRatio: '1900 / 992' }}
          />
        ))}
      </div>

      {/* Footer */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: '62.2vw' }}
      >
        {/* YSB 대형 배경 텍스트 */}
        <p
          className="absolute font-semibold whitespace-nowrap text-white/80 leading-[1.45] select-none"
          style={{
            fontSize: '50.97vw',
            letterSpacing: '-2.04vw',
            left: '36px',
            top: '-0.76vw',
          }}
        >
          YSB
        </p>

        {/* Back / Next Project 버튼 */}
        <div
          className="absolute flex items-center justify-between"
          style={{ left: '36px', top: '145px', right: '36px' }}
        >
          <a
            href="#"
            className="flex items-center gap-[12px] px-[24px] py-[14px] border border-white/20 rounded-full text-[20px] font-semibold text-white/50 leading-none tracking-[-0.4px] whitespace-nowrap hover:border-white/50 hover:text-white/80 transition-colors"
          >
            ← Back
          </a>
          <a
            href="#"
            className="flex items-center gap-[12px] px-[24px] py-[14px] border border-white/20 rounded-full text-[20px] font-semibold text-white/50 leading-none tracking-[-0.4px] whitespace-nowrap hover:border-white/50 hover:text-white/80 transition-colors"
          >
            Next Project →
          </a>
        </div>
      </div>
    </motion.div>
  )
}
