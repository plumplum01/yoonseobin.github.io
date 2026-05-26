
## 프로젝트 규칙

- 기능 추가 시 항상 브랜치를 먼저 생성한 뒤 작업한다
- 브랜치를 닫을 때는 항상 기능 리뷰 및 테스트를 진행한 후 머지한다
- 커밋 전에는 항상 `npm run test:run`과 `npx vite build`로 회귀 없음을 확인한다

## 콘텐츠 구조 및 CMS 전환 계획

- `packages/types`를 콘텐츠 타입의 SSOT로 둔다
- `packages/sanity`는 Sanity schema, query, client를 관리하는 CMS 패키지로 둔다
- `src/content`는 Sanity로 완전히 통합하기 전까지 사용하는 임시 로컬 콘텐츠 영역이다
- `src/content/data`는 로컬 콘텐츠 데이터, `src/content/assets`는 로컬 미디어 asset을 보관한다
- 앱 컴포넌트는 `src/content`나 Sanity에 직접 의존하지 않고 `src/lib/content`의 loader/adapter를 통해 콘텐츠를 사용한다
- `src/lib/content`는 현재 loader/adapter 역할이며, 추후 DOT(Data Orchestration/Translation) 계층으로 변경될 예정이다
- Sanity 통합 시에는 `src/lib/content`의 데이터 소스만 Sanity query 기반으로 교체하고, 앱 타입은 `packages/types` 기준을 유지한다
- Sanity asset CDN으로 전환되면 `src/content/assets`는 점진적으로 축소하거나 제거한다

## 앱 구조 규칙

- `src/app/router.tsx`에서 앱 페이지 모델(`pageRoutes`)과 React Router 변환 결과(`routes`)를 관리한다
- `src/app/layouts/RootLayout.tsx`는 전역 레이아웃이며 `GlobalNavigationBar`, `Cursor`, `Outlet`을 렌더링한다
- `src/pages`는 라우트 단위 화면을 보관하고, 파일명과 컴포넌트명은 `Home`, `About`처럼 페이지 이름을 그대로 사용한다
- `src/components/navigation/GlobalNavigationBar.tsx`는 전역 네비게이션 컴포넌트이다
- unit/integration 테스트는 `src/__test__`, E2E 테스트는 `tests/e2e`에 둔다
- 루트에는 Vite 엔트리인 `index.html`만 두고, 독립 개발용 HTML은 유지하지 않는다

## 기능 크기별 작업 모드

1인 포트폴리오라는 맥락에서 "스펙 → 플랜 → subagent TDD → 2단계 리뷰" 풀 체인은
대부분 과잉이다. 기능 크기에 맞춰 모드를 선택한다.

### "간단한 기능" 판단 기준 (세 가지 모두 충족)
- 예상 코드 변경량 ~100줄 이하
- 터치하는 파일 1~2개
- 신규 의존성 없음, 아키텍처 변경 없음

### 경량 모드 (간단한 기능)
- 스펙·플랜 문서 작성 **없음**
- `superpowers:brainstorming`, `superpowers:writing-plans`,
  `superpowers:subagent-driven-development` 스킬 호출 **없음**
- 서브에이전트 디스패치 **없음** (스펙 reviewer, code quality reviewer 포함)
- TDD는 **순수 함수에 한해** 적용. 계산·변환·검증 로직은 테스트 먼저 쓴다.
  DOM 이벤트 wiring, 스타일, 데이터 바인딩은 시각 검증으로 대체한다.
- 흐름: 브랜치 생성 → 구현 → `npm run test:run` + `npx vite build` 검증 → 커밋 → push

### 정식 모드 (큰 기능)
- 100줄 초과 또는 파일 3개 이상 또는 아키텍처 변경이 있을 때
- 스펙 → 플랜 → TDD → 리뷰 풀 체인 사용
- 여러 커밋으로 분할, 커밋마다 녹색 확인

### 명시적 오버라이드
사용자 지시가 기능 크기 판단을 덮어쓴다.
- "그냥 구현해", "스킬 안 써도 돼", "경량 모드" → 경량 모드
- "풀 프로세스로", "스펙부터", "정식 모드" → 정식 모드

### 모드와 무관하게 항상 유지
- 브랜치 생성
- 커밋 전 테스트/빌드 검증
- 머지 전 최종 리뷰
- 사용자의 기존 우커밋 변경(포맷터 등)이 working tree에 있으면 **기능 작업 전에 먼저 별도 커밋**

## Skill routing 우선순위

CLAUDE.md의 프로젝트 규칙이 아래 gstack skill routing보다 우선한다.
경량 모드 기준에 해당하면 skill routing을 적용하지 않고 경량 모드로 진행한다.

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health
