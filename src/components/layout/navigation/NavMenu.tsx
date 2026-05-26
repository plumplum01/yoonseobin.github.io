/**
 * NavMenu — 열렸을 때의 메뉴 내부 콘텐츠
 *
 * 페이지 이동 버튼(Home/About + Email)과 하단 크레딧 + 테마 토글을
 * 담당한다. AnimatePresence 아래에서 조건부 마운트되며, 자체 fade
 * 모션을 소유한다. 부모(GlobalNavigationBar)는 "언제 보일지"만 결정하고
 * "어떻게 나타날지"는 이 컴포넌트가 책임진다.
 */

import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { AppRoutePath } from '../../../app/router'
import { cn } from '../../../lib/cn'
import { site } from '../../../registry/site'
import { buttonVariants } from '../../ui'
import ThemeToggle from '../../features/theme/ThemeToggle'

interface Props {
  onClose: () => void
}

export default function NavMenu({ onClose }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  const goTo = (path: AppRoutePath) => {
    navigate(path)
    onClose()
  }

  const menuItemClassName = cn(buttonVariants({ variant: 'nav', size: 'navItem' }), 'rounded-sm')

  return (
    <motion.div
      className="flex h-full flex-col box-border pt-[var(--nav-menu-top)] pb-2.5"
      initial={{
        scale: 0.9,
        opacity: 0,
        filter: 'blur(5px)',
      }}
      animate={{
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        transition: { delay: 0.05 },
      }}
      exit={{
        scale: 0.9,
        opacity: 0,
        filter: 'blur(5px)',
      }}
      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
    >
      {/* 페이지 이동 버튼 */}
      <div className="flex flex-col gap-2 px-3">
        {/* Home에선 About, About에선 Home 버튼 표시 */}
        {isHome ? (
          <button
            type="button"
            className={menuItemClassName}
            onClick={() => goTo('/about')}
          >
            About
          </button>
        ) : (
          <button
            type="button"
            className={menuItemClassName}
            onClick={() => goTo('/')}
          >
            Home
          </button>
        )}

        {/* 이메일 링크 */}
        <a
          href={`mailto:${site.email}`}
          className={menuItemClassName}
        >
          Email
        </a>
      </div>

      {/* 하단: 크레딧 + 다크모드 토글 */}
      <footer className="mt-auto flex items-center">
        <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap pl-4 text-left text-caption leading-none tracking-caption text-[var(--caption-gray)] select-none">
          {site.credit}
        </span>
        <div className="pr-1.5">
          <ThemeToggle />
        </div>
      </footer>
    </motion.div>
  )
}
