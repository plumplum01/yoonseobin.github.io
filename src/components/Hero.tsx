import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useMotionValue, useAnimationFrame } from 'framer-motion'
import Lenis from 'lenis'
import ContentContainer from './ContentContainer'
import { projects } from '../data/projects'
import { useTheme } from '../context/ThemeContext'

// ─── 공통 상수 ───────────────────────────────────────────────────────────────
const ITEM_COUNT = 8
const ITEMS = Array.from({ length: ITEM_COUNT }, (_, i) => i + 1)

// ─── Desktop 무한 슬라이더 ────────────────────────────────────────────────────
const DESKTOP_ITEM_WIDTH_VW = 45.6
const DESKTOP_ITEM_GAP = 12
const AUTO_SCROLL_SPEED = 0.5 // px per frame (~30px/s at 60fps)

// 3벌 복제로 무한 루프
const DESKTOP_ITEMS = [...ITEMS, ...ITEMS, ...ITEMS]

interface SelectedCard {
  index: number // DESKTOP_ITEMS 내 고유 인덱스 (0~23)
  n: number     // 아이템 번호 (1~8)
  bg: string
}

function DesktopHero() {
  const { isDark } = useTheme()
  const x = useMotionValue(0)
  const oneSetWidthRef = useRef(0)
  const isDragging = useRef(false)
  const hasDragged = useRef(false)

  const [selectedCard, setSelectedCard] = useState<SelectedCard | null>(null)
  const selectedCardRef = useRef<SelectedCard | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const selectCard = (card: SelectedCard | null) => {
    selectedCardRef.current = card
    if (card) {
      // 스크롤을 먼저 멈추고 한 프레임 뒤에 포털 렌더링
      // → framer-motion이 velocity 없는 안정된 위치를 측정
      requestAnimationFrame(() => setSelectedCard(card))
    } else {
      setSelectedCard(null)
    }
  }

  useEffect(() => {
    const init = () => {
      const w =
        ITEM_COUNT *
        (window.innerWidth * (DESKTOP_ITEM_WIDTH_VW / 100) + DESKTOP_ITEM_GAP)
      oneSetWidthRef.current = w
      x.set(-w)
    }
    init()
    window.addEventListener('resize', init)
    return () => window.removeEventListener('resize', init)
  }, [x])

  // 무한 루프: 경계 도달 시 순간이동
  useEffect(() => {
    return x.on('change', (latest) => {
      const w = oneSetWidthRef.current
      if (!w) return
      if (latest <= -2 * w) x.set(latest + w)
      else if (latest >= 0) x.set(latest - w)
    })
  }, [x])

  // 자동 스크롤: 드래그 중이거나 카드가 열려 있으면 멈춤
  useAnimationFrame(() => {
    if (!isDragging.current && !selectedCardRef.current) {
      x.set(x.get() - AUTO_SCROLL_SPEED)
    }
  })

  // 통합 닫기
  const handleClose = () => selectCard(null)

  // ESC 키로 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // 모달 스크롤 Lenis
  useEffect(() => {
    if (!selectedCard || !scrollContainerRef.current) return
    const lenis = new Lenis({
      wrapper: scrollContainerRef.current,
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      overscroll: false,
    })
    let rafId: number
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [selectedCard])

  return (
    <section
      className="relative overflow-hidden text-left"
      style={{
        width: '100vw',
        height: '100vh',
        marginLeft: 'calc((100% - 100vw) / 2)',
        backgroundColor: 'var(--bg)',
      }}
    >
      {/* Infinite draggable image grid */}
      <div
        className="absolute inset-x-0 top-0 overflow-hidden"
        style={{ height: '81.4vh' }}
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: -999999, right: 999999 }}
          dragElastic={0}
          dragTransition={{ power: 0, timeConstant: 0 }}
          style={{ x, cursor: 'grab', gap: DESKTOP_ITEM_GAP }}
          className="absolute top-0 left-0 h-full flex items-start select-none"
          whileDrag={{ cursor: 'grabbing' }}
          onDragStart={() => {
            isDragging.current = true
            hasDragged.current = true
          }}
          onDragEnd={() => {
            isDragging.current = false
            // onClick보다 뒤에 리셋되도록 한 프레임 지연
            setTimeout(() => { hasDragged.current = false }, 0)
          }}
        >
          {DESKTOP_ITEMS.map((n, i) => {
            const isEven = n % 2 === 0
            const bg = isEven ? 'var(--card-even)' : 'var(--card-odd)'
            const isSelected = selectedCard?.index === i

            return (
              <div
                key={i}
                className="relative flex-shrink-0 flex flex-col"
                style={{
                  width: `${DESKTOP_ITEM_WIDTH_VW}vw`,
                  marginTop: isEven ? '17.7vh' : '30.2vh',
                  cursor: 'pointer',
                  opacity: isSelected ? 0 : 1,
                }}
                onClick={() => {
                  if (!hasDragged.current) {
                    selectCard({ index: i, n, bg })
                  }
                }}
              >
                {/* 카드 이미지 영역 */}
                <div
                  style={{
                    height: isEven ? '63.7vh' : '51.1vh',
                    backgroundColor: bg,
                    borderRadius: '32px',
                    flexShrink: 0,
                  }}
                />
                {/* 타이틀 + 서브타이틀 */}
                <div style={{ paddingLeft: '4px', paddingTop: '14px' }}>
                  <p
                    className="font-semibold text-[15px] leading-snug"
                    style={{
                      letterSpacing: '-0.01em',
                      color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                    }}
                  >
                    {projects[(n - 1) % projects.length].title}
                  </p>
                  <p
                    className="font-medium text-[15px] leading-snug"
                    style={{
                      letterSpacing: '-0.01em',
                      color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                    }}
                  >
                    {projects[(n - 1) % projects.length].subtitle}
                  </p>
                </div>
              </div>
            )
          })}
        </motion.div>
      </div>

      {/* Footer */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between font-medium"
        style={{
          height: '53px',
          paddingLeft: '32px',
          paddingRight: '32px',
          fontSize: '13px',
          letterSpacing: '-0.13px',
          color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.5)',
        }}
      >
        <span>Seobin yoon</span>
        <span>plumplum01@naver.com</span>
      </div>

      {/* FakeBackground — body에 portal로 렌더링 */}
      {createPortal(
        <>
          {/* Backdrop: 항상 DOM에 존재 → blur GPU 레이어 미리 확보, opacity만 전환 */}
          <motion.div
            className="fixed inset-0 z-40"
            initial={false}
            animate={{ opacity: selectedCard ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(169,169,169,0.15)',
              pointerEvents: selectedCard ? 'auto' : 'none',
              willChange: 'opacity',
            }}
            onClick={handleClose}
          />
          {/* 스크롤 컨테이너 + Content 패널 */}
          <AnimatePresence>
            {selectedCard !== null && (
              <div
                ref={scrollContainerRef}
                key="scroll-overlay"
                className="fixed inset-0 z-50 overflow-y-auto"
                onClick={handleClose}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
                  exit={{ opacity: 0, y: -60, transition: { duration: 0.4, ease: [0.4, 0, 0.6, 1] } }}
                  className="relative mx-auto rounded-[48px] overflow-hidden"
                  style={{
                    width: 954,
                    marginTop: 100,
                    marginBottom: 641,
                    backgroundColor: '#141414',
                    willChange: 'transform, opacity',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ContentContainer
                    project={projects[(selectedCard.n - 1) % projects.length]}
                    onClose={handleClose}
                    onScrollClose={handleClose}
                    scrollContainerRef={scrollContainerRef}
                  />
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </section>
  )
}

// ─── Mobile 스택 레이아웃 ─────────────────────────────────────────────────────
function MobileHero() {
  const [selectedN, setSelectedN] = useState<number | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleClose = () => setSelectedN(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedN(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (selectedN === null || !scrollContainerRef.current) return
    const lenis = new Lenis({
      wrapper: scrollContainerRef.current,
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      overscroll: false,
    })
    let rafId: number
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [selectedN])

  return (
    <section className="bg-white text-left relative" style={{ paddingBottom: '40px' }}>
      {/* Profile */}
      <div
        className="absolute flex flex-col gap-px font-semibold text-[15px] leading-snug tracking-[-0.15px] text-black/70"
        style={{ top: '85px', left: '12px' }}
      >
        <span>Seobin yoon</span>
        <span>plumplum01@naver.com</span>
        <span>Instagram</span>
      </div>

      {/* KR description */}
      <div
        className="absolute flex flex-col"
        style={{ top: '211px', left: '12px', width: '292px' }}
      >
        <span
          className="font-semibold text-[15px] tracking-[-0.15px] text-black/70 leading-snug"
          style={{ paddingLeft: '52px' }}
        >
          KR
        </span>
        <p
          className="text-[12px] text-black/70 leading-[1.5] tracking-[-0.12px] font-semibold"
          style={{ fontVariationSettings: "'wght' 700" }}
        >
          인터페이스를 서로 다른 요소 간에 정보나 신호를 주고받는 접점, 또는
          약속이라고 여기며 데이터를 바탕으로 정보의 흐름을 정리하고, 디자인
          시스템으로 일관된 경험을 만듭니다. UI 하나하나에 브랜드의 가치를 담아,
          그냥 작동하는 것 이상의 제품을 만듭니다.
        </p>
      </div>

      {/* Stacked content grid */}
      <div style={{ height: '406px' }} />
      <div className="flex flex-col" style={{ marginLeft: '12px', gap: '2px' }}>
        {ITEMS.map((n) => (
          <div
            key={n}
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 'calc(100vw - 24px)',
              minWidth: '351px',
              aspectRatio: '1 / 1',
              backgroundColor: '#e3e3e3',
              cursor: 'pointer',
              opacity: selectedN === n ? 0 : 1,
            }}
            onClick={() => setSelectedN(n)}
          >
            <span className="text-[60px] font-bold text-black/20 select-none">
              {n}
            </span>
          </div>
        ))}
      </div>
      <div style={{ height: '40px' }} />

      {/* Mobile FakeBackground Portal */}
      {createPortal(
        <>
          <motion.div
            className="fixed inset-0 z-40"
            initial={false}
            animate={{ opacity: selectedN !== null ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(169,169,169,0.15)',
              pointerEvents: selectedN !== null ? 'auto' : 'none',
              willChange: 'opacity',
            }}
            onClick={handleClose}
          />
          <AnimatePresence>
            {selectedN !== null && (
              <div
                ref={scrollContainerRef}
                key="mobile-scroll-overlay"
                className="fixed inset-0 z-50 overflow-y-auto"
                onClick={handleClose}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
                  exit={{ opacity: 0, y: -40, transition: { duration: 0.4, ease: [0.4, 0, 0.6, 1] } }}
                  className="relative mx-auto rounded-[20px] overflow-hidden"
                  style={{
                    width: 'calc(100vw - 24px)',
                    marginTop: 40,
                    marginBottom: 300,
                    backgroundColor: '#141414',
                    willChange: 'transform, opacity',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ContentContainer
                    project={projects[(selectedN - 1) % projects.length]}
                    onClose={handleClose}
                    onScrollClose={handleClose}
                    scrollContainerRef={scrollContainerRef}
                    isMobile
                  />
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </section>
  )
}

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function Hero() {
  return (
    <>
      <div className="hidden md:block">
        <DesktopHero />
      </div>
      <div className="md:hidden">
        <MobileHero />
      </div>
    </>
  )
}
