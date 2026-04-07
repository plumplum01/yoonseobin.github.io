/**
 * 타이포그래피 시스템
 *
 * 폰트 크기, 굵기, 자간, 행간을 한 곳에서 관리합니다.
 * 값을 바꾸면 이 파일을 import한 모든 컴포넌트에 반영됩니다.
 *
 * 사용법:
 *   import { type } from '../styles/typography'
 *   <p style={type.body}>...</p>
 *   <h2 style={{ ...type.sectionHeading, color: heading }}>...</h2>
 */

import type { CSSProperties } from 'react'

// ─── 기본 토큰 ────────────────────────────────────────────────────────────────

export const fontSize = {
  xs:   10,   // 캡션, 작은 레이블
  sm:   12,   // 상세 메타 정보
  md:   13,   // 본문, 리스트 항목
  nav:  15,   // 네비게이션, 버튼
  lg:   14,   // 콘텐츠 상세 레이블
  xl:   24,   // 섹션 헤딩
  xxl:  32,   // 프로젝트 제목 (콘텐츠 패널)
} as const

export const fontWeight = {
  regular:  400,
  medium:   500,
  semibold: 600,
} as const

export const tracking = {
  tight:   '-0.13px',   // 본문 기본 자간 (fontSize.md 기준)
  nav:     '-0.15px',   // 네비게이션 자간 (fontSize.nav 기준)
  heading: '-0.24px',   // 섹션 헤딩 자간 (fontSize.xl 기준)
  card:    '-0.01em',   // 카드 타이틀 자간
  caption: '-0.1px',    // 캡션 자간 (fontSize.xs 기준)
  detail:  '0.28px',    // 콘텐츠 설명 자간
} as const

export const leading = {
  none:   1,     // 단일 행
  tight:  1.35,  // 리스트 항목, 짧은 텍스트
  base:   1.4,   // 콘텐츠 메타 정보
  body:   1.45,  // 콘텐츠 설명문
  loose:  1.7,   // About 본문
} as const

// ─── 조합된 텍스트 스타일 ──────────────────────────────────────────────────────

export const type = {

  /** 섹션 헤딩 — "Education", "Awards" 등 */
  sectionHeading: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    letterSpacing: tracking.heading,
  } satisfies CSSProperties,

  /** About 본문 단락 */
  body: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    lineHeight: leading.loose,
    letterSpacing: tracking.tight,
  } satisfies CSSProperties,

  /** 리스트 항목 타이틀 (수상명, 학교명 등) */
  listTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    letterSpacing: tracking.tight,
    lineHeight: leading.tight,
  } satisfies CSSProperties,

  /** 리스트 항목 설명 / 날짜 등 보조 텍스트 */
  listDetail: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    letterSpacing: tracking.tight,
    lineHeight: leading.tight,
  } satisfies CSSProperties,

  /** 네비게이션 및 버튼 레이블 */
  nav: {
    fontSize: fontSize.nav,
    fontWeight: fontWeight.medium,
    letterSpacing: tracking.nav,
    lineHeight: leading.none,
  } satisfies CSSProperties,

  /** 카드 타이틀 (슬라이더 카드) */
  cardTitle: {
    fontSize: fontSize.nav,
    fontWeight: fontWeight.semibold,
    letterSpacing: tracking.card,
  } satisfies CSSProperties,

  /** 카드 서브타이틀 (슬라이더 카드) */
  cardSubtitle: {
    fontSize: fontSize.nav,
    fontWeight: fontWeight.medium,
    letterSpacing: tracking.card,
  } satisfies CSSProperties,

  /** 콘텐츠 패널 — 프로젝트 제목 */
  contentTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.semibold,
  } satisfies CSSProperties,

  /** 콘텐츠 패널 — 섹션 레이블 ("상세", "설명") */
  contentLabel: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    lineHeight: leading.base,
  } satisfies CSSProperties,

  /** 콘텐츠 패널 — 메타 정보 (기간, 역할 등) */
  contentMeta: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: leading.base,
  } satisfies CSSProperties,

  /** 콘텐츠 패널 — 프로젝트 설명문 */
  contentBody: {
    fontSize: fontSize.lg,
    lineHeight: leading.body,
    letterSpacing: tracking.detail,
  } satisfies CSSProperties,

  /** 푸터 / 하단 소형 텍스트 */
  footer: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    letterSpacing: tracking.tight,
  } satisfies CSSProperties,

  /** 캡션 — "Vibe Coded in Claude Code" 등 */
  caption: {
    fontSize: fontSize.xs,
    letterSpacing: tracking.caption,
    lineHeight: leading.none,
  } satisfies CSSProperties,

} as const
