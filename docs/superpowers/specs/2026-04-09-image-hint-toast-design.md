# Image Hint Toast — Design Spec

**Date:** 2026-04-09  
**Status:** Approved

## Problem

이미지를 클릭하면 라이트박스로 크게 볼 수 있지만, 이미지에 `cursor-zoom-in`만 적용되어 있어 사용자가 이 기능을 인지하기 어렵다.

## Solution

프로젝트 패널에서 이미지 영역이 뷰포트에 처음 진입하는 시점에 힌트 토스트를 표시한다.

## Design Decisions

| 항목 | 결정 |
|---|---|
| 위치 | 뷰포트 하단 중앙 (`fixed bottom-8 left-1/2 -translate-x-1/2`) |
| 빈도 | 세션당 한 번 (`sessionStorage`) |
| 트리거 | 첫 이미지 요소가 뷰포트에 진입할 때 (`IntersectionObserver`) |
| 아이콘 | 없음 (텍스트만) |
| 텍스트 | "이미지를 클릭하면 크게 볼 수 있어요" |
| 표시 시간 | 3초 후 자동 페이드아웃 |
| 애니메이션 | Framer Motion `AnimatePresence` — fade in (0.3s) / fade out (0.3s) |

## Component Structure

### `src/components/Toast.tsx` (신규)

props:
- `message: string`
- `visible: boolean`

`AnimatePresence`로 감싸고, `visible`이 `false`로 바뀌면 fade out 후 언마운트.

스타일:
- `position: fixed`, `bottom: 32px`, `left: 50%`, `transform: translateX(-50%)`
- `z-index: 150` (라이트박스 z-index 200 아래)
- `background: rgba(255,255,255,0.1)`
- `backdrop-filter: blur(12px)`
- `border: 1px solid rgba(255,255,255,0.15)`
- `border-radius: 999px`
- `padding: 9px 16px`
- `font-size: 13px`, `color: rgba(255,255,255,0.6)`, `letter-spacing: 0.01em`
- `pointer-events: none`

### `ContentContainer.tsx` (수정)

1. `showToast` state 추가 (`boolean`, 초기값 `false`)
2. Detail 탭 이미지 목록 중 **첫 번째 `<div>`** (index 0, `cursor-zoom-in` 요소)에 `imageRef` 연결
   - Scene 탭은 별도 observe 안 함 — Detail이 기본 탭이므로 충분
3. `useEffect`에서 `IntersectionObserver` 설정:
   - `sessionStorage.getItem('image-hint-shown')` 확인
   - 없으면 → 뷰포트 진입 시 `showToast = true`, sessionStorage 키 저장, observer disconnect
4. 3초 후 `showToast = false`로 (setTimeout)
5. `<Toast>` 컴포넌트를 `createPortal`로 `document.body`에 렌더

## State Flow

```
패널 열림
  └─ IntersectionObserver 등록 (첫 이미지 ref)
       └─ 이미지가 뷰포트에 진입
            └─ sessionStorage에 키 있음? → 아무것도 안함
            └─ 없음 → showToast = true, 키 저장, observer disconnect
                 └─ 3초 후 → showToast = false (fade out)
```

## Edge Cases

- **탭 전환 (Detail ↔ Scene)**: sessionStorage 키가 이미 있으면 재표시 안 함
- **다른 프로젝트로 전환**: 같은 세션이면 다시 안 뜸 (키 유지)
- **라이트박스 열려 있을 때**: 토스트 z-index(150)가 라이트박스(200) 아래라 자연스럽게 가려짐
- **탭 닫으면**: sessionStorage 초기화 → 다음 방문 시 다시 표시

## Files to Change

- `src/components/Toast.tsx` — 신규 생성
- `src/components/ContentContainer.tsx` — observer 로직 + Toast 렌더링 추가
