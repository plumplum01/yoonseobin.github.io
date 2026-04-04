import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useMotionValue, useAnimationFrame } from 'framer-motion'
import Lenis from 'lenis'
import ContentContainer, { type Project } from './ContentContainer'

// 임시 플레이스홀더 — 카드별 실제 데이터로 교체 예정
const PLACEHOLDER_PROJECT: Project = {
  title: 'WATT A LOT',
  subtitle: 'EV Curation Platform',
  period: '2025년 6월 – 12월',
  role: 'UI/UX Designer',
  client: 'Self Initiated',
  tools: 'Figma, Midjourney, Protopie',
  description:
    '와트어랏은 여러 브랜드의 전기차를 한 곳에서 비교하고 계약까지 할 수 있는 EV 큐레이션 플랫폼입니다. 단계별 개인화로 나에게 맞는 차를 쉽게 찾고, 차량 자체에 몰입하는 프리미엄 경험을 설계했습니다.',
}

// ─── 공통 상수 ───────────────────────────────────────────────────────────────
const ITEM_COUNT = 8
const ITEMS = Array.from({ length: ITEM_COUNT }, (_, i) => i + 1)

// ─── Desktop 무한 슬라이더 ────────────────────────────────────────────────────
const DESKTOP_ITEM_WIDTH_VW = 45.6
const DESKTOP_ITEM_GAP = 0
const AUTO_SCROLL_SPEED = 0.5 // px per frame (~30px/s at 60fps)

// 3벌 복제로 무한 루프
const DESKTOP_ITEMS = [...ITEMS, ...ITEMS, ...ITEMS]

interface SelectedCard {
  index: number // DESKTOP_ITEMS 내 고유 인덱스 (0~23)
  n: number     // 아이템 번호 (1~8)
  bg: string
}

function DesktopHero() {
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
      className="relative overflow-hidden bg-white text-left"
      style={{
        width: '100vw',
        height: '100vh',
        marginLeft: 'calc((100% - 100vw) / 2)',
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
          style={{ x, cursor: 'grab' }}
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
            const bg = isEven ? '#efefef' : '#e3e3e3'
            const isSelected = selectedCard?.index === i

            return (
              <motion.div
                key={i}
                className="relative flex-shrink-0 flex items-center justify-center"
                style={{
                  width: `${DESKTOP_ITEM_WIDTH_VW}vw`,
                  marginTop: isEven ? '17.7vh' : '30.2vh',
                  height: isEven ? '63.7vh' : '51.1vh',
                  backgroundColor: bg,
                  cursor: 'pointer',
                  opacity: isSelected ? 0 : 1,
                }}
                onClick={() => {
                  if (!hasDragged.current) {
                    selectCard({ index: i, n, bg })
                  }
                }}
              >
                {/* 임시 넘버링 */}
                <span className="text-[80px] font-bold text-black/20 select-none">
                  {n}
                </span>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Profile info */}
      <div
        className="absolute flex flex-col gap-px font-semibold text-[15px] leading-snug tracking-[-0.15px] text-black/70"
        style={{ left: '0.69%', top: '82.3vh' }}
      >
        <span>Seobin yoon</span>
        <span>plumplum01@naver.com</span>
        <span>Instagram</span>
      </div>

      {/* KR description */}
      <div
        className="absolute flex flex-col"
        style={{ left: '33.8%', top: '82.3vh', width: '24%' }}
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

      {/* EN description */}
      <div
        className="absolute flex flex-col"
        style={{ left: '58.7%', top: '82.3vh', width: '24%' }}
      >
        <span
          className="font-semibold text-[15px] tracking-[-0.15px] text-black/70 leading-snug"
          style={{ paddingLeft: '52px' }}
        >
          EN
        </span>
        <p className="text-[12px] text-black/70 leading-[1.3] tracking-[-0.12px] font-semibold">
          I see interfaces as touchpoints — agreements between elements
          exchanging information. I map data into clear information flows, build
          consistency through design systems, and embed brand values into every
          UI to create products that go beyond simply working.
        </p>
      </div>

      {/* FakeBackground — body에 portal로 렌더링 */}
      {createPortal(
        <AnimatePresence>
          {selectedCard !== null && (
            <>
              {/* FakeBackground: backdrop-blur + 반투명 배경 */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-40"
                style={{
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  backgroundColor: 'rgba(169,169,169,0.15)',
                }}
              />
              {/* 스크롤 컨테이너 — 바깥 클릭 시 닫힘 */}
              <div
                ref={scrollContainerRef}
                key="scroll-overlay"
                className="fixed inset-0 z-50 overflow-y-auto"
                onClick={handleClose}
              >
                {/* Content 패널: 954px 중앙, top 100px, rounded-[48px] */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }}
                  exit={{ opacity: 0, y: -60, transition: { duration: 0.4, ease: [0.4, 0, 0.6, 1] } }}
                  className="relative mx-auto rounded-[48px] overflow-hidden"
                  style={{
                    width: 954,
                    marginTop: 100,
                    marginBottom: 641,
                    backgroundColor: '#141414',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ContentContainer
                    project={PLACEHOLDER_PROJECT}
                    onClose={handleClose}
                    onScrollClose={handleClose}
                    scrollContainerRef={scrollContainerRef}
                  />
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  )
}

// ─── Mobile 스택 레이아웃 ─────────────────────────────────────────────────────
function MobileHero() {
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
            }}
          >
            <span className="text-[60px] font-bold text-black/20 select-none">
              {n}
            </span>
          </div>
        ))}
      </div>
      <div style={{ height: '40px' }} />
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
