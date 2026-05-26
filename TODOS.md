# TODOS

## About.tsx + Contact.tsx 홈 섹션 구현
**What:** 홈 페이지에 About/Contact 섹션 콘텐츠 추가
**Why:** 현재 빈 `<section></section>`으로 렌더링됨. 포트폴리오가 미완성으로 보임.
**Pros:** `src/pages/About.tsx`의 디자인 시스템 바로 재사용 가능, 빠른 구현
**Cons:** 디자인 확정 전 구현하면 나중에 다시 뜯어야 할 수 있음
**Context:** `src/pages/Home.tsx`에서 사용하는 홈 섹션 컴포넌트이나 두 컴포넌트 모두 `return <section></section>`
**Depends on:** 홈 섹션 디자인 확정

## Sanity 스키마 확장 검토
**What:** 현재 `post`/`blockContent` 중심 Sanity 스키마를 프로젝트 콘텐츠까지 수용할 수 있도록 확장할지 검토
**Why:** 현재 포트폴리오 프로젝트 데이터는 `ProjectData`/`Project`와 로컬 미디어 파일 매칭에 묶여 있고, 상세 UI가 `images.slice(1)`, `scenes`, `client` 조건 등을 직접 해석한다. Sanity 통합 전에 authoring schema와 앱 소비 view model의 경계를 다시 잡아야 한다.
**Pros:** Sanity 전환 시 `src/registry`/DOT 계층에서 stable view model을 만들 수 있고, UI가 CMS 원본 구조를 직접 알 필요가 없어진다.
**Cons:** 아직 project를 독립 document로 둘지, 기존 `post` 타입/blocks로 흡수할지 결정하기 이르다. 성급히 schema를 확정하면 콘텐츠 작성 경험이나 상세 화면 구조가 다시 흔들릴 수 있다.
**Context:** `packages/sanity/src/schemas/post.ts`와 `blockContent.ts`는 이미 있으나, project 전용 필드(period, role, client, tools, gallery, scenes, videos, notice 등)는 아직 스키마에 없다.
**Depends on:** 콘텐츠 소비 모델 재설계, 프로젝트 상세 화면 정보 구조 확정, Sanity 작성 경험 기준 결정
