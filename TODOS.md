# TODOS

## About.tsx + Contact.tsx 홈 섹션 구현
**What:** 홈 페이지에 About/Contact 섹션 콘텐츠 추가
**Why:** 현재 빈 `<section></section>`으로 렌더링됨. 포트폴리오가 미완성으로 보임.
**Pros:** `src/pages/About.tsx`의 디자인 시스템 바로 재사용 가능, 빠른 구현
**Cons:** 디자인 확정 전 구현하면 나중에 다시 뜯어야 할 수 있음
**Context:** `src/pages/Home.tsx`에서 사용하는 홈 섹션 컴포넌트이나 두 컴포넌트 모두 `return <section></section>`
**Depends on:** 홈 섹션 디자인 확정
