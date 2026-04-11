/**
 * Hero — 메인 화면 진입점
 *
 * 뷰포트 크기에 따라 한 시점에 하나의 Hero만 마운트한다.
 * - md(768px) 이상 → DesktopHero (무한 드래그 슬라이더)
 * - md(768px) 미만 → MobileHero  (세로 카드 목록)
 *
 * 이전에는 두 Hero를 모두 DOM에 두고 CSS로 가렸는데, 숨겨진 Hero의
 * useEffect(Lenis 초기화, 이미지 eager 프리디코드 등)도 실행되어
 * 모바일 기기에서 데스크탑 Hero의 초기화 비용을 부담하고 있었다.
 * useIsMobile 훅으로 조건부 마운트하여 이 낭비를 제거한다.
 */

import DesktopHero from './DesktopHero'
import MobileHero from './MobileHero'
import { useIsMobile } from '../../hooks/useIsMobile'

export default function Hero() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileHero /> : <DesktopHero />
}
