
## 프로젝트 규칙

- 기능 추가 시 항상 브랜치를 먼저 생성한 뒤 작업한다
- 브랜치를 닫을 때는 항상 기능 리뷰 및 테스트를 진행한 후 머지한다
- 커밋 전에는 항상 `npm run test:run`과 `npx vite build`로 회귀 없음을 확인한다

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
