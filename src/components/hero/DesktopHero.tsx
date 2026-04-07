/**
 * DesktopHero
 *
 * md(768px) 이상에서 표시되는 데스크탑 메인 화면입니다.
 *
 * 구성:
 * - 무한 드래그 슬라이더: 프로젝트 카드를 가로로 나열하고 자동 스크롤합니다.
 * - 콘텐츠 오버레이: 카드를 클릭하면 블러 배경 위로 상세 패널이 열립니다.
 * - Footer: 화면 하단에 이름과 이메일을 표시합니다.
 */

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useMotionValue, useAnimationFrame } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { type } from '../../styles/typography'
import { colors, useColors } from '../../styles/colors'
import { projects } from '../../data/projects'
import ContentContainer from '../ContentContainer'
import {
  DESKTOP_ITEMS,
  DESKTOP_ITEM_WIDTH_VW,
  DESKTOP_ITEM_GAP,
  AUTO_SCROLL_SPEED,
  ITEM_COUNT,
  type SelectedCard,
} from './constants'

export default function DesktopHero() {
  const { isDark } = useTheme()
  const c = useColors()

  // ─── 슬라이더 상태 ────────────────────────────────────────────────────────

  /** 슬라이더의 현재 X 위치 (framer-motion MotionValue) */
  const x = useMotionValue(0)

  /** 카드 한 세트의 전체 너비 (px) — resize 시 재계산 */
  const oneSetWidthRef = useRef(0)

  /** 드래그 중 여부 — 자동 스크롤 일시 정지에 사용 */
  const isDragging = useRef(false)

  /** 드래그가 실제로 발생했는지 — 드래그 후 onClick 방지 */
  const hasDragged = useRef(false)

  // ─── 오버레이 상태 ────────────────────────────────────────────────────────

  /** 현재 열려 있는 카드 정보 (null이면 닫힌 상태) */
  const [selectedCard, setSelectedCard] = useState<SelectedCard | null>(null)

  /**
   * ref로도 selectedCard를 추적합니다.
   * useAnimationFrame 내부에서는 state 클로저가 stale해지므로
   * ref를 통해 최신값을 참조합니다.
   */
  const selectedCardRef = useRef<SelectedCard | null>(null)

  /** 오버레이 스크롤 컨테이너 ref — ContentContainer의 scroll 이벤트 감지용 */
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // ─── 카드 선택/해제 ───────────────────────────────────────────────────────

  const selectCard = (card: SelectedCard | null) => {
    selectedCardRef.current = card
    if (card) {
      // 슬라이더를 먼저 멈추고 한 프레임 뒤에 렌더링
      // → framer-motion이 velocity 없는 안정된 위치를 측정하도록
      requestAnimationFrame(() => setSelectedCard(card))
    } else {
      setSelectedCard(null)
    }
  }

  const handleClose = () => selectCard(null)

  // ─── 슬라이더 초기화 및 리사이즈 대응 ────────────────────────────────────

  useEffect(() => {
    const init = () => {
      const w = ITEM_COUNT * (window.innerWidth * (DESKTOP_ITEM_WIDTH_VW / 100) + DESKTOP_ITEM_GAP)
      oneSetWidthRef.current = w
      x.set(-w) // 중간 세트에서 시작
    }
    init()
    window.addEventListener('resize', init)
    return () => window.removeEventListener('resize', init)
  }, [x])

  // ─── 무한 루프: 경계 도달 시 중간 세트로 순간이동 ────────────────────────

  useEffect(() => {
    return x.on('change', (latest) => {
      const w = oneSetWidthRef.current
      if (!w) return
      if (latest <= -2 * w) x.set(latest + w)
      else if (latest >= 0) x.set(latest - w)
    })
  }, [x])

  // ─── 자동 스크롤: 드래그 중이거나 오버레이가 열리면 멈춤 ─────────────────

  useAnimationFrame(() => {
    if (!isDragging.current && !selectedCardRef.current) {
      x.set(x.get() - AUTO_SCROLL_SPEED)
    }
  })

  // ─── ESC 키로 오버레이 닫기 ───────────────────────────────────────────────

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ─── 오버레이 열릴 때 body 스크롤 잠금 ───────────────────────────────────

  useEffect(() => {
    document.body.style.overflow = selectedCard ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedCard])

  // ─── 렌더 ─────────────────────────────────────────────────────────────────

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
      {/* 무한 드래그 슬라이더 */}
      <div className="absolute inset-x-0 top-0 overflow-hidden" style={{ height: '90vh' }}>
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
                  if (!hasDragged.current) selectCard({ index: i, n, bg })
                }}
              >
                {/* 카드 이미지 */}
                <div
                  style={{
                    height: isEven ? '63.7vh' : '51.1vh',
                    backgroundColor: bg,
                    borderRadius: '32px',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  {projects[(n - 1) % projects.length].thumbnail && (
                    <img
                      src={projects[(n - 1) % projects.length].thumbnail}
                      alt={projects[(n - 1) % projects.length].title}
                      loading="lazy"
                      draggable={false}
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                  )}
                </div>

                {/* 카드 텍스트 */}
                <div style={{ paddingLeft: '4px', paddingTop: '14px' }}>
                  <p className="leading-snug" style={{ ...type.cardTitle, color: c.textPrimary }}>
                    {projects[(n - 1) % projects.length].title}
                  </p>
                  <p className="leading-snug" style={{ ...type.cardSubtitle, color: c.textSecondary }}>
                    {projects[(n - 1) % projects.length].subtitle}
                  </p>
                </div>
              </div>
            )
          })}
        </motion.div>
      </div>

      {/* 하단 Footer */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between"
        style={{ height: '53px', paddingLeft: '32px', paddingRight: '32px', ...type.footer, color: c.textFooter }}
      >
        <span>Seobin yoon</span>
        <span>plumplum01@naver.com</span>
      </div>

      {/* 콘텐츠 오버레이 — body에 Portal로 렌더링 (z-index 스택 충돌 방지) */}
      {createPortal(
        <>
          {/* 블러 배경 — 항상 DOM에 존재하여 GPU 레이어를 미리 확보, opacity만 전환 */}
          <motion.div
            className="fixed inset-0 z-40"
            initial={false}
            animate={{ opacity: selectedCard ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              backgroundColor: colors.backdropPanel,
              pointerEvents: selectedCard ? 'auto' : 'none',
              willChange: 'opacity',
            }}
            onClick={handleClose}
          />

          {/* 콘텐츠 패널 */}
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
                  className="relative mx-auto rounded-[40px] overflow-hidden"
                  style={{
                    width: '100%',
                    maxWidth: 1120,
                    marginTop: 100,
                    marginBottom: 641,
                    backgroundColor: colors.panel,
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
