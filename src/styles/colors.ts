/**
 * 컬러 시스템
 *
 * 색상을 한 곳에서 관리합니다.
 * 값을 바꾸면 이 파일을 import한 모든 컴포넌트에 반영됩니다.
 *
 * 사용법:
 *   import { colors, useColors } from '../styles/colors'
 *
 *   // 테마 무관한 고정 색상
 *   style={{ backgroundColor: colors.panel }}
 *
 *   // 테마에 따라 달라지는 색상
 *   const c = useColors()
 *   style={{ color: c.textPrimary, backgroundColor: c.pageBg }}
 */

import { useThemeStore } from '../store/themeStore'

// ─── 고정 색상 (라이트/다크 무관) ──────────────────────────────────────────────

export const colors = {
  // 콘텐츠 패널 (오버레이 창)
  panel:         '#141414',   // 콘텐츠 패널 배경
  panelImageBg:  '#000003',   // 패널 내 이미지 플레이스홀더

  // 콘텐츠 패널 텍스트
  panelText:     '#ffffff',   // 패널 제목·본문
  panelMuted:    '#696969',   // 패널 레이블 ("상세", "설명")
  panelDetail:   '#a9a9a9',   // 패널 메타 정보 값

  // 네비게이션 버튼
  navBtn:        '#2c2c2c',   // 메뉴 버튼 기본 배경
  navBtnHover:   '#3c3c3c',   // 메뉴 버튼 hover 배경

  // 오버레이 배경
  backdropNav:   'rgba(0,0,0,0.25)',          // 네비게이션 배경 블러 오버레이
  backdropPanel: 'rgba(169,169,169,0.15)',    // 콘텐츠 패널 블러 오버레이

  // 기타
  white:         'rgba(250,250,250,1)',        // 순백 (버튼 텍스트 등)
  captionGray:   'rgba(153,153,153,1)',        // 캡션 텍스트
} as const

// ─── 테마별 색상 (isDark 에 따라 달라짐) ────────────────────────────────────────
// useColors() 훅을 통해 사용하세요.

function makeColors(isDark: boolean) {
  return {
    // 페이지 배경
    pageBg:       isDark ? '#181818'              : '#F4F4F4',
    aboutBg:      isDark ? '#181818'              : '#fafafa',   // About 페이지 배경

    // 텍스트
    heading:      isDark ? '#ffffff'              : '#000000',   // 섹션 헤딩
    textPrimary:  isDark ? 'rgba(255,255,255,0.7)': 'rgba(0,0,0,0.7)',   // 본문 주요 텍스트
    textSecondary:isDark ? 'rgba(255,255,255,0.4)': 'rgba(0,0,0,0.4)',   // 카드 서브타이틀 등
    textFooter:   isDark ? 'rgba(255,255,255,0.3)': 'rgba(0,0,0,0.5)',   // 푸터·하단 텍스트

    // 구분선
    divider:      isDark ? 'rgba(255,255,255,0.12)': 'rgba(0,0,0,0.12)',

    // About 페이지 링크 버튼
    btnBase:      isDark ? '#3a3838'              : 'rgb(153,149,149)',
    btnHover:     isDark ? '#555353'              : 'rgb(110,107,107)',

    // 네비게이션 탭
    navOpen:      isDark ? 'rgba(70,70,70,1)'     : 'rgba(32,32,32,1)',   // 메뉴 열렸을 때
    navClosed:    isDark ? 'rgba(255,255,255,0.18)': 'rgba(0,0,0,0.4)',   // 메뉴 닫혔을 때
  }
}

/** 테마에 따라 달라지는 색상을 반환하는 훅 */
export function useColors() {
  const isDark = useThemeStore((s) => s.isDark)
  return makeColors(isDark)
}
