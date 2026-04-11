/**
 * Hero 슬라이더 상수 및 타입
 *
 * 카드 개수, 크기, 속도 등 슬라이더 동작에 관한 설정값을 모아둡니다.
 * 카드를 추가하거나 레이아웃을 조정할 때 이 파일을 수정하세요.
 */

import { projects } from '../../lib/projects'

// ─── 카드 목록 ────────────────────────────────────────────────────────────────

/** 표시할 프로젝트 카드 수 — projects 배열 길이와 항상 동기화됨 */
export const ITEM_COUNT = projects.length

/** 1~ITEM_COUNT 숫자 배열 */
export const ITEMS = Array.from({ length: ITEM_COUNT }, (_, i) => i + 1)

// ─── 데스크탑 슬라이더 설정 ───────────────────────────────────────────────────

/** 카드 하나의 너비 (vw 단위) */
export const DESKTOP_ITEM_WIDTH_VW = 45.6

/** 카드 사이 간격 (px) */
export const DESKTOP_ITEM_GAP = 12

/** 자동 스크롤 속도 — px per frame (60fps 기준 ~30px/s) */
export const AUTO_SCROLL_SPEED = 0.5

/**
 * 무한 루프를 위해 카드를 3벌 복제한 배열
 * 앞/뒤 경계에 도달하면 중간 세트로 순간이동해 연속성을 유지합니다.
 */
export const DESKTOP_ITEMS = [...ITEMS, ...ITEMS, ...ITEMS]

// ─── 타입 ─────────────────────────────────────────────────────────────────────

/** 데스크탑에서 선택된 카드 정보 */
export interface SelectedCard {
  /** DESKTOP_ITEMS 배열 내 고유 인덱스 (0 ~ ITEM_COUNT*3-1) */
  index: number
  /** 프로젝트 번호 (1~ITEM_COUNT) */
  n: number
  /** 카드 배경색 (CSS 변수 문자열) */
  bg: string
}

// ─── 휠 민감도 ────────────────────────────────────────────────────────────────

/**
 * Lenis wheelMultiplier에 전달되는 민감도 상수.
 * 값이 클수록 한 틱당 Lenis 가상 scroll이 더 많이 증가한다.
 */
export const WHEEL_SENSITIVITY = 1.2

// ─── 프레임 전이 함수 ────────────────────────────────────────────────────────

/** stepHeroFrame 입력 */
export interface HeroFrameInput {
  /** 현재 x 좌표 (px, 음수) */
  x: number
  /** 이번 프레임 Lenis scroll 델타 — 양수면 카드가 왼쪽으로 */
  lenisDelta: number
  /** auto-scroll 활성 여부 (오버레이 닫힘 시 true) */
  autoScrollEnabled: boolean
  /** 카드 한 세트 전체 너비 — 0이면 아직 init 전 */
  oneSetWidth: number
}

/**
 * 한 프레임의 x 좌표 전이 계산.
 *
 * 순수 함수. 입력을 받아 다음 x를 반환한다. 부수효과 없음.
 *
 * 적용 순서:
 *   1. next = x - lenisDelta         // lenis 휠 입력
 *   2. autoScroll 활성 시 next -= AUTO_SCROLL_SPEED
 *   3. 무한 루프 경계 체크 (oneSetWidth > 0일 때만)
 *      - next <= -2w : next += w
 *      - next >=  0  : next -= w
 *
 * 경계 체크가 마지막에 한 번만 일어나도록 설계 — lenisDelta와 auto-scroll로
 * 한 프레임에 경계를 넘어도 한 번의 wrap으로 교정된다.
 */
export function stepHeroFrame(input: HeroFrameInput): number {
  let next = input.x - input.lenisDelta
  if (input.autoScrollEnabled) next -= AUTO_SCROLL_SPEED
  const w = input.oneSetWidth
  if (w > 0) {
    if (next <= -2 * w) next += w
    else if (next >= 0) next -= w
  }
  return next
}
