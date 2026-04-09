import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { type } from '../styles/typography'
import { colors, useColors } from '../styles/colors'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const c           = useColors()
  const navWidth    = isMobile ? 280 : 359
  const contentWidth = navWidth - 32
  const navigate    = useNavigate()
  const location    = useLocation()
  const isHome      = location.pathname === '/'

  // 메뉴 열릴 때 배경 스크롤 잠금
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* 배경 블러 오버레이 */}
      <motion.div
        className="fixed inset-0 z-20"
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          backgroundColor: colors.backdropNav,
          pointerEvents: isOpen ? 'auto' : 'none',
          willChange: 'opacity',
        }}
        onClick={() => setIsOpen(false)}
      />

      <nav
        className="fixed z-30 flex justify-center"
        style={{ top: 40, left: 0, right: 0, pointerEvents: 'none' }}
      >
        <motion.div
          animate={{
            height: isOpen ? 186 : 47,
            backgroundColor: isOpen ? c.navOpen : c.navClosed,
          }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          style={{
            width: navWidth,
            borderRadius: 12,
            overflow: 'hidden',
            pointerEvents: 'auto',
            position: 'relative',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          {/* 상단 타이틀 + 메뉴 버튼 */}
          <div
            style={{
              position: 'absolute',
              top: 14,
              left: 16,
              right: 16,
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              zIndex: 1,
            }}
          >
            <div />

            {/* 이름 (홈으로 이동) */}
            <span
              onClick={() => { navigate('/'); setIsOpen(false) }}
              style={{
                ...type.nav,
                color: colors.white,
                userSelect: 'none',
                cursor: 'pointer',
              }}
            >
              Seobin yoon
            </span>

            {/* 메뉴 열기/닫기 버튼 */}
            <button
              onClick={() => setIsOpen((o) => !o)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: 0,
                fontSize: 17,
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                width: 20,
                height: 20,
                opacity: 0.9,
                marginLeft: 'auto',
              }}
              aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
            >
              {isOpen ? '✕' : '≡'}
            </button>
          </div>

          {/* 메뉴 콘텐츠 (열렸을 때) */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, delay: 0.08 }}
                style={{ position: 'absolute', inset: 0 }}
              >
                {/* 페이지 이동 버튼 */}
                <div
                  style={{
                    position: 'absolute',
                    top: 54,
                    left: 16,
                    width: contentWidth,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 7,
                  }}
                >
                  {/* Home에선 About, About에선 Home 버튼 표시 */}
                  {isHome ? (
                    <button
                      className="bg-[#2c2c2c] hover:bg-[#3c3c3c] transition-colors duration-150"
                      style={{
                        ...type.nav,
                        height: 39,
                        borderRadius: 8,
                        border: 'none',
                        color: colors.white,
                        cursor: 'pointer',
                      }}
                      onClick={() => { navigate('/about'); setIsOpen(false) }}
                    >
                      About
                    </button>
                  ) : (
                    <button
                      className="bg-[#2c2c2c] hover:bg-[#3c3c3c] transition-colors duration-150"
                      style={{
                        ...type.nav,
                        height: 39,
                        borderRadius: 8,
                        border: 'none',
                        color: colors.white,
                        cursor: 'pointer',
                      }}
                      onClick={() => { navigate('/'); setIsOpen(false) }}
                    >
                      Home
                    </button>
                  )}

                  {/* 이메일 링크 */}
                  <a
                    href="mailto:plumplum01@naver.com"
                    className="bg-[#2c2c2c] hover:bg-[#3c3c3c] transition-colors duration-150"
                    style={{
                      ...type.nav,
                      height: 39,
                      borderRadius: 8,
                      border: 'none',
                      color: colors.white,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                    }}
                  >
                    Email
                  </a>
                </div>

                {/* 하단: 크레딧 + 다크모드 토글 */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 16,
                    right: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* 크레딧 텍스트 */}
                  <span style={{ ...type.caption, color: colors.captionGray, userSelect: 'none' }}>
                    Vibe Coded in Claude Code
                  </span>

                  {/* 다크/라이트 모드 토글 */}
                  <button
                    style={{
                      width: 18,
                      height: 18,
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255,255,255,0.7)',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginBottom: 2,
                    }}
                    aria-label="모드 전환"
                    onClick={toggleTheme}
                  >
                    {isDark ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" fill="rgba(255,255,255,0.75)" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="4" fill="rgba(255,255,255,0.85)" />
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                          <line
                            key={deg}
                            x1={12 + 6.5 * Math.cos((deg * Math.PI) / 180)}
                            y1={12 + 6.5 * Math.sin((deg * Math.PI) / 180)}
                            x2={12 + 9 * Math.cos((deg * Math.PI) / 180)}
                            y2={12 + 9 * Math.sin((deg * Math.PI) / 180)}
                            stroke="rgba(255,255,255,0.85)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        ))}
                      </svg>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </nav>
    </>
  )
}
