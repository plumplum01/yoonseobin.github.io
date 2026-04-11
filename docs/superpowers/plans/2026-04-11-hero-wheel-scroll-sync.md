# Hero Wheel → Horizontal Scroll Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** DesktopHero에 마우스 휠/트랙패드 수직 입력을 카드 가로 이동으로 변환하는 리스너 하나를 추가한다. 기존 auto-scroll·드래그·오버레이 로직은 전혀 건드리지 않는다.

**Architecture:** 순수 함수 `wheelDeltaToX(deltaY, sensitivity)`에 방향 부호와 민감도 계산을 격리하고 TDD로 검증한다. `DesktopHero`는 `sectionRef`와 단일 `useEffect`로 네이티브 `wheel` 이벤트를 가로채 `preventDefault()` 후 그 순수 함수 결과를 `x` MotionValue에 가산한다. 세 가지 입력 소스(auto-scroll, drag, wheel)가 `x`에만 독립적으로 쓰므로 서로 커플링 없음. 기존 `x.on('change')` 경계 순간이동 핸들러가 휠 입력에도 자동 적용되어 무한 루프가 유지된다.

**Tech Stack:** React 19 · TypeScript · framer-motion (`useMotionValue`) · Vitest (jsdom globals)

**Spec:** `docs/superpowers/specs/2026-04-11-hero-wheel-scroll-sync-design.md`

**Branch:** `feat/hero-scroll-sync` (already created, based on `feat/css-design-system`)

---

## File Structure

| 파일 | 역할 | 상태 |
|---|---|---|
| `src/components/hero/constants.ts` | `WHEEL_SENSITIVITY` 상수 + `wheelDeltaToX` 순수 함수 추가 | 수정 |
| `src/components/hero/DesktopHero.tsx` | `sectionRef` 선언 + `<section>`에 ref 연결 + wheel `useEffect` 추가 | 수정 |
| `src/test/heroScroll.test.ts` | `wheelDeltaToX` 단위 테스트 5개 | 신규 |

**Not modified:** 나머지 모든 파일. 특히 `DesktopHero.tsx`의 기존 drag 핸들러, `useAnimationFrame` auto-scroll, `selectedCardRef` 오버레이 로직은 손대지 않는다.

---

## Task 1: `wheelDeltaToX` 순수 함수 TDD

휠 입력 → 카드 x 변위 변환 로직을 순수 함수로 격리하고 먼저 테스트를 작성한다. 방향 부호와 민감도 계산의 올바름을 이 테스트가 고정한다. 이 테스트는 추후 lenis 통합 시에도 동일한 계약으로 작동해야 한다.

**Files:**
- Create: `src/test/heroScroll.test.ts`
- Modify: `src/components/hero/constants.ts` (line 46 끝에 append)

- [ ] **Step 1: 실패하는 테스트 파일 작성**

`src/test/heroScroll.test.ts` 생성:

```ts
import { wheelDeltaToX, WHEEL_SENSITIVITY } from '../components/hero/constants'

describe('wheelDeltaToX', () => {
  it('스크롤 다운(deltaY 양수)은 x를 감소시켜 카드를 왼쪽으로 이동시킨다', () => {
    expect(wheelDeltaToX(100, 2)).toBe(-200)
  })

  it('스크롤 업(deltaY 음수)은 x를 증가시켜 카드를 오른쪽으로 이동시킨다', () => {
    expect(wheelDeltaToX(-100, 2)).toBe(200)
  })

  it('deltaY가 0이면 0을 반환한다', () => {
    expect(wheelDeltaToX(0, 2)).toBe(0)
  })

  it('sensitivity가 0이면 deltaY와 무관하게 0을 반환한다', () => {
    expect(wheelDeltaToX(100, 0)).toBe(0)
  })

  it('트랙패드의 fractional deltaY도 정확히 처리한다', () => {
    expect(wheelDeltaToX(7.5, 2)).toBe(-15)
  })
})

describe('WHEEL_SENSITIVITY', () => {
  it('양수 상수로 정의되어 있다', () => {
    expect(WHEEL_SENSITIVITY).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm run test:run -- src/test/heroScroll.test.ts`
Expected: FAIL — `Failed to resolve import "../components/hero/constants"` 또는 `wheelDeltaToX is not exported` 에러.

- [ ] **Step 3: `constants.ts`에 구현 추가**

`src/components/hero/constants.ts`의 45번째 줄 `}` 다음(파일 끝)에 다음 섹션을 append:

```ts

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
 * 순수 함수라 단위 테스트 가능. 추후 lenis 통합 시에도 같은 계약을
 * 만족해야 한다.
 */
export function wheelDeltaToX(deltaY: number, sensitivity: number): number {
  return -deltaY * sensitivity
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm run test:run -- src/test/heroScroll.test.ts`
Expected: `Test Files  1 passed (1)` / `Tests  6 passed (6)`

- [ ] **Step 5: 전체 테스트 스위트 회귀 확인**

Run: `npm run test:run`
Expected: `Test Files  5 passed (5)` / `Tests  29 passed (29)` (기존 23 + 신규 6)

- [ ] **Step 6: 타입체크**

Run: `npx tsc -p tsconfig.app.json --noEmit`
Expected: 출력 없음 (에러 없음)

- [ ] **Step 7: 커밋**

```bash
git add src/components/hero/constants.ts src/test/heroScroll.test.ts
git commit -m "$(cat <<'EOF'
feat: add wheelDeltaToX pure function for hero scroll conversion

휠 deltaY → 카드 x 이동량 변환을 순수 함수로 격리. 방향 부호(스크롤 다운
→ x 감소 → 카드 왼쪽 이동)는 기존 auto-scroll과 일치시켜 유휴·수동 흐름
일관성 확보. WHEEL_SENSITIVITY 상수로 튜닝 노출.

TDD: 단위 테스트 6개 (방향·zero·sensitivity·fractional) 먼저 작성해
행동 계약을 고정. 추후 lenis 통합 브랜치도 동일 계약을 만족해야 한다.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: `DesktopHero`에 wheel 리스너 연결

Task 1에서 만든 순수 함수를 DOM에 연결한다. 단일 `useEffect` 안에서 native `wheel` 이벤트를 `{ passive: false }`로 등록해 `preventDefault()`로 페이지 세로 스크롤을 차단하고, `wheelDeltaToX` 결과를 `x` MotionValue에 가산한다.

**Files:**
- Modify: `src/components/hero/DesktopHero.tsx` (import, 컴포넌트 선언 상단, `useEffect` 추가, `<section>` ref)

- [ ] **Step 1: import 수정 — 기존 constants import에 새 식별자 2개 추가**

현재 `src/components/hero/DesktopHero.tsx:24-31` 블록:

```tsx
import {
    DESKTOP_ITEMS,
    DESKTOP_ITEM_WIDTH_VW,
    DESKTOP_ITEM_GAP,
    AUTO_SCROLL_SPEED,
    ITEM_COUNT,
    type SelectedCard,
} from "./constants";
```

다음으로 교체 (`WHEEL_SENSITIVITY`, `wheelDeltaToX` 추가):

```tsx
import {
    DESKTOP_ITEMS,
    DESKTOP_ITEM_WIDTH_VW,
    DESKTOP_ITEM_GAP,
    AUTO_SCROLL_SPEED,
    ITEM_COUNT,
    WHEEL_SENSITIVITY,
    wheelDeltaToX,
    type SelectedCard,
} from "./constants";
```

- [ ] **Step 2: `sectionRef` 선언 추가**

`DesktopHero.tsx:41` `oneSetWidthRef` 선언 바로 다음 줄에 신규 `sectionRef` 선언을 삽입한다.

현재 41-47번째 줄:

```tsx
    /** 카드 한 세트의 전체 너비 (px) — resize 시 재계산 */
    const oneSetWidthRef = useRef(0);

    /** 드래그 중 여부 — 자동 스크롤 일시 정지에 사용 */
    const isDragging = useRef(false);

    /** 드래그가 실제로 발생했는지 — 드래그 후 onClick 방지 */
    const hasDragged = useRef(false);
```

다음으로 교체 (사이에 `sectionRef` 한 블록 추가):

```tsx
    /** 카드 한 세트의 전체 너비 (px) — resize 시 재계산 */
    const oneSetWidthRef = useRef(0);

    /** wheel 이벤트 리스너를 붙일 section 엘리먼트 참조 */
    const sectionRef = useRef<HTMLElement>(null);

    /** 드래그 중 여부 — 자동 스크롤 일시 정지에 사용 */
    const isDragging = useRef(false);

    /** 드래그가 실제로 발생했는지 — 드래그 후 onClick 방지 */
    const hasDragged = useRef(false);
```

- [ ] **Step 3: wheel `useEffect` 블록 추가**

`DesktopHero.tsx:127` (`lock/unlock useEffect`의 닫는 `}`) 다음, `128` (`// ─── 렌더 ───` 주석) 사이에 새 `useEffect` 블록을 삽입한다.

현재 122-130번째 줄:

```tsx
    // ─── 오버레이 열릴 때 body 스크롤 잠금 ───────────────────────────────────

    useEffect(() => {
        if (selectedCard) lock();
        else unlock();
    }, [selectedCard, lock, unlock]);

    // ─── 렌더 ─────────────────────────────────────────────────────────────────
```

다음으로 교체 (사이에 wheel useEffect 블록 추가):

```tsx
    // ─── 오버레이 열릴 때 body 스크롤 잠금 ───────────────────────────────────

    useEffect(() => {
        if (selectedCard) lock();
        else unlock();
    }, [selectedCard, lock, unlock]);

    // ─── 휠 → 가로 이동 연결 ────────────────────────────────────────────────
    // section 위에서 세로 휠/트랙패드 입력을 가로 x 이동으로 변환한다.
    // preventDefault()로 페이지 세로 스크롤을 차단하려면 { passive: false } 필수.
    // 기존 auto-scroll, drag, 오버레이 로직과 커플링 없음 — 오직 x에만 쓴다.

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            x.set(x.get() + wheelDeltaToX(e.deltaY, WHEEL_SENSITIVITY));
        };
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, [x]);

    // ─── 렌더 ─────────────────────────────────────────────────────────────────
```

- [ ] **Step 4: `<section>` 엘리먼트에 `ref` 연결**

`DesktopHero.tsx:132`:

```tsx
        <section className={styles.section}>
```

다음으로 교체:

```tsx
        <section ref={sectionRef} className={styles.section}>
```

- [ ] **Step 5: 타입체크 (회귀 없음)**

Run: `npx tsc -p tsconfig.app.json --noEmit`
Expected: 출력 없음

- [ ] **Step 6: 전체 테스트 스위트 회귀 확인**

Run: `npm run test:run`
Expected: `Test Files  5 passed (5)` / `Tests  29 passed (29)`

- [ ] **Step 7: 빌드 확인**

Run: `npx vite build`
Expected: `✓ built in ...ms`, 번들 파일 목록 출력, 에러 없음

- [ ] **Step 8: 커밋**

```bash
git add src/components/hero/DesktopHero.tsx
git commit -m "$(cat <<'EOF'
feat: wire wheel listener in DesktopHero to drive card x motion

DesktopHero <section>에 sectionRef와 wheel useEffect 추가. 네이티브
wheel 이벤트를 { passive: false }로 캡처해 preventDefault() 후
wheelDeltaToX(deltaY, WHEEL_SENSITIVITY)를 x MotionValue에 가산.

기존 로직(auto-scroll useAnimationFrame, drag 핸들러, 경계 순간이동,
오버레이 selectedCardRef)은 전혀 수정하지 않음. 오버레이 열림 중 휠
차단은 portal 기반 DOM 격리로 자동 처리됨. 무한 루프는 기존 x.on('change')
핸들러가 휠 입력에도 그대로 적용되어 유지됨.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 9: 시각 검증 안내 (구현자가 수행)**

Run: `npm run dev`

브라우저에서 다음을 확인:

1. 데스크탑 뷰포트(`≥ 768px`)에서 히어로 위에 마우스 올림
2. 마우스 휠 아래로 → 카드가 **왼쪽으로** 이동 (스크롤 다운 방향과 일치)
3. 마우스 휠 위로 → 카드가 **오른쪽으로** 이동
4. 트랙패드 두 손가락 아래/위 제스처로도 동일 동작
5. 휠을 멈추고 가만히 두면 유휴 auto-scroll(왼쪽 흐름)이 계속 작동
6. 히어로에서 세로 스크롤해도 페이지가 아래로 안 내려감 (preventDefault 작동)
7. 드래그(클릭-홀드-드래그)로도 여전히 카드 이동 가능 (기존 동작 보존)
8. 카드 클릭 → 오버레이 열림. 오버레이 열린 상태에서 휠 돌려도 뒤의 카드는 움직이지 않음
9. 오버레이 닫기 → 히어로 wheel 동작 다시 정상
10. 모바일 뷰포트(< 768px)로 리사이즈 → MobileHero가 세로 스크롤 유지 (휠 feature 영향 없음)

문제 발견 시 `git revert HEAD~1..HEAD`로 두 커밋 되돌리고 재설계.

---

## Self-Review

### Spec coverage

| Spec 요구사항 | 커버 위치 |
|---|---|
| F1. Wheel → X 변환 | Task 2 Step 3 (useEffect) |
| F2. 방향 일관성 (다운 → 왼쪽) | Task 1 Step 1 (test) + Step 3 (`wheelDeltaToX`) |
| F3. 무한 루프 유지 | 수정 없음 (기존 `x.on('change')`가 자동 적용) |
| F4. Auto-scroll 공존 | Task 2에서 auto-scroll 로직 건드리지 않음 |
| F5. Drag 공존 | Task 2에서 drag 로직 건드리지 않음 |
| F6. 페이지 세로 스크롤 차단 | Task 2 Step 3 (`preventDefault()` + `{ passive: false }`) |
| F7. MobileHero 영향 없음 | MobileHero 파일 touch 없음 |
| NF1. 단일 진입점 | Task 2 Step 3 (단일 useEffect) |
| NF2. 의존성 최소화 | Task 2에서 `isDragging`/`hasDragged`/`selectedCardRef` 접근 없음 |
| NF3. 삭제 용이 | 변경 블록 4개(import 2줄 · ref 1줄 · useEffect 1개 · `<section ref>` 1곳)로 국한 |
| NF4. TDD | Task 1이 먼저, Task 2가 나중 (pure function 테스트 → DOM 연결) |

모든 요구사항 커버됨.

### Placeholder scan

- TBD/TODO: 없음
- "적절한 에러 처리 추가": 없음 (에러 경로는 `sectionRef.current` null 체크 하나로 명시)
- "Task N과 유사": 없음
- 미정의 타입/함수/메서드 참조: 없음 (`WHEEL_SENSITIVITY`, `wheelDeltaToX`, `sectionRef`, `HTMLElement` 전부 정의됨)

클린.

### Type consistency

- `wheelDeltaToX(deltaY: number, sensitivity: number): number` — Task 1 Step 3에서 정의, Task 2 Step 3에서 정확히 같은 시그니처로 호출
- `WHEEL_SENSITIVITY: number` — Task 1 Step 3에서 정의, Task 2 Step 3에서 참조
- `sectionRef: React.RefObject<HTMLElement>` — Task 2 Step 2에서 `useRef<HTMLElement>(null)`로 선언, Step 3에서 `.current` 접근, Step 4에서 `<section ref={sectionRef}>` 연결

일관됨.

### Coupling 검증

플랜에서 기존 다음 식별자들에 **접근하지 않는다**:
- `isDragging.current`
- `hasDragged.current`
- `selectedCardRef.current`
- `useAnimationFrame` 콜백
- `useScrollLock`
- `lock`, `unlock`
- `selectedCard` state
- 기존 `useEffect` 블록 (리사이즈, `x.on('change')`, keydown, lock/unlock)

`x` MotionValue만 공유. 스펙의 커플링 매트릭스와 일치.

---

## Rollback Plan

문제 시:

```bash
git log --oneline -3
# 두 커밋 확인:
# <sha-B> feat: wire wheel listener in DesktopHero to drive card x motion
# <sha-A> feat: add wheelDeltaToX pure function for hero scroll conversion

git revert <sha-B> <sha-A>
# 또는
git reset --hard HEAD~2  # (브랜치에서 unpushed 상태라면)
```

두 커밋 모두 revert해도 다른 기능에 파급 없음. 플랜 본문과 스펙이 약속한 격리 설계 덕분.
