# Hero Wheel → Horizontal Scroll Sync

**Date:** 2026-04-11
**Branch:** `feat/hero-scroll-sync`
**Status:** Design approved, ready for implementation plan

## Problem

`DesktopHero`는 현재 두 가지 방식으로 카드를 가로로 이동시킨다.

1. **Auto-scroll:** `useAnimationFrame`이 매 프레임 `x -= 0.5`px 적용 (`AUTO_SCROLL_SPEED`)
2. **Drag:** framer-motion의 `drag="x"`로 사용자가 가로로 끌 수 있음

데스크탑 사용자가 일반적으로 기대하는 세 번째 입력 경로 — **마우스 휠/트랙패드의 수직 스크롤** — 가 카드 탐색에 연결되지 않는다. 유저는 세로 스크롤로 아래 섹션을 내려보려 하지만 현재 홈 페이지 아래 섹션(`<About />`, `<Contact />`)이 빈 스텁이라 보이는 결과가 없고, 카드도 움직이지 않아 상호작용 피드백이 없다.

이 기능의 목표: 휠/트랙패드 수직 입력을 히어로에서 가로 카드 이동으로 변환. 기존 auto-scroll과 drag 동작은 그대로 둠.

## Requirements

### Functional

1. **Wheel → X 변환.** 사용자가 `DesktopHero` 위에서 휠/트랙패드를 수직으로 움직이면 카드가 가로로 이동한다.
2. **방향 일관성.** 스크롤 다운(`deltaY > 0`)은 카드를 왼쪽으로 이동시킨다 (기존 auto-scroll과 동일 방향 → 새 카드가 오른쪽에서 들어옴).
3. **무한 루프 유지.** 휠로 인한 `x` 변경도 기존 경계 순간이동 핸들러가 감지해 중간 세트로 리셋한다 (수정 불필요, 자동 작동).
4. **Auto-scroll 공존.** 유휴 시 auto-scroll이 계속 작동. 휠 입력 시 `x`에 가산되어 겹친다. 별도의 일시정지 로직 없음 (추후 별도 브랜치에서 다룸).
5. **Drag 공존.** 드래그 기능은 그대로 유지. 휠과 드래그가 동시에 발생해도 `x`에 독립적으로 쓰므로 충돌 없음 (추후 별도 브랜치에서 드래그 제거 예정).
6. **페이지 세로 스크롤 차단.** 히어로 위에서 `wheel` 이벤트는 `preventDefault()`로 브라우저 기본 스크롤을 막는다.
7. **MobileHero 영향 없음.** 모바일 히어로는 네이티브 세로 스크롤(카드 세로 목록)을 유지한다. 변경 없음.

### Non-Functional

1. **단일 진입점.** 휠 로직은 `DesktopHero`의 단일 `useEffect`에 국한된다.
2. **의존성 최소화.** 기존 refs(`isDragging`, `hasDragged`, `selectedCardRef`)나 훅을 읽거나 쓰지 않는다.
3. **삭제 용이.** 이 기능을 제거하려면 `useEffect` 1개 + `sectionRef` 1개 + `WHEEL_SENSITIVITY` 상수 1줄만 삭제하면 된다. 다른 로직 수정 불필요.
4. **TDD.** 방향 부호와 계산 로직은 순수 함수로 추출해 단위 테스트한다.

### Out of Scope (future branches)

- 드래그 제거
- 사용자 휠 입력 시 auto-scroll 일시정지
- 오버레이 열림 상태에서 휠 비활성화 (portal-based DOM 격리로 자동 처리됨)
- 방향/민감도 런타임 튜닝 (UI 설정)
- 키보드 접근성 (화살표 키로 카드 좌우 이동)
- `deltaX` 수평 트랙패드 제스처 처리
- 디바이스별 민감도 분기 (마우스 휠 vs 트랙패드)
- **부드러운 스크롤링 (lenis 통합)** — 별도 브랜치 예정. 아래 "Future: Lenis Integration" 섹션 참고.

## Architecture

### 세 가지 입력 소스, 하나의 공유 상태

```
┌─────────────────────┐
│   Auto-scroll       │──┐
│  (useAnimationFrame)│  │
└─────────────────────┘  │
                         │    ┌───────────────┐     ┌──────────────────┐
┌─────────────────────┐  ├──→ │  x            │ ──→ │ slider transform │
│   Drag (motion.div) │──┤    │ (MotionValue) │     │  (translateX)    │
└─────────────────────┘  │    └───────────────┘     └──────────────────┘
                         │           ↑
┌─────────────────────┐  │           │
│   Wheel (NEW)       │──┘           │
│  (section listener) │              │
└─────────────────────┘              │
                                     │
                            ┌────────┴────────┐
                            │ 무한 루프 핸들러 │
                            │ (x.on('change'))│
                            └─────────────────┘
```

세 소스 모두 독립적으로 `x` MotionValue에 쓴다. 서로 참조하지 않는다. `x.on('change')` 핸들러가 경계 감지 + 순간이동으로 무한 루프를 유지한다 (휠 입력에도 자동 적용됨).

### 커플링 매트릭스

| 기능 A ↓ 기능 B → | Auto-scroll | Drag | Wheel |
|---|---|---|---|
| Auto-scroll | — | `isDragging`으로 일시정지 (기존) | 영향 없음 |
| Drag | 드래그 중 auto-scroll 정지 | — | 영향 없음 |
| Wheel (NEW) | 영향 없음 | 영향 없음 | — |

Wheel은 어느 쪽도 건드리지 않는다. 오직 `x` MotionValue를 쓸 뿐. 이게 "커플링 없음"의 정의.

## Components

### Pure function: `wheelDeltaToX(deltaY, sensitivity)`

**파일:** `src/components/hero/constants.ts`

```ts
/**
 * 휠 이벤트의 deltaY를 카드 x 이동량으로 변환한다.
 * 스크롤 다운(deltaY > 0) → x 감소(카드 왼쪽으로 이동) → 새 카드 오른쪽에서 진입.
 * 기존 auto-scroll과 방향 일치.
 */
export function wheelDeltaToX(deltaY: number, sensitivity: number): number {
  return -deltaY * sensitivity
}

/** 휠 deltaY 1px당 카드 가로 이동 px */
export const WHEEL_SENSITIVITY = 2.0
```

순수 함수라 단위 테스트 가능. 방향 부호와 sensitivity 계산의 올바름을 검증한다.

### DOM event listener: `DesktopHero` `useEffect`

**파일:** `src/components/hero/DesktopHero.tsx`

```tsx
const sectionRef = useRef<HTMLElement>(null)

useEffect(() => {
  const el = sectionRef.current
  if (!el) return
  const onWheel = (e: WheelEvent) => {
    e.preventDefault()
    x.set(x.get() + wheelDeltaToX(e.deltaY, WHEEL_SENSITIVITY))
  }
  el.addEventListener('wheel', onWheel, { passive: false })
  return () => el.removeEventListener('wheel', onWheel)
}, [x])

return (
  <section ref={sectionRef} className={styles.section}>
    ...
```

- `sectionRef`는 `<section>` 엘리먼트에 붙는다.
- `{ passive: false }` 필수 — 없으면 `preventDefault()`가 무효.
- 의존성 배열에 `x`만 포함 (framer-motion MotionValue는 안정된 참조라 재등록 발생 안 함).

## Data Flow

1. 사용자가 휠/트랙패드를 수직으로 움직임
2. 브라우저가 `wheel` 이벤트를 `<section>`에 디스패치
3. `onWheel(e)` 실행: `e.preventDefault()` + `x.set(x.get() + wheelDeltaToX(e.deltaY, WHEEL_SENSITIVITY))`
4. `x` MotionValue가 변경됨
5. framer-motion이 자동으로 `<motion.div>`의 `transform: translateX(...)`를 갱신
6. `x.on('change')` 핸들러가 발화 → 경계 감지 → 필요 시 중간 세트로 순간이동 (무한 루프 유지)

## Error Handling

- **`sectionRef.current`가 null일 때:** `useEffect` 내부에서 early return.
- **`passive: false`를 잊어서 preventDefault 실패:** 개발 중 즉시 발견됨 (페이지가 스크롤됨). 타입 시스템으로는 잡히지 않음. 이 사양이 그 필수 플래그를 명시함으로써 완화.
- **`x.on('change')` 핸들러가 무한 루프를 감지 못 할 만큼 큰 jump:** 휠 한 틱의 deltaY는 보통 100~120px, `WHEEL_SENSITIVITY = 2.0`이면 200~240px. 카드 한 장 너비(`45.6vw` ≈ 700px)보다 작으므로 경계 점프 로직이 문제없이 따라잡음.
- **오버레이 열림 중 휠:** Portal 기반으로 DOM 트리상 hero 밖에 렌더링됨 → 휠 이벤트가 hero section에 도달하지 않음 → 자동으로 비활성. 코드 조치 불필요.

## Testing Strategy

### Unit (TDD)

**파일:** `src/test/heroScroll.test.ts` (신규)

```ts
import { wheelDeltaToX } from '../components/hero/constants'

describe('wheelDeltaToX', () => {
  it('스크롤 다운(deltaY 양수)은 x를 감소시킨다', () => {
    expect(wheelDeltaToX(100, 2)).toBe(-200)
  })
  it('스크롤 업(deltaY 음수)은 x를 증가시킨다', () => {
    expect(wheelDeltaToX(-100, 2)).toBe(200)
  })
  it('deltaY가 0이면 0을 반환한다', () => {
    expect(wheelDeltaToX(0, 2)).toBe(0)
  })
  it('sensitivity가 0이면 항상 0을 반환한다', () => {
    expect(wheelDeltaToX(100, 0)).toBe(0)
  })
  it('fractional deltaY도 정확히 처리한다 (트랙패드)', () => {
    expect(wheelDeltaToX(7.5, 2)).toBe(-15)
  })
})
```

테스트 먼저 작성 → 실패 확인 → 구현 → 통과 확인 (프로젝트 TDD 규칙).

### Integration

현재 프로젝트는 `@testing-library/react` + `jsdom`을 갖추고 있다. 필요 시 DesktopHero 마운트 후 `fireEvent.wheel(sectionEl, { deltaY: 100 })`로 통합 테스트 가능하지만, 이번 스코프에서는 **생략한다**:
- jsdom은 framer-motion의 `useAnimationFrame` 동작을 완전히 시뮬레이션하지 못함
- 순수 함수 단위 테스트 + 시각 검증으로 충분

### 시각 검증

`npm run dev` 실행 후 브라우저에서:
1. 데스크탑 뷰포트에서 히어로 위에 마우스 올리고 휠 아래 → 카드가 왼쪽으로 이동하는지 확인
2. 휠 위 → 카드가 오른쪽으로
3. 트랙패드 제스처로도 동일 동작 확인
4. 유휴 상태에서 auto-scroll 여전히 작동 확인
5. 드래그 여전히 작동 확인
6. 카드 클릭 → 오버레이 열림, 오버레이 내에서 휠은 히어로 카드에 영향 없음 확인
7. 모바일 뷰포트(`< 768px`)에서는 MobileHero가 세로 스크롤 유지 확인

## File Changes

| 파일 | 변경 유형 | 내용 |
|---|---|---|
| `src/components/hero/constants.ts` | 수정 | `WHEEL_SENSITIVITY` 상수 + `wheelDeltaToX` 순수 함수 추가 |
| `src/components/hero/DesktopHero.tsx` | 수정 | `sectionRef` 선언 + `<section>`에 ref 연결 + wheel `useEffect` 추가 |
| `src/test/heroScroll.test.ts` | 신규 | `wheelDeltaToX` 단위 테스트 5개 |

기존 로직(auto-scroll useEffect, 경계 순간이동, 드래그 핸들러, 오버레이)은 **전혀 수정하지 않는다**.

## Rollback Plan

이 기능에 문제가 생겨 제거해야 할 경우:

1. `git revert <commit-sha>` (단일 커밋 revert로 충분)
2. 또는 수동으로 세 파일의 추가 부분만 제거

다른 기능에 파급 효과 없음.

## Future: Lenis Integration

`lenis@^1.3.21`이 이미 `package.json`에 설치되어 있으나 현재 미사용이다. 추후 별도 브랜치에서 카드 가로 이동에 부드러운 스크롤링(관성·이징)을 적용할 계획이다.

### 이번 구현과의 관계

이번 구현은 lenis 통합 시 **전면 교체될 가능성이 높다**. 그럼에도 이번 브랜치를 먼저 진행하는 이유:

1. **검증 먼저.** 휠 입력 → 카드 이동이 UX적으로 기대한 대로 작동하는지 먼저 확인한 뒤, 스무딩 층을 얹는 게 안전하다.
2. **행동 계약 확정.** TDD 테스트(`wheelDeltaToX` 방향·민감도)가 **lenis 통합 이후에도 만족해야 하는 행동 계약**을 코드로 고정한다. lenis 버전이 이 테스트를 통과하면 회귀 없음.
3. **작은 단위로 검토.** `/ship` 시 PR 단위가 작아야 리뷰·revert가 쉽다.

### 예상 통합 경로 (이번 스코프 아님, 참고용)

Option A — **framer-motion `useSpring` 중간층 (최소 변경):**
```ts
const xTarget = useMotionValue(0)           // 휠이 쓰는 대상 값
const x = useSpring(xTarget, { stiffness: 120, damping: 20 })  // 실제 렌더용
// wheel 핸들러는 xTarget.set(...)으로 변경, 렌더는 x 사용
```
- **장점:** lenis 도입 안 하고도 부드러움 확보. 최소 변경.
- **단점:** 사용자가 lenis 패키지를 명시적으로 선호하는 경우 맞지 않음.

Option B — **Lenis virtual scroll + hero-scoped wrapper:**
- Lenis 인스턴스를 hero `<section>` wrapper로 한정 생성
- `lenis.on('scroll', ({ scroll, velocity }) => { x.set(...) })`
- 현재 `useEffect` 전체를 Lenis 구독으로 교체
- **장점:** lenis 네이티브. 속도/관성 무료.
- **단점:** lenis의 가상 scroll 축이 세로인데 우리는 가로 이동이 필요 → 축 매핑 로직 필요. wrapper/content 구조 변경 필요.

Option C — **Lenis 페이지 전역 + 이벤트 구독:**
- Lenis를 앱 루트에 적용
- `lenis.on('scroll', (e) => { if (heroInViewport) x.set(...) })`
- **장점:** 앱 전체의 스크롤이 부드러워짐 (About 페이지 등)
- **단점:** hero가 세로로 scroll되면 안 되므로 hero 구간에서 lenis를 멈추거나 무시하는 로직 필요

어느 옵션으로 갈지는 lenis 통합 브랜치에서 결정한다. 이번 브랜치의 TDD 테스트가 통과 조건이다.

### 이번 구현의 lenis-친화성

현재 설계가 lenis 통합을 **방해하지 않는** 이유:

- 휠 로직은 하나의 `useEffect`에 고립 → 통째로 교체 가능
- 순수 함수 `wheelDeltaToX`는 방향·sensitivity 단위를 정의 → lenis 통합 시 동일 sensitivity 적용해 UX 일관성 유지 가능
- `x` MotionValue는 lenis와도 호환 (lenis가 그 값에 쓰면 됨)
- `x.on('change')` 무한 루프 핸들러는 입력 소스와 무관 → lenis가 x에 쓰든, 드래그가 쓰든, wheel이 쓰든 동일하게 작동

---

## Open Questions

없음. 이번 스코프에서 결정할 것은 모두 결정됨:
- 방향: 스크롤 다운 → 카드 왼쪽 (auto-scroll과 일치)
- 민감도: 2.0 (상수화, 추후 조정 가능)
- TDD: `wheelDeltaToX` 순수 함수 테스트
- 커플링: 없음 (read-only `x` 외 다른 상태 건드리지 않음)
- 스무딩: 이번 스코프 밖. lenis 통합 브랜치에서 별도 결정.
