/**
 * GlobalNavigationBar — 전역 네비게이션 최상위 컨테이너
 *
 * 상태(열림 여부) 관리, 반응형 클래스 선택, 스크롤 잠금, 패널 wrapper와
 * 배경 blur overlay 렌더만 담당한다. 실제 내용은 NavHeader(항상)와
 * NavMenu(열림 시) 서브컴포넌트로 위임하여, 각 섹션이 자체 모션을
 * 독립적으로 정의할 수 있도록 경계를 긋는다.
 */

import { useState, useEffect, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollLock } from '../../../hooks/useScrollLock'
import { useIsMobile } from '../../../hooks/useIsMobile'
import { cn } from '../../../lib/cn'
import NavHeader from './NavHeader'
import NavMenu from './NavMenu'

// ─── 패널 지오메트리 (framer-motion spring) ──────────────────────────────
// CSS는 색상·outline·블러·padding만 담당하고, width/height/border-radius는
// 아래 값을 타겟으로 JS-driven spring으로 애니메이션된다. 닫힌 높이는
// NavHeader/NavMenu가 참조하는 CSS 변수까지 같은 상수에서 공급한다.

const PANEL_WIDTH = { desktop: 300, mobile: 280 } as const
const PANEL_EXPAND = { desktop: 120, mobile: 30 } as const
const PANEL_CLOSED_HEIGHT = 47
const PANEL_OPEN_HEIGHT = 200
const PANEL_CLOSED_RADIUS = 100
const PANEL_OPEN_RADIUS = 32

const panelSpring = {
  type: 'spring',
  bounce: 0.2,
  duration: 0.6,
} as const

export default function GlobalNavigationBar() {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()
  const { lock, unlock } = useScrollLock()

  // 메뉴 열릴 때 배경 스크롤 잠금
  useEffect(() => {
    if (isOpen) lock()
    else unlock()
  }, [isOpen, lock, unlock])

  const variant = isMobile ? 'mobile' : 'desktop'
  const baseWidth = PANEL_WIDTH[variant]
  const openWidth = baseWidth + PANEL_EXPAND[variant]

  const panelClassName = cn(
    'pointer-events-auto relative overflow-hidden bg-[var(--nav-closed)] outline-[var(--outline-width)] outline-[var(--panel-inset-border)]',
    'shadow-[0_0_16px_rgba(0,0,0,var(--shadow-opacity))] backdrop-blur-[var(--blur)] [-webkit-backdrop-filter:blur(var(--blur))]',
    '[--blur:24px] [--nav-fg:var(--nav-text)] [--nav-header-top:0px] [--nav-menu-top:calc(var(--nav-header-height)+7px)] [--outline-width:0px] [--shadow-opacity:0]',
    '[corner-shape:squircle] transition-[background-color,box-shadow,outline-width] duration-[250ms] ease-in-out hover:[--outline-width:3px]',
    isOpen && 'bg-[var(--nav-open)] [--nav-fg:var(--nav-text-open)] [--shadow-opacity:0.2]',
  )

  // 네비 본체는 닫힘 상태에서 translateY(40) 만큼 아래로 "숨어" 있다가
  // 메뉴가 열릴 때 0 으로 올라온다. CSS 의 .nav { top: 40px } 와 합쳐
  // 닫힘 = 80px, 열림 = 40px 의 위치가 된다. 열림 시 네비가 살짝
  // "떠오르는" 느낌을 주기 위한 의도적 디자인.
  const navAnimate = {
    translateY: isOpen ? 0 : 40,
  }

  const panelAnimate = {
    width: isOpen ? openWidth : baseWidth,
    height: isOpen ? PANEL_OPEN_HEIGHT : PANEL_CLOSED_HEIGHT,
    borderRadius: isOpen ? PANEL_OPEN_RADIUS : PANEL_CLOSED_RADIUS,
  }
  const panelStyle = {
    '--nav-header-height': `${PANEL_CLOSED_HEIGHT}px`,
  } as CSSProperties

  const closeMenu = () => setIsOpen(false)
  const toggleMenu = () => setIsOpen((o) => !o)

  return (
    <>
      {/* 배경 블러 오버레이 */}
      <motion.div
        className="fixed inset-0 z-20 bg-[var(--backdrop-nav)] backdrop-blur-[6px] [-webkit-backdrop-filter:blur(6px)] will-change-[opacity]"
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        onClick={closeMenu}
      />

      <motion.nav
        className="pointer-events-none fixed inset-x-0 top-10 z-30 flex justify-center"
        initial={false}
        animate={navAnimate}
        transition={panelSpring}
      >
        <motion.div
          className={panelClassName}
          style={panelStyle}
          initial={false}
          animate={panelAnimate}
          transition={panelSpring}
        >
          <NavHeader isOpen={isOpen} onToggle={toggleMenu} onClose={closeMenu} />
          <AnimatePresence>
            {isOpen && <NavMenu key="nav-menu" onClose={closeMenu} />}
          </AnimatePresence>
        </motion.div>
      </motion.nav>
    </>
  )
}
