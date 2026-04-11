/**
 * MobileHero
 *
 * md(768px) 미만에서 표시되는 모바일 메인 화면입니다.
 *
 * 구성:
 * - 프로젝트 카드 세로 목록
 * - 하단 이름/이메일 (Footer)
 * - 콘텐츠 오버레이: 카드를 탭하면 블러 배경 위로 상세 패널이 열립니다.
 */

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useScrollLock } from '../../hooks/useScrollLock'
import { projects } from '../../lib/projects'
import ContentContainer from '../ContentContainer'
import Footer from '../Footer'
import MobileCard from '../card/MobileCard'
import { ITEMS } from './constants'
import styles from './MobileHero.module.css'

const ICON_SIZE = 16

export default function MobileHero() {
  /** 현재 열려 있는 카드 번호 (null이면 닫힌 상태) */
  const [selectedN, setSelectedN] = useState<number | null>(null)
  const { lock, unlock } = useScrollLock()

  const handleClose = () => setSelectedN(null)

  // ─── ESC 키로 오버레이 닫기 ───────────────────────────────────────────────

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ─── 오버레이 열릴 때 body 스크롤 잠금 ───────────────────────────────────

  useEffect(() => {
    if (selectedN !== null) lock()
    else unlock()
  }, [selectedN, lock, unlock])

  // ─── 렌더 ─────────────────────────────────────────────────────────────────

  return (
    <section className={styles.section}>
      {/* 프로젝트 카드 목록 */}
      <div className={styles.cardList}>
        {ITEMS.map((n) => (
          <MobileCard key={n} n={n} onSelect={setSelectedN} />
        ))}
      </div>

      {/* 하단 이름/이메일 */}
      <Footer variant="mobile" />

      <div className={styles.spacer} />

      {/* 콘텐츠 오버레이 — body에 Portal로 렌더링 (z-index 스택 충돌 방지) */}
      {createPortal(
        <>
          {/* 블러 배경 */}
          <motion.div
            className={styles.backdrop}
            initial={false}
            animate={{ opacity: selectedN !== null ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ pointerEvents: selectedN !== null ? 'auto' : 'none' }}
            onClick={handleClose}
          />

          {/* 콘텐츠 패널 */}
          <AnimatePresence>
            {selectedN !== null && (
              <motion.div
                key="mobile-scroll-overlay"
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
                    project={projects[(selectedN - 1) % projects.length]}
                    onClose={handleClose}
                  />
                </motion.div>

                {/* 하단 닫기 버튼 — 블러 영역 */}
                <div className={styles.closeWrapper}>
                  <button
                    className={styles.closeButton}
                    onClick={(e) => { e.stopPropagation(); handleClose() }}
                  >
                    <X size={ICON_SIZE} />
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
