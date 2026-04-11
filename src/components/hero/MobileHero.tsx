/**
 * MobileHero
 *
 * md(768px) 미만에서 표시되는 모바일 메인 화면입니다.
 *
 * 구성:
 * - 상단 이름/이메일
 * - 프로젝트 카드 세로 목록
 * - 콘텐츠 오버레이: 카드를 탭하면 블러 배경 위로 상세 패널이 열립니다.
 */

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useThemeStore } from '../../store/themeStore'
import { useScrollLock } from '../../hooks/useScrollLock'
import { type } from '../../styles/typography'
import { colors, useColors } from '../../styles/colors'
import { projects } from '../../lib/projects'
import site from '../../data/site.json'
import ContentContainer from '../ContentContainer'
import { ITEMS } from './constants'

export default function MobileHero() {
  const isDark = useThemeStore((s) => s.isDark)
  const c = useColors()

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
    <section
      className="text-left relative"
      style={{ paddingBottom: '40px', backgroundColor: c.pageBg }}
    >
      {/* 상단 이름/이메일 */}
      <div
        className="flex flex-col"
        style={{
          marginLeft: '12px',
          paddingTop: '112px',
          marginBottom: '24px',
          ...type.footer,
          color: c.textFooter,
        }}
      >
        <span>{site.nameDisplay}</span>
        <span>{site.email}</span>
      </div>

      {/* 프로젝트 카드 목록 */}
      <div className="flex flex-col" style={{ marginLeft: '12px', gap: '18px' }}>
        {ITEMS.map((n) => {
          const project = projects[(n - 1) % projects.length]
          return (
            <div
              key={n}
              className="flex flex-col flex-shrink-0"
              style={{ width: 'calc(100vw - 24px)', minWidth: '351px', cursor: 'pointer' }}
              onClick={() => setSelectedN(n)}
            >
              {/* 카드 이미지 */}
              <div
                style={{
                  aspectRatio: '1 / 1',
                  backgroundColor: isDark ? 'var(--card-odd)' : '#e3e3e3',
                  borderRadius: '18px',
                  overflow: 'hidden',
                }}
              >
                {project.thumbnail && (
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    loading="lazy"
                    draggable={false}
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                )}
              </div>

              {/* 카드 텍스트 */}
              <div style={{ paddingLeft: '4px', paddingTop: '8px', paddingBottom: '8px' }}>
                <p className="leading-snug" style={{ ...type.cardTitle, color: c.textPrimary }}>
                  {project.title}
                </p>
                <p className="leading-snug" style={{ ...type.cardSubtitle, color: c.textSecondary }}>
                  {project.subtitle}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ height: '40px' }} />

      {/* 콘텐츠 오버레이 — body에 Portal로 렌더링 (z-index 스택 충돌 방지) */}
      {createPortal(
        <>
          {/* 블러 배경 */}
          <motion.div
            className="fixed inset-0 z-40"
            initial={false}
            animate={{ opacity: selectedN !== null ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              backgroundColor: colors.backdropPanel,
              pointerEvents: selectedN !== null ? 'auto' : 'none',
              willChange: 'opacity',
            }}
            onClick={handleClose}
          />

          {/* 콘텐츠 패널 */}
          <AnimatePresence>
            {selectedN !== null && (
              <motion.div
                key="mobile-scroll-overlay"
                className="fixed inset-0 z-50 overflow-y-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
                exit={{ opacity: 0, y: -80, transition: { duration: 0.35, ease: [0.4, 0, 0.6, 1] } }}
                onClick={handleClose}
              >
                <motion.div
                  className="relative mx-auto rounded-[20px] overflow-hidden"
                  style={{
                    width: 'calc(100vw - 24px)',
                    marginTop: 40,
                    backgroundColor: colors.panel,
                    willChange: 'transform, opacity',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ContentContainer
                    project={projects[(selectedN - 1) % projects.length]}
                    onClose={handleClose}
                    isMobile
                  />
                </motion.div>

                {/* 하단 닫기 버튼 — 블러 영역 */}
                <div
                  className="flex justify-center"
                  style={{ paddingTop: '48px', paddingBottom: '80px' }}
                >
                  <button
                    className="flex items-center justify-center w-12 h-12 rounded-full text-white/70 hover:text-white transition-all"
                    style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
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
