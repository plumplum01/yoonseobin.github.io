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
import { projects } from '../../lib/projects'
import site from '../../data/site.json'
import ContentContainer from '../ContentContainer'
import { useScrollLock } from '../../hooks/useScrollLock'
import {
  DESKTOP_ITEMS,
  DESKTOP_ITEM_WIDTH_VW,
  DESKTOP_ITEM_GAP,
  AUTO_SCROLL_SPEED,
  ITEM_COUNT,
  WHEEL_SENSITIVITY,
  wheelDeltaToX,
  type SelectedCard,
} from './constants'
import styles from './DesktopHero.module.css'

export default function DesktopHero() {
  // ─── 슬라이더 상태 ────────────────────────────────────────────────────────

  /** 슬라이더의 현재 X 위치 (framer-motion MotionValue) */
  const x = useMotionValue(0)

  /** 카드 한 세트의 전체 너비 (px) — resize 시 재계산 */
  const oneSetWidthRef = useRef(0)

  /** wheel 이벤트 리스너를 붙일 section 엘리먼트 참조 */
  const sectionRef = useRef<HTMLElement>(null)

  /** 드래그 중 여부 — 자동 스크롤 일시 정지에 사용 */
  const isDragging = useRef(false)

  /** 드래그가 실제로 발생했는지 — 드래그 후 onClick 방지 */
  const hasDragged = useRef(false)

  // ─── 오버레이 상태 ────────────────────────────────────────────────────────

  /** 현재 열려 있는 카드 정보 (null이면 닫힌 상태) */
  const [selectedCard, setSelectedCard] = useState<SelectedCard | null>(null)
  const { lock, unlock } = useScrollLock()

  /**
   * ref로도 selectedCard를 추적합니다.
   * useAnimationFrame 내부에서는 state 클로저가 stale해지므로
   * ref를 통해 최신값을 참조합니다.
   */
  const selectedCardRef = useRef<SelectedCard | null>(null)

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
    if (selectedCard) lock()
    else unlock()
  }, [selectedCard, lock, unlock])

  // ─── 휠 → 가로 이동 연결 ────────────────────────────────────────────────
  // section 위에서 세로 휠/트랙패드 입력을 가로 x 이동으로 변환한다.
  // preventDefault()로 페이지 세로 스크롤을 차단하려면 { passive: false } 필수.
  // 기존 auto-scroll, drag, 오버레이 로직과 커플링 없음 — 오직 x에만 쓴다.

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      x.set(x.get() + wheelDeltaToX(e.deltaY, WHEEL_SENSITIVITY))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [x])

  // ─── 렌더 ─────────────────────────────────────────────────────────────────

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* 무한 드래그 슬라이더 */}
      <div className={styles.sliderViewport}>
        <motion.div
          drag="x"
          dragConstraints={{ left: -999999, right: 999999 }}
          dragElastic={0}
          dragTransition={{ power: 0, timeConstant: 0 }}
          style={{ x, gap: DESKTOP_ITEM_GAP }}
          className={styles.sliderTrack}
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

            return (
              <div
                key={i}
                className={styles.card}
                style={{
                  width: `${DESKTOP_ITEM_WIDTH_VW}vw`,
                  marginTop: isEven ? '17.7vh' : '30.2vh',
                }}
                onClick={() => {
                  if (!hasDragged.current) selectCard({ index: i, n, bg })
                }}
              >
                {/* 카드 이미지 */}
                <div
                  className={styles.cardImage}
                  style={{
                    height: isEven ? '63.7vh' : '51.1vh',
                    backgroundColor: bg,
                  }}
                >
                  {projects[(n - 1) % projects.length].thumbnail && (
                    <img
                      src={projects[(n - 1) % projects.length].thumbnail}
                      alt={projects[(n - 1) % projects.length].title}
                      loading="lazy"
                      draggable={false}
                    />
                  )}
                </div>

                {/* 카드 텍스트 */}
                <div className={styles.cardText}>
                  <p className={`t-card-title ${styles.cardTitle}`}>
                    {projects[(n - 1) % projects.length].title}
                  </p>
                  <p className={`t-card-subtitle ${styles.cardSubtitle}`}>
                    {projects[(n - 1) % projects.length].subtitle}
                  </p>
                </div>
              </div>
            )
          })}
        </motion.div>
      </div>

      {/* 하단 Footer */}
      <div className={`t-footer ${styles.footer}`}>
        <span>{site.nameDisplay}</span>
        <span>{site.email}</span>
      </div>

      {/* 콘텐츠 오버레이 — body에 Portal로 렌더링 (z-index 스택 충돌 방지) */}
      {createPortal(
        <>
          {/* 블러 배경 — 항상 DOM에 존재하여 GPU 레이어를 미리 확보, opacity만 전환 */}
          <motion.div
            className={styles.backdrop}
            initial={false}
            animate={{ opacity: selectedCard ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ pointerEvents: selectedCard ? 'auto' : 'none' }}
            onClick={handleClose}
          />

          {/* 콘텐츠 패널 */}
          <AnimatePresence>
            {selectedCard !== null && (
              <motion.div
                key="scroll-overlay"
                className={styles.overlay}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
                exit={{ opacity: 0, y: -80, transition: { duration: 0.35, ease: [0.4, 0, 0.6, 1] } }}
                onClick={handleClose}
              >
                <motion.div
                  className={styles.panel}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ContentContainer
                    project={projects[(selectedCard.n - 1) % projects.length]}
                    onClose={handleClose}
                  />
                </motion.div>

                {/* 하단 닫기 버튼 — 블러 영역 */}
                <div className={styles.closeWrapper}>
                  <button
                    className={styles.closeButton}
                    onClick={(e) => { e.stopPropagation(); handleClose() }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </section>
  )
}
