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

// ─── 휠 스크롤 → 가로 이동 변환 ────────────────────────────────────────────────

/**
 * 휠 deltaY 1px당 카드 가로 이동 px.
 * 값이 클수록 한 틱당 카드가 더 멀리 움직인다.
 * 튜닝 여지를 위해 상수로 노출.
 */
export const WHEEL_SENSITIVITY = 2.0

/**
 * 휠 이벤트의 deltaY를 카드 x 이동량으로 변환한다.
 *
 * 부호 규약: 스크롤 다운(deltaY > 0)이면 x가 감소(카드가 왼쪽으로 이동)하여
 * 새 카드가 오른쪽에서 들어온다. 기존 auto-scroll(`x -= AUTO_SCROLL_SPEED`)과
 * 동일한 방향이라 유휴 자동 스크롤과 일관된 흐름이 된다.
 *
 * deltaY 또는 sensitivity가 0일 때 explicit early return으로 `-0` 회귀를 회피한다
 * (Vitest의 `.toBe`는 `Object.is`를 써서 -0과 0을 구분).
 *
 * 순수 함수라 단위 테스트 가능. 추후 lenis 통합 시에도 같은 계약을
 * 만족해야 한다.
 */
export function wheelDeltaToX(deltaY: number, sensitivity: number): number {
  if (deltaY === 0 || sensitivity === 0) return 0
  return -deltaY * sensitivity
}
