import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

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
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-20"
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(0,0,0,0.25)',
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
            backgroundColor: isOpen ? 'rgba(32,32,32,1)' : 'rgba(0,0,0,0.4)',
          }}
          transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
          style={{
            width: 359,
            borderRadius: 12,
            overflow: 'hidden',
            pointerEvents: 'auto',
            position: 'relative',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          {/* Title row */}
          <div
            style={{
              position: 'absolute',
              top: 14,
              left: 138,
              width: 205,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 1,
            }}
          >
            <span
              style={{
                color: 'rgba(250,250,250,1)',
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: '-0.15px',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              Seobin yoon
            </span>

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
                justifyContent: 'center',
                width: 20,
                height: 20,
                opacity: 0.9,
              }}
              aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
            >
              {isOpen ? '✕' : '≡'}
            </button>
          </div>

          {/* Open 상태 콘텐츠 */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, delay: 0.12 }}
                style={{ position: 'absolute', inset: 0 }}
              >
                {/* About / Home + Email 버튼 */}
                <div
                  style={{
                    position: 'absolute',
                    top: 54,
                    left: 16,
                    width: 327,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 7,
                  }}
                >
                  {isHome ? (
                    <button
                      className="bg-[#2c2c2c] hover:bg-[#3c3c3c] transition-colors duration-150"
                      style={{
                        height: 39,
                        borderRadius: 8,
                        border: 'none',
                        color: 'rgba(250,250,250,1)',
                        fontSize: 15,
                        fontWeight: 500,
                        letterSpacing: '-0.15px',
                        cursor: 'pointer',
                      }}
                      onClick={() => { navigate('/about'); setIsOpen(false) }}
                    >
                      About
                    </button>
                  ) : (
                    <button
                      style={{
                        height: 39,
                        borderRadius: 8,
                        border: 'none',
                        backgroundColor: 'rgba(153,149,149,1)',
                        color: 'rgba(250,250,250,1)',
                        fontSize: 15,
                        fontWeight: 400,
                        letterSpacing: '-0.15px',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(120,116,116,1)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(153,149,149,1)')}
                      onClick={() => { navigate('/'); setIsOpen(false) }}
                    >
                      Home
                    </button>
                  )}
                  <a
                    href="mailto:plumplum01@naver.com"
                    className="bg-[#2c2c2c] hover:bg-[#3c3c3c] transition-colors duration-150"
                    style={{
                      height: 39,
                      borderRadius: 8,
                      border: 'none',
                      color: 'rgba(250,250,250,1)',
                      fontSize: 15,
                      fontWeight: 500,
                      letterSpacing: '-0.15px',
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

                {/* Vibe Coded + Mode Switch */}
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
                  <span
                    style={{
                      fontSize: 10,
                      color: 'rgba(153,153,153,1)',
                      letterSpacing: '-0.1px',
                      userSelect: 'none',
                      lineHeight: 1,
                    }}
                  >
                    Vibe Coded in Claude Code
                  </span>

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
