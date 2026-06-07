
## 프로젝트 규칙

- 기능 추가 시 항상 브랜치를 먼저 생성한 뒤 작업한다
- 브랜치를 닫을 때는 항상 기능 리뷰 및 테스트를 진행한 후 머지한다
- 커밋 전에는 항상 `npm run test:run`과 `npx vite build`로 회귀 없음을 확인한다

## 브랜치 네이밍 규칙

- 브랜치명은 `<type>/<kebab-case-summary>` 형식을 사용한다
- 이슈 트래커를 사용하는 경우 `<type>/<issue-number>-<kebab-case-summary>` 형식을 사용할 수 있다
- 작업자 개인 prefix(`codex/`, `seobin/` 등)는 기본적으로 사용하지 않는다
- summary는 작업 의도를 짧고 구체적으로 작성하며, 공백 대신 하이픈을 사용한다
- 허용하는 type은 아래를 기준으로 한다
  - `feature`: 새 기능
  - `fix`: 버그 수정
  - `hotfix`: 운영 긴급 수정
  - `release`: 릴리스 준비
  - `chore`: 설정, 의존성, 빌드 등 기능 외 작업
  - `refactor`: 동작 변경 없는 구조 개선
  - `docs`: 문서 변경
  - `test`: 테스트 추가 또는 수정
  - `style`: 포맷, 스타일 등 비기능 변경
  - `perf`: 성능 개선
  - `ci`: CI/CD 설정 변경
- 예시는 아래와 같다
  - `feature/home-about-section`
  - `fix/mobile-overlay-scroll`
  - `chore/update-branch-guideline`
  - `refactor/project-loader`
  - `docs/content-migration-plan`

## 콘텐츠 구조 및 CMS 전환 계획

- `packages/types`를 콘텐츠 타입의 SSOT로 둔다
- `packages/sanity`는 Sanity schema, query, client를 관리하는 CMS 패키지로 둔다
- `src/data`는 Sanity로 완전히 통합하기 전까지 사용하는 임시 로컬 원본 데이터/미디어 영역이다
- `src/data/media`는 로컬 미디어 asset을 보관한다
- 앱 컴포넌트는 `src/data`나 Sanity에 직접 의존하지 않고 `src/registry`를 통해 데이터를 사용한다
- `src/registry`는 현재 앱 데이터 registry 역할이며, 추후 DOT(Data Orchestration/Translation) 계층으로 변경될 예정이다
- 앱 컴포넌트는 Sanity client, GROQ query, Sanity 원본 필드 구조를 직접 알지 않는다
- Sanity query 결과는 `src/registry/resolvers`에서 `packages/types`의 앱 view model로 변환한 뒤 소비한다
- Sanity reference 해소는 GROQ projection에서 처리하고, 앱은 펼쳐진 결과를 resolver로 검증/정규화한다
- Sanity 통합 시에는 `src/registry`의 데이터 소스만 Sanity query 기반으로 교체하고, 앱 타입은 `packages/types` 기준을 유지한다
- Sanity asset CDN으로 전환되면 `src/data/media`는 점진적으로 축소하거나 제거한다

## CMS 블록 추가 절차

새 post block을 추가할 때는 Studio 입력, Sanity projection, 앱 view model, parser, renderer가 같은 block type 이름으로 끝까지 이어져야 한다.

### 블록 경계

- `packages/sanity/src/schemas/blockContent.ts`는 Sanity Studio 입력 schema만 정의한다.
- `packages/sanity/src/queries.ts`는 Sanity 원본 block을 앱 payload shape로 projection한다.
- `packages/types/src/content.ts`는 앱이 소비하는 최종 `PostBlock` view model의 SSOT이다.
- `src/registry/mappers/parsePost.ts`는 projection payload를 검증하고 `packages/types` view model로 변환한다.
- `src/features/block-renderer`는 `PostBlock` 배열을 block UI 컴포넌트로 라우팅하는 얇은 renderer 인프라이다.
- `src/components/blocks/post`는 개별 post block UI와 해당 UI 전용 helper를 보관한다. 특정 block 하나에만 쓰는 helper는 `features/block-renderer`가 아니라 해당 block 컴포넌트 근처에 둔다.

### 체크리스트

1. `packages/sanity/src/schemas/blockContent.ts`에 Sanity block schema를 추가한다.
   - 반복되는 media item 배열은 기존 helper를 우선 재사용한다.
2. `packages/sanity/src/queries.ts`의 `postBySlugQuery` `blocks[]` projection에 `_type == "...Block"` 분기를 추가한다.
   - projection 결과의 `"type"` 값은 앱 `PostBlock['type']`과 정확히 같아야 한다.
   - reference는 query에서 펼쳐서 앱에 넘긴다.
3. `packages/types/src/content.ts`에 block interface를 추가하고 `PostBlockType`, `PostBlock` union에 포함한다.
4. `src/registry/mappers/parsePost.ts`에 parser를 추가하고 `blockParsers` registry에 등록한다.
   - `mediaItems` 기반 block은 기존 `parseMediaItemsBlock` helper를 우선 사용한다.
5. `src/components/blocks/post/<BlockName>Block.tsx`에 UI 컴포넌트를 추가하고 `src/components/blocks/post/index.ts`에서 export한다.
6. `src/features/block-renderer/BlockRenderer.tsx`의 `blockComponents` registry에 새 block component를 등록한다.
7. 테스트를 추가하거나 갱신한다.
   - 순수 변환은 `src/__test__/parsePost.test.ts`에서 parser 결과를 확인한다.
   - 렌더링은 `src/__test__/blockRenderer.test.tsx`에서 실제 block UI가 노출되는지 확인한다.
8. 검증은 최소 `npm run test:run`과 `npx vite build`를 실행한다.
   - 커밋 전에는 프로젝트 규칙에 따라 두 명령 모두 녹색이어야 한다.
   - 전체 타입 경계를 확인할 때는 `npm run build`도 실행한다.

## 앱 구조 규칙

- `src/app/router.tsx`에서 앱 페이지 모델(`pageRoutes`)과 React Router 변환 결과(`routes`)를 관리한다
- 페이지별 smooth scroll 사용 여부는 `pageRoutes[].smoothScroll`에서 관리한다
- `src/app/layouts/RootLayout.tsx`는 전역 레이아웃이며 `GlobalNavigationBar`, `Cursor`, `Outlet`을 렌더링한다
- `src/pages`는 라우트 단위 화면을 보관하고, 파일명과 컴포넌트명은 `Home`, `About`처럼 페이지 이름을 그대로 사용한다
- `src/components/ui`는 shadcn 같은 외부 UI primitive 도입을 위한 예약 영역으로 둔다
- `src/components/layout`은 전역 앱 셸과 레이아웃성 컴포넌트를 보관한다
- `src/components/layout/navigation/GlobalNavigationBar.tsx`는 전역 네비게이션 컴포넌트이다
- `src/components/blocks`는 CMS block renderer처럼 콘텐츠 블록 단위로 재사용될 컴포넌트를 보관한다
- `src/components/features`는 home, projects, theme처럼 기능/도메인 의도가 있는 UI 컴포넌트를 보관한다
- `*.module.css`는 deprecated로 간주하고, 신규 스타일은 cva + Tailwind utility 기반으로 작성한다
- 기존 `*.module.css`는 기능 개발 과정에서 점진적으로 제거한다
- 커스텀 typography utility였던 `src/styles/typography.css`는 제거되었고, Tailwind text utility로 대체한다
- 한국어/일본어/중국어처럼 CJK 본문 줄바꿈이 필요한 긴 텍스트에는 `text-cjk` 유틸리티를 사용한다
- `src/components/ui`에는 cva 기반 primitive를 두고, class 조합은 `src/lib/cn.ts`의 `cn` 유틸리티를 사용한다
- `src/features`는 UI 컴포넌트가 아니라 상태, store, 비즈니스 로직 등 기능 단위 로직을 보관한다
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
