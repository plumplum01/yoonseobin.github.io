# 기술 부채 트리아지 (2026-06-05)

전수검사 범위: `src` + `packages` 전체 (82개 파일 · 약 4,548 LOC, 테스트 제외).
세 축으로 분류한다.

- **god-state**: 거대한 단일 상태/스토어
- **제네릭**: 과하거나 실효 없는(장식적) TypeScript 제네릭
- **선언형 아님**: 리터럴/선언형으로 둘 수 있는데 명령형·절차형으로 작성된 부분

## 총평

- 이 코드베이스에 **진짜 "god-state"는 없다.** 상태는 오히려 컴포넌트별로 잘 분산돼 있다.
- 실제 부채는 세 갈래다.
  1. 한 컴포넌트에 책임이 몰린 **god-component**
  2. 선언해놓고 `as` 캐스팅으로 무력화한 **장식적 제네릭**
  3. 선언형 SSOT를 만들어두고 소비는 **명령형으로 회귀**하는 불일치
- 가장 큰 덩어리는 매퍼다. `client.ts`(외부 contract)와 `content.ts`(앱 모델)가 거의 동일한 구조를 **이중 정의**하고, 그 간극을 손으로 쓴 수백 줄 절차형 검증/변환으로 메운다. **타입 이중화가 곧 변환 비용**이다.

## 🔴 P1 — 핵심 (가장 큰 비용)

| 위치 | 축 | 문제 |
|---|---|---|
| `src/registry/mappers/postMapper.ts` (321줄), `profileMapper.ts` (171줄) | 선언형 아님 | 손으로 쓴 절차형 런타임 검증. `...(optionalString(raw,'x') ? { x: optionalString(raw,'x') } : {})` 패턴이 수십 번 반복(+`optionalString` 이중 호출). 두 파일이 `isRecord`/`requireString`/`optionalString`/`UnknownRecord`를 각자 중복 정의 |
| `packages/types/src/client.ts` ↔ `content.ts` | 선언형/구조 | `ClientPostBlock`(`_type:'textBlock'`) vs `PostBlock`(`type:'text'`), `ClientMediaAsset`(imageUrl/videoUrl) vs `MediaAsset`(url) — 거의 동일 구조 이중 정의가 위 매퍼 비용의 근원 |
| `src/components/features/projects/ContentContainer.tsx` (419줄) | god-component | 단일 컴포넌트에 5책임: 탭 전환 / 라이트박스(+키보드+prev·next) / 힌트 토스트(IntersectionObserver) / 이미지 로딩 추적 / SceneVideoPlayer. 라이트박스 인덱스 산술 `(i±1+n)%n`이 3곳(키보드·이전·다음) 중복 |

**권장 방향**
- 매퍼: zod 등 선언형 스키마 하나로 검증+변환+타입추론을 대체. 공통 검증 헬퍼는 단일 모듈로 통합.
- 타입: client/app 모델 이중화가 정말 필요한 경계인지 재검토. 필요하면 변환만 선언형으로, 불필요하면 단일화.
- ContentContainer: 라이트박스/토스트/탭을 별도 컴포넌트·훅으로 분리. 인덱스 순환 로직은 헬퍼 1개로.

## 🟡 P2 — 명확한 개선 여지

| 위치 | 축 | 문제 |
|---|---|---|
| `src/features/post-block-renderer/blockRegistry.tsx` | 장식적 제네릭 | `BlockComponent<TBlock extends PostBlock>` + mapped type `BlockRegistry`를 정교하게 선언했지만, 값에서 전부 `as RegisteredBlockComponent`로 캐스팅해 타입 안전성을 스스로 무력화. 제네릭이 실효 없음 → 단순화하거나 캐스팅 없이 타입을 살리거나 택일 |
| `src/components/layout/navigation/GlobalNavigationBar.tsx` | 선언형 회귀 | `pageRoutes`의 선언형 SSOT(`NAVIGATION_ROUTES`)를 만들어놓고 nav는 하드코딩 라벨("Articles"/"Projects"/"Research")+수동 배치로 명령형 회귀. `LINKS = Object.fromEntries(...)`로 타입 소실(`LINKS.home.path` 안전성 없음). `isMobile` dead variable. Projects·Research가 둘 다 `LINKS.home.path`(placeholder) |
| `src/components/features/home/hero/MobileHero.tsx` ↔ `DesktopHero.tsx` | 중복 | backdrop+오버레이 패널+ESC 핸들러+scrollLock+portal+닫기버튼이 거의 복붙. `selectedN:number` vs `selectedCard:obj` 차이뿐 → 공통 `<ProjectOverlay>`로 추출 가능 |

## 🟢 P3 — 경미

| 위치 | 축 | 문제 |
|---|---|---|
| `src/registry/projectLoader.ts` | 명령형 | `groupImagesByProject`/`groupScenesByProject`가 거의 동일한 `for`+`push` 그룹화 중복 → 공통 `groupBy`로 정리 가능 (동작은 정상) |
| `profileMapper.ts:144-155` | 제네릭/캐스팅 | `requireObjectArray<T>` 자체는 합리적이나 `item as unknown as ClientX` 이중 캐스팅으로 타입가드 우회 |

## ⚪ 양호 — 트리아지 불요 (참고: 오히려 모범)

- `src/app/routes/pageRoutes.tsx` — `as const satisfies`로 선언형 SSOT 모범
- `src/components/features/home/hero/constants.ts` — 선언형 상수 + 순수 함수(`stepHeroFrame`, 단위테스트됨)
- `src/components/ui/carousel.tsx` — 표준 shadcn compound + `Parameters<typeof>` 적절한 타입 추론
- `src/hooks/useScrollLock.ts` — 모듈 전역 `lockCount`는 reference-counting 패턴으로 정당
- `src/features/theme/themeStore.ts` — 최소 zustand store (god-state 아님)

## 우선순위 요약

부채 크기 순: **매퍼/타입 이중화(절차형)** > **ContentContainer god-component** > **장식적 제네릭·선언형 회귀** > 경미한 중복.
