import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion'

// ─── 공통 상수 ───────────────────────────────────────────────────────────────
const ITEM_COUNT = 8
const ITEMS = Array.from({ length: ITEM_COUNT }, (_, i) => i + 1)

// ─── Desktop 무한 슬라이더 ────────────────────────────────────────────────────
const DESKTOP_ITEM_WIDTH_VW = 45.6
const DESKTOP_ITEM_GAP = 0
const AUTO_SCROLL_SPEED = 0.5 // px per frame (~30px/s at 60fps)

// 3벌 복제로 무한 루프
const DESKTOP_ITEMS = [...ITEMS, ...ITEMS, ...ITEMS]

function DesktopHero() {
  const x = useMotionValue(0)
  const oneSetWidthRef = useRef(0)
  const isDragging = useRef(false)

  useEffect(() => {
    const init = () => {
      const w =
        ITEM_COUNT *
        (window.innerWidth * (DESKTOP_ITEM_WIDTH_VW / 100) + DESKTOP_ITEM_GAP)
      oneSetWidthRef.current = w
      x.set(-w) // 가운데 세트에서 시작
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

  // 자동 스크롤: 드래그 중엔 멈춤
  useAnimationFrame(() => {
    if (!isDragging.current) {
      x.set(x.get() - AUTO_SCROLL_SPEED)
    }
  })

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
          onDragStart={() => { isDragging.current = true }}
          onDragEnd={() => { isDragging.current = false }}
        >
          {DESKTOP_ITEMS.map((n, i) => {
            const isEven = n % 2 === 0
            return (
              <div
                key={i}
                className="relative flex-shrink-0 flex items-center justify-center"
                style={{
                  width: `${DESKTOP_ITEM_WIDTH_VW}vw`,
                  marginTop: isEven ? '17.7vh' : '30.2vh',
                  height: isEven ? '63.7vh' : '51.1vh',
                  backgroundColor: isEven ? '#efefef' : '#e3e3e3',
                }}
              >
                {/* 임시 넘버링 */}
                <span className="text-[80px] font-bold text-black/20 select-none">
                  {n}
                </span>
              </div>
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
    </section>
  )
}

// ─── Mobile 스택 레이아웃 ─────────────────────────────────────────────────────
// Figma Mobile_Main (375×812) 기준
// Profile: top=85, left=12
// KR: top=211, left=12
// Container: top=406, left=12, 컨텐츠 351×351, gap=2px

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
      {/* spacer: container starts at y=406 */}
      <div style={{ height: '406px' }} />
      <div
        className="flex flex-col"
        style={{ marginLeft: '12px', gap: '2px' }}
      >
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
            {/* 임시 넘버링 */}
            <span className="text-[60px] font-bold text-black/20 select-none">
              {n}
            </span>
          </div>
        ))}
      </div>
      {/* bottom padding */}
      <div style={{ height: '40px' }} />
    </section>
  )
}

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function Hero() {
  return (
    <>
      {/* Desktop: md(768px) 이상 */}
      <div className="hidden md:block">
        <DesktopHero />
      </div>
      {/* Mobile: md 미만 */}
      <div className="md:hidden">
        <MobileHero />
      </div>
    </>
  )
}
