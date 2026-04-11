/**
 * Hero 슬라이더 상수 및 타입
 *
 * 카드 개수, 크기, 속도 등 슬라이더 동작에 관한 설정값을 모아둡니다.
 * 카드를 추가하거나 레이아웃을 조정할 때 이 파일을 수정하세요.
 */

import { projects } from '../../data/projects'

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
  /** DESKTOP_ITEMS 배열 내 고유 인덱스 (0~23) */
  index: number
  /** 프로젝트 번호 (1~ITEM_COUNT) */
  n: number
  /** 카드 배경색 (CSS 변수 문자열) */
  bg: string
}
