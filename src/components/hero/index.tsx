/**
 * Hero — 메인 화면 진입점
 *
 * 화면 너비에 따라 레이아웃을 분기합니다.
 * - md(768px) 이상 → DesktopHero (무한 드래그 슬라이더)
 * - md(768px) 미만 → MobileHero  (세로 카드 목록)
 */

import DesktopHero from './DesktopHero'
import MobileHero from './MobileHero'

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
